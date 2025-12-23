<template>
  <div id="total-study" class="flex justify-around gap-4 p-4 items-center bg-white w-full">
    <div class="flex flex-col gap-2 p-2">
      <h1>Total Study Time</h1>
      <div class="text-2xl font-bold">{{ formattedTime }}</div>
    </div>
    <MotivationQuote />
    <div class="flex gap-2">
      <div class="flex items-center gap-2">
        <label class="text-sm">Ders:</label>
        <select v-if="availableSubjects.length" v-model="subject" class="border rounded p-1">
          <option v-for="s in availableSubjects" :key="s" :value="s">{{ s }}</option>
        </select>
        <input v-else v-model="subject" placeholder="Ders adı" class="border rounded p-1" />
      </div>

      <button
        v-if="!activeSession"
        @click="startStudy"
        class="p-2 bg-[#8e1ccf] text-white rounded-lg w-fit shadow-md shadow-gray-500 hover:shadow-lg hover:bg-[#d10f97] cursor-pointer transition-all"
      >
        Start Study
      </button>

      <button
        v-else
        @click="endStudy"
        class="p-2 bg-green-500 text-white rounded-lg w-fit shadow-md shadow-gray-500 hover:shadow-lg hover:bg-green-600 cursor-pointer transition-all"
      >
        End Study
      </button>
    </div>
  </div>
  <hr class="text-gray-100 w-full" />
</template>

<script>
import { sessionAPI, settingsAPI } from '@/services/api'
import MotivationQuote from '@/components/UI/MotivationQuote.vue'
export default {
  components: { MotivationQuote },
  data() {
    return {
      activeSession: null,
      timer: 0, // seconds total elapsed
      intervalId: null,
      subject: '', // Kullanıcının seçtiği konu
      description: '', // Opsiyonel açıklama
      availableSubjects: [],
    }
  },

  computed: {
    formattedTime() {
      const totalSeconds = Math.floor(this.timer)
      const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0')
      const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0')
      const seconds = (totalSeconds % 60).toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
  },

  methods: {
    async fetchActiveSession() {
      try {
        // sessionAPI.getAll() may return an array or an object like { data: [...] }
        const raw = await sessionAPI.getAll()
        const sessions = Array.isArray(raw) ? raw : raw?.data || raw?.sessions || []

        const ongoing = sessions.find((s) => !s.endTime)
        if (ongoing) {
          this.activeSession = ongoing
          const elapsedSeconds = (Date.now() - new Date(ongoing.startTime)) / 1000
          this.timer = Math.floor(elapsedSeconds)
          this.startTimer()
        }
      } catch (error) {
        console.error('Aktif session alınamadı:', error)
      }
    },

    startTimer() {
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.timer += 1 // increase seconds
      }, 1000)
    },

    stopTimer() {
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = null
    },

    async startStudy() {
      if (this.activeSession) return
      if (!this.subject) {
        alert('Lütfen bir ders seçin')
        return
      }
      try {
        const newSession = {
          startTime: new Date(),
          subject: this.subject,
          description: this.description || '',
        }
        // sessionAPI.create may return session object or an object like { data: session }
        const raw = await sessionAPI.create(newSession)
        const session = raw?.data || raw
        this.activeSession = session
        this.timer = 0
        this.startTimer()
        console.log('Session başladı:', this.activeSession)
      } catch (error) {
        console.error('Session oluşturulamadı:', error)
      }
    },

    async endStudy() {
      if (!this.activeSession) return
      try {
        const updatedSession = {
          endTime: new Date(),
          productivityRating: 3,
          isActive: false,
        }
        await sessionAPI.update(this.activeSession._id, updatedSession)
        console.log('Session tamamlandı:', this.activeSession)
        this.activeSession = null
        this.stopTimer()
        this.timer = 0
      } catch (error) {
        console.error('Session bitirilemedi:', error)
      }
    },
  },

  async mounted() {
    await this.fetchActiveSession()
    try {
      const raw = await settingsAPI.getSettings()
      const settings = raw?.data || raw
      this.availableSubjects = settings?.subjects || []
      if (!this.subject && this.availableSubjects.length) this.subject = this.availableSubjects[0]
    } catch (err) {
      console.warn('Ayarlar okunamadi', err)
    }
  },

  beforeUnmount() {
    this.stopTimer()
  },

  beforeRouteLeave() {
    // Don't stop the timer when navigating, just clear the interval
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    return true
  },
}
</script>
