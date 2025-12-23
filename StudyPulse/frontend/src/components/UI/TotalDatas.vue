<template>
  <div class="bg-white p-4 flex flex-col gap-4">
    <h1 class="font-bold text-2xl mb-auto">Dashoard</h1>
    <div class="flex flex-wrap sm:flex-nowrap gap-4">
      <DataCards :datas="datas"></DataCards>
    </div>
  </div>
</template>

<script>
import DataCards from './DataCards.vue'
import { settingsAPI, tasksAPI } from '@/services/api'

export default {
  components: { DataCards },
  data() {
    return {
      datas: [
        { title: 'Derslerim', count: 0 },
        { title: 'Görevlerim', count: 0 },
        { title: 'Sınavlarım', count: 0 },
      ],
    }
  },
  methods: {
    async loadCounts() {
      try {
        const res = await settingsAPI.getSettings()
        const settings = res?.data || res
        const subjects = settings?.subjects || []
        this.datas[0].count = subjects.length
      } catch (err) {
        console.warn('Failed to load settings for counts', err)
      }

      try {
        const tasks = await tasksAPI.getAll()
        const arr = Array.isArray(tasks) ? tasks : tasks?.data || []
        this.datas[1].count = arr.length
      } catch (err) {
        console.warn('Failed to load tasks for counts', err)
        this.datas[1].count = 0
      }

      try {
        const raw = localStorage.getItem('exams')
        const arr = raw ? JSON.parse(raw) : []
        this.datas[2].count = arr.length
      } catch (e) {
        this.datas[2].count = 0
      }
    },
  },
  mounted() {
    this.loadCounts()
  },
}
</script>
