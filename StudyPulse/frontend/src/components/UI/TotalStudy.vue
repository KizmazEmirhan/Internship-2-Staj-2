<template>
  <div id="total-study" class="flex justify-around gap-4 p-4 items-center bg-white w-full">
    <div class="flex flex-col gap-2 p-2">
      <h1>Total Study Time</h1>
      <div class="text-2xl font-bold">{{ formattedTime }}</div>
    </div>

    <div class="flex gap-2">
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
import { sessionAPI } from '@/services/api'

export default {
  data() {
    return {
      activeSession: null,
      timer: 0, // Dakika cinsinden toplam süre
      intervalId: null,
      subject: '', // Kullanıcının seçtiği konu
      description: '', // Opsiyonel açıklama
    }
  },

  computed: {
    formattedTime() {
      const totalSeconds = Math.floor(this.timer * 60)
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
        const res = await sessionAPI.getAll()

        const ongoing = res.data.find((s) => !s.endTime)
        if (ongoing) {
          this.activeSession = ongoing
          const elapsed = (new Date() - new Date(ongoing.startTime)) / (1000 * 60)
          this.timer = elapsed
          this.startTimer()
        }
      } catch (error) {
        console.error('Aktif session alınamadı:', error)
      }
    },

    startTimer() {
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.timer += 1 / 60 // her saniye 1/60 dakika ekle
      }, 1000)
    },

    stopTimer() {
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = null
    },

    async startStudy() {
      if (this.activeSession) return
      try {
        const newSession = {
          startTime: new Date(),
          subject: this.subject || 'General',
          description: this.description || '',
        }
        const res = await sessionAPI.create(newSession)
        this.activeSession = res.data
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
