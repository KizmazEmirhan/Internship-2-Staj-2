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
              <div
                v-if="
                  editSession.name === 'Konu Anlatmı Çalışması' ||
                  editSession.name === 'Konu Tekrarı'
                "
              >
                <div class="flex flex-col">
                  <input
                    name=""
                    id="subject"
                    placeholder="Ders Adı"
                    class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                  />
                </div>
                <div class="flex flex-col">
                  <input
                    v-model="editSession.topic"
                    placeholder="Konu Adı"
                    class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                  />
                </div>
                <div class="flex flex-col">
                  <input
                    id="time"
                    v-model="editSession.time"
                    placeholder="Süre"
                    class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                  />
                </div>
              </div>

              <div v-else-if="editSession.name === 'Soru Çözümü'">
                <input type="text" placeholder="Ders Adı" />

                <input
                  id="question-count"
                  v-model="editSession.questionCount"
                  placeholder="Çözülen Soru Sayısı"
                  class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                />

                <input
                  id="time"
                  v-model="editSession.time"
                  placeholder="Süre"
                  class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                />
              </div>

              <div v-else>
                <input
                  v-model="editSession.name"
                  class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                />
                <input
                  v-model="editSession.time"
                  class="border border-gray-400 rounded-lg p-1 w-full mb-2"
                />
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
          <div class="rounded-lg bg-white p-6 shadow w-80 animate-modal-in">
            <h2 class="font-bold mb-2">Oturum Detayları</h2>
            <div>
              <p><strong>Oturum Adı:</strong> {{ showSession.name }}</p>
              <p><strong>Süre:</strong> {{ showSession.time }}</p>
              <p v-if="showSession.topic"><strong>Konu:</strong> {{ showSession.topic }}</p>
              <p v-if="showSession.questionCount">
                <strong>Çözülen Soru Sayısı:</strong> {{ showSession.questionCount }}
              </p>
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

export default {
  components: {
    SessionCard,
  },
  data() {
    return {
      sessions: [],
      showModal: false,
      editSession: {},
      showSessionDetailsModal: false,
    }
  },
  methods: {
    openEditModal(session) {
      this.editSession = { ...session }
      this.showModal = true
    },
    openSessionDetails(session) {
      this.showSession = { ...session }
      this.showSessionDetailsModal = true
    },
    async getSession() {
      try {
        const sessions = await getSessions()
        this.sessions = sessions || []
      } catch (err) {
        console.error('Could not load sessions', err)
        this.sessions = []
      }
    },
    saveEdit() {
      this.showModal = false
      // Burada düzenlenen session'ı sessions dizisine kaydedebilirsin
    },
  },
  mounted() {
    this.getSession()
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
