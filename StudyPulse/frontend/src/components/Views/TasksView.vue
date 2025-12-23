<template>
  <div class="p-4 bg-white w-full">
    <h2 class="font-bold text-xl mb-4">Görevlerim</h2>

    <div class="mb-4 flex items-center justify-between">
      <div>
        <button @click="openAdd" class="bg-[#8D1CCE] text-white px-3 py-1 rounded">Görev Ekle</button>
      </div>
    </div>

    <div v-if="loading">Yükleniyor...</div>

    <ul class="space-y-2">
      <li v-for="(t, i) in tasks" :key="t._id" class="p-3 border rounded flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2">
            <div class="font-medium">{{ t.title }}</div>
            <div v-if="isLate(t)" class="text-red-600 text-xs font-semibold">Gecikme!</div>
            <div v-else-if="isCompletedEarly(t)" class="text-yellow-600 text-xs font-semibold">Madalya 🏅</div>
          </div>
          <div class="text-sm text-gray-500">{{ t.description }}</div>
          <div class="text-sm mt-1">Tahmini Bitiş: {{ formatDate(t.dueDate) }}</div>
          <div v-if="t.completed" class="text-sm text-green-600">Tamamlandı: {{ formatDate(t.completedAt) }}</div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div>
            <button @click="toggleComplete(t)" class="px-2 py-1 rounded bg-green-500 text-white">{{ t.completed ? 'Geri Al' : 'Tamamlandı' }}</button>
          </div>
          <div>
            <button @click="editTask(t)" class="px-2 py-1 rounded bg-gray-500">Düzenle</button>
            <button @click="removeTask(t._id)" class="px-2 py-1 rounded bg-red-100 text-red-600 ml-2">Sil</button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div class="bg-white rounded p-4 shadow-lg w-full max-w-xl">
          <h3 class="font-bold mb-2">{{ editing ? 'Görevi Düzenle' : 'Yeni Görev' }}</h3>
          <form @submit.prevent="save">
            <div class="flex flex-col gap-2">
              <input v-model="form.title" class="border p-2 rounded" placeholder="Başlık" required />
              <textarea v-model="form.description" class="border p-2 rounded" placeholder="Açıklama (opsiyonel)"></textarea>
              <div class="flex gap-2 items-center">
                <label class="text-sm">Tahmini Bitiş</label>
                <input type="datetime-local" v-model="form.dueDateLocal" class="border p-1 rounded" />
                <select v-model="form.priority" class="border p-1 rounded">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button type="button" @click="closeModal" class="px-2 py-1 rounded bg-gray-200">İptal</button>
                <button type="submit" class="px-3 py-1 rounded bg-green-600 text-white">Kaydet</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { tasksAPI } from '@/services/api'

export default {
  data() {
    return {
      tasks: [],
      loading: false,
      showModal: false,
      editing: false,
      form: { title: '', description: '', dueDateLocal: null, dueDate: null, priority: 'medium', _id: null },
    }
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await tasksAPI.getAll()
        this.tasks = Array.isArray(res) ? res : res?.data || []
      } catch (err) {
        console.warn('Failed to load tasks', err)
        this.tasks = []
      } finally {
        this.loading = false
      }
    },
    openAdd() {
      this.editing = false
      this.form = { title: '', description: '', dueDateLocal: null, dueDate: null, priority: 'medium', _id: null }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    formatDate(d) {
      if (!d) return '-' 
      try { return new Date(d).toLocaleString('tr-TR') } catch(e){ return d }
    },
    async save() {
      try {
        // convert local to ISO
        if (this.form.dueDateLocal) this.form.dueDate = new Date(this.form.dueDateLocal).toISOString()
        const payload = {
          title: this.form.title,
          description: this.form.description,
          dueDate: this.form.dueDate,
          priority: this.form.priority,
        }
        if (this.editing && this.form._id) {
          await tasksAPI.update(this.form._id, payload)
        } else {
          await tasksAPI.create(payload)
        }
        await this.load()
        this.closeModal()
      } catch (err) {
        console.warn('Save failed', err)
      }
    },
    async editTask(t) {
      this.editing = true
      this.form = {
        title: t.title,
        description: t.description,
        dueDate: t.dueDate || null,
        dueDateLocal: t.dueDate ? new Date(t.dueDate).toISOString().slice(0,16) : null,
        priority: t.priority || 'medium',
        _id: t._id,
      }
      this.showModal = true
    },
    async removeTask(id) {
      if (!confirm('Bu görevi silmek istiyor musunuz?')) return
      try {
        await tasksAPI.delete(id)
        await this.load()
      } catch (err) {
        console.warn('Delete failed', err)
      }
    },
    async toggleComplete(t) {
      try {
        await tasksAPI.update(t._id, { completed: !t.completed })
        await this.load()
      } catch (err) {
        console.warn('Toggle failed', err)
      }
    },
    isLate(t) {
      if (!t.dueDate) return false
      if (t.completed) return false
      const due = new Date(t.dueDate)
      return new Date() > due
    },
    isCompletedEarly(t) {
      if (!t.dueDate || !t.completedAt) return false
      const due = new Date(t.dueDate)
      const completed = new Date(t.completedAt)
      return completed <= due
    },
  },
  async mounted() {
    await this.load()
  },
}
</script>

<style scoped>
/* minimal styling */
</style>
