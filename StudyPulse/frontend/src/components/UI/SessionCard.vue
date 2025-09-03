<template>
  <div v-if="!sessions || sessions.length === 0" class="text-sm text-gray-500">Hiç kayıt yok</div>
  <div
    v-for="session in sessions"
    :key="session.id || session._id"
    id="card"
    class="border-1 border-gray-200 rounded-lg flex w-full p-4 justify-between mb-2"
  >
    <div class="">
      <h1 class="text-sm">
        Ders : <b> {{ session.subject }}</b>
      </h1>
      <div class="">
        Etüt Süresi : <b>{{ formatDuration(session) }}</b>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div
        class="bg-gray-200 h-fit p-2 rounded-lg inset-shadow-gray-500/50 inset-shadow-sm text-xs"
      >
        {{ formatDate(session.createdAt) }}
      </div>

      <button
        @click="$emit('edit-session', session)"
        class="flex gap-2 items-center bg-green-200 h-fit p-2 shadow-green-500/50 shadow-sm rounded-lg text-xs hover:shadow-none transition-all cursor-pointer"
      >
        <i class="fa-solid fa-pen-to-square"></i>Düzenle
      </button>

      <button
        @click="$emit('show-session', session)"
        class="flex gap-2 items-center bg-blue-200 h-fit p-2 shadow-blue-500/50 shadow-sm rounded-lg text-xs hover:shadow-none transition-all cursor-pointer"
      >
        <i class="fa-solid fa-circle-info"></i>Detaylar
      </button>
    </div>
  </div>
</template>
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

<script>
export default {
  emits: ['edit-session', 'show-session'],
  props: {
    sessions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      editSession: {},
      showSession: {},
    }
  },
  methods: {
    openModal(session) {
      this.editSession = { ...session }
      this.showSession = { ...session }
      this.showModal = true
    },
    saveEdit() {
      this.showModal = false
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('tr-TR')
    },
    formatDuration(session) {
      if (!session.endTime) return 'Devam ediyor'
      const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)
      const hours = Math.floor(duration / 60)
      const minutes = Math.floor(duration % 60)
      return hours > 0 ? `${hours}s ${minutes}dk` : `${minutes}dk`
    },
  },
}
</script>
