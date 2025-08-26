<template>
  <div class="bg-white w-full grid sm:grid-cols-2 grid-cols-1 gap-4 p-4">
    <SessionCard :sessions="sessions" @edit-session="openEditModal" />
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded shadow w-80 animate-modal-in">
            <h2 class="font-bold mb-2">Düzenle</h2>
            <form @submit.prevent="saveEdit">
              <div v-if="editSession.name === 'Konu Anlatmı Çalışması' || editSession.name === 'Konu Tekrarı'">
                <input v-model="editSession.topic" placeholder="Konu Adı" class="border p-1 w-full mb-2" />
                <input v-model="editSession.time" placeholder="Süre" class="border p-1 w-full mb-2" />
              </div>
              <div v-else-if="editSession.name === 'Soru Çözümü'">
                <input v-model="editSession.questionCount" placeholder="Çözülen Soru Sayısı" class="border p-1 w-full mb-2" />
                <input v-model="editSession.time" placeholder="Süre" class="border p-1 w-full mb-2" />
              </div>
              <div v-else>
                <input v-model="editSession.name" class="border p-1 w-full mb-2" />
                <input v-model="editSession.time" class="border p-1 w-full mb-2" />
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <button type="button" @click="showModal = false" class="px-2 py-1 bg-gray-200 rounded">İptal</button>
                <button type="submit" class="px-2 py-1 bg-green-500 text-white rounded">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import SessionCard from './UI/SessionCard.vue'

export default {
  components: {
    SessionCard,
  },
  data() {
    return {
      sessions: [
        { id: 1, name: 'Soru Çözümü', time: '40:00', date: '01/01/2025' },
        { id: 2, name: 'Konu Anlatmı Çalışması', time: '50:00', date: '01/01/2025' },
        { id: 3, name: 'Konu Tekrarı', time: '70:00', date: '01/01/2025' },
        { id: 4, name: 'Soru Çözümü', time: '43:00', date: '01/01/2025' },
      ],
      showModal: false,
      editSession: {},
    }
  },
  methods: {
    openEditModal(session) {
      this.editSession = { ...session }
      this.showModal = true
    },
    saveEdit() {
      this.showModal = false
      // Burada düzenlenen session'ı sessions dizisine kaydedebilirsin
    },
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
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(.4,0,.2,1);
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to, .modal-fade-leave-from {
  opacity: 1;
}
</style>
