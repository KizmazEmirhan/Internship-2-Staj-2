<template>
  <div class="bg-white w-full grid sm:grid-cols-2 grid-cols-1 gap-4 p-4">
    <SessionCard
      :sessions="sessions"
      @edit-session="openEditModal"
      @show-session="openSessionDetails"
    />
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showModal"
          class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
        >
          <div class="rounded-lg bg-white p-6 shadow w-80 animate-modal-in">
            <h2 class="font-bold mb-2">Düzenle</h2>
            <form @submit.prevent="saveEdit">
              <!-- Unified edit form: subject, topic, questionCount, startTime, endTime -->
              <div class="flex flex-col">
                <label class="text-sm text-gray-600">Ders / Subject</label>
                <input v-model="editSession.subject" placeholder="Ders Adı" class="border border-gray-400 rounded-lg p-1 w-full mb-2" />
              </div>

              <div class="flex flex-col">
                <label class="text-sm text-gray-600">Konu / Topic</label>
                <input v-model="editSession.topic" placeholder="Konu Adı" class="border border-gray-400 rounded-lg p-1 w-full mb-2" />
              </div>

              <div class="flex flex-col">
                <label class="text-sm text-gray-600">Çözülen Soru Sayısı / Question Count</label>
                <input type="number" v-model.number="editSession.questionCount" placeholder="Soru Sayısı" class="border border-gray-400 rounded-lg p-1 w-full mb-2" />
              </div>

              <div class="flex flex-col">
                <label class="text-sm text-gray-600">Başlangıç Zamanı</label>
                <input type="datetime-local" v-model="editSession.startTimeLocal" class="border border-gray-400 rounded-lg p-1 w-full mb-2" />
              </div>

              <div class="flex flex-col">
                <label class="text-sm text-gray-600">Bitiş Zamanı</label>
                <input type="datetime-local" v-model="editSession.endTimeLocal" class="border border-gray-400 rounded-lg p-1 w-full mb-2" />
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  @click="showModal = false"
                  class="px-2 py-1 bg-gray-200 rounded"
                >
                  İptal
                </button>
                <button type="submit" class="px-2 py-1 bg-green-500 text-white rounded">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showSessionDetailsModal"
          class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
        >
          <div class="rounded-lg bg-white p-6 shadow w-96 animate-modal-in">
            <h2 class="font-bold mb-2">Oturum Detayları</h2>
            <div class="text-sm space-y-2">
              <p v-if="showSession.subject"><strong>Ders:</strong> {{ showSession.subject }}</p>
              <p v-if="showSession.topic"><strong>Konu:</strong> {{ showSession.topic }}</p>
              <p v-if="showSession.questionCount"><strong>Çözülen Soru Sayısı:</strong> {{ showSession.questionCount }}</p>
              <p v-if="showSession.startTime"><strong>Başlangıç:</strong> {{ formatDateTime(showSession.startTime) }}</p>
              <p v-if="showSession.endTime"><strong>Bitiş:</strong> {{ formatDateTime(showSession.endTime) }}</p>
              <p v-if="showSession.endTime"><strong>Süre:</strong> {{ formatDuration(showSession) }}</p>
              <p v-if="showSession.productivityRating"><strong>Verimlilik:</strong> {{ showSession.productivityRating }}/5</p>
              <p v-if="showSession.description"><strong>Açıklama:</strong> {{ showSession.description }}</p>
              <p v-if="showSession.createdAt"><strong>Oluşturulma:</strong> {{ formatDateTime(showSession.createdAt) }}</p>

              <div class="flex justify-end mt-4">
                <button
                  @click="showSessionDetailsModal = false"
                  class="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import SessionCard from '../UI/SessionCard.vue'
import { sessionAPI } from '@/services/api'
import api from '@/services/api'
export default {
  components: {
    SessionCard,
  },
  data() {
    return {
      sessions: [],
      showModal: false,
      editSession: {},
      showSession: {},
      showSessionDetailsModal: false,
    }
  },
  methods: {
    openEditModal(session) {
      // copy session and add local datetime fields for inputs
      this.editSession = { ...session }
      // helper local ISO without seconds for datetime-local input
      const toLocalInput = (d) => {
        if (!d) return null
        const dt = new Date(d)
        // format: yyyy-MM-ddTHH:mm
        const pad = (n) => String(n).padStart(2, '0')
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      }
      this.editSession.startTimeLocal = toLocalInput(session.startTime)
      this.editSession.endTimeLocal = toLocalInput(session.endTime)
      this.showModal = true
    },
    openSessionDetails(session) {
      this.showSession = { ...session }
      this.showSessionDetailsModal = true
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const d = new Date(dateString)
      return d.toLocaleString('tr-TR')
    },

    formatDuration(session) {
      if (!session || !session.startTime) return ''
      if (!session.endTime) return 'Devam ediyor'
      const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)
      const hours = Math.floor(duration / 60)
      const minutes = Math.floor(duration % 60)
  return hours > 0 ? `${hours} saat ${minutes} dk` : `${minutes} dk`
    },
    async getSession() {
      try {
        const raw = await sessionAPI.getAll()
        this.sessions = Array.isArray(raw) ? raw : raw?.data || raw?.sessions || []
      } catch (err) {
        console.error('Could not load sessions', err)
        this.sessions = []
      }
    },
    async saveEdit() {
      try {
        // convert local datetime inputs back to ISO strings
        const payload = { ...this.editSession }
        if (this.editSession.startTimeLocal) payload.startTime = new Date(this.editSession.startTimeLocal).toISOString()
        if (this.editSession.endTimeLocal) payload.endTime = new Date(this.editSession.endTimeLocal).toISOString()

        // cleanup helper fields
        delete payload.startTimeLocal
        delete payload.endTimeLocal

        console.log('saveEdit payload ->', payload)
        const response = await sessionAPI.update(this.editSession._id, payload)
        console.log('saveEdit response ->', response)
        this.showModal = false
        // Re-fetch sessions to make sure UI reflects saved data (fallback if SSE didn't arrive)
        await this.getSession()
        // backend zaten SSE ile güncelleme yayınlayacağı için
        // burada elle sessions dizisini değiştirmene gerek yok.
      } catch (err) {
        console.error('Session güncellenemedi', err)
      }
    },
  },
  mounted() {
    this.getSession()

    // SSE event listener - construct URL from api.defaults.baseURL so it matches dev/prod
    try {
      const token = localStorage.getItem('token')
      const base = api.defaults.baseURL || '' // e.g. 'http://localhost:4000/api'
      const streamUrl = `${base.replace(/\/$/, '')}/sessions/stream?token=${token}`

      this.eventSource = new EventSource(streamUrl)

      this.eventSource.addEventListener('session:update', (e) => {
        const updatedSession = JSON.parse(e.data)
        const index = this.sessions.findIndex((s) => s._id === updatedSession._id)
        if (index !== -1) {
          // güncelle
          this.sessions.splice(index, 1, updatedSession)
        } else {
          // yeni ekle
          this.sessions.push(updatedSession)
        }
      })

      this.eventSource.addEventListener('session:end', (e) => {
        const { id } = JSON.parse(e.data)
        this.sessions = this.sessions.filter((s) => s._id !== id)
      })
    } catch (err) {
      console.error('SSE başlatılamadı', err)
    }
  },
  beforeUnmount() {
    if (this.eventSource) {
      try {
        this.eventSource.close()
      } catch (e) {
        // ignore
      }
    }
  },
}
</script>

<style scoped>
@keyframes modal-in {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-modal-in {
  animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
</style>
