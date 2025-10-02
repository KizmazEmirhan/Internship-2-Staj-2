<template>
  <div class="p-4 bg-white w-full">
    <h2 class="font-bold text-xl mb-4">Dersler ve Çalışma Süreleri</h2>

    <div v-if="loading">Yükleniyor...</div>

    <div v-else>
      <div v-if="subjects.length === 0" class="text-gray-500">Henüz ders yok.</div>

      <ul class="space-y-2">
        <li
          v-for="s in subjects"
          :key="s.name"
          class="p-2 border rounded flex items-center justify-between"
        >
          <div>
            <div class="font-medium">{{ s.name }}</div>
            <div class="text-sm text-gray-500">Toplam: {{ s.totalMinutes }} dk</div>
          </div>
          <div class="w-1/2 ml-4">
            <div class="h-3 bg-gray-200 rounded">
              <div
                class="h-3 bg-green-500 rounded"
                :style="{ width: progressWidth(s.totalMinutes) }"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { sessionAPI, settingsAPI } from '@/services/api'

export default {
  data() {
    return {
      loading: true,
      subjects: [], // { name, totalMinutes }
      maxMinutes: 1,
    }
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const sRaw = await settingsAPI.getSettings()
        const settings = sRaw?.data || sRaw
        const subjectList = settings?.subjects || []

        // Try stats endpoint first
        let subjectDistribution = []
        try {
          const statsRaw = await sessionAPI.getStats()
          subjectDistribution = statsRaw?.subjectDistribution || statsRaw?.data?.subjectDistribution || []
        } catch (e) {
          console.warn('stats endpoint failed, will fallback to sessions', e)
          subjectDistribution = []
        }

        // If stats endpoint didn't return useful data, fetch sessions and compute totals locally
        let map = {}
        if (!subjectDistribution || subjectDistribution.length === 0) {
          try {
            const rawSessions = await sessionAPI.getAll()
            const sessions = Array.isArray(rawSessions) ? rawSessions : rawSessions?.data || rawSessions?.sessions || []
            sessions.forEach((s) => {
              const name = s.subject || 'Unknown'
              const dur = Number(s.duration) || 0
              map[name] = (map[name] || 0) + dur
            })
          } catch (e) {
            console.warn('Failed to load sessions for fallback totals', e)
          }
        } else {
          subjectDistribution.forEach((r) => {
            map[r._id || 'Unknown'] = r.totalMinutes || 0
          })
        }

        const arr = subjectList.map((name) => ({ name, totalMinutes: Math.round((map[name] || 0) * 100) / 100 }))
        this.subjects = arr
        this.maxMinutes = Math.max(1, ...arr.map((a) => a.totalMinutes))
      } catch (err) {
        console.error('Subjects yüklenemedi', err)
      } finally {
        this.loading = false
      }
    },
    progressWidth(totalMinutes) {
      const max = Number(this.maxMinutes) || 1
      const t = Number(totalMinutes) || 0
      const pct = max <= 0 ? 0 : Math.min(100, Math.round((t / max) * 100))
      return pct + '%'
    },
  },
  mounted() {
    this.load()
  },
}
</script>

<style scoped></style>
