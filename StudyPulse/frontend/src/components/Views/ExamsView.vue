<template>
  <div class="p-4 bg-white w-full">
    <h2 class="font-bold text-xl mb-4">Sınavlar</h2>

    <div class="mb-4 flex items-center justify-between flex-col lg:flex-row">
      <div>
        <button @click="openAdd" class="bg-[#8D1CCE] text-white px-3 py-1 rounded">
          Sınav Ekle
        </button>
      </div>
      <div class="flex items-center gap-3 w-1/2 flex-col lg:flex-row">
        <select v-model="selectedChartSubject" class="border rounded p-1">
          <option value="__all">Tüm Dersler</option>
          <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
        </select>
        <div class="flex-1">
          <canvas id="examChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Add Exam Modal -->
    <teleport to="body">
      <div v-if="showAdd" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div class="bg-white rounded p-4 shadow-lg">
          <h3 class="font-bold mb-2">Yeni Sınav Ekle</h3>
          <form @submit.prevent="saveExam">
            <div class="flex flex-col gap-2 overflow-auto max-h-[80vh]">
              <div>
                <div class="flex flex-col">
                  <label class="text-sm">Sınav Adı (yayını)</label>
                  <input
                    v-model="form.title"
                    class="border p-1 rounded"
                    placeholder="Örn: Matematik Vize"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-sm">Süresi (dakika)</label>
                  <input
                    type="number"
                    v-model.number="form.duration"
                    class="border p-1 rounded"
                    min="0"
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="mt-2">
                  <div class="font-medium mb-1">Derslere göre sonuçlar</div>
                  <div v-for="s in subjects" :key="s" class="p-2 border rounded mb-2">
                    <div class="flex items-center justify-between mb-1">
                      <div class="font-semibold">{{ s }}</div>
                      <div class="text-sm text-gray-500">
                        Net: <b>{{ computeNetFor(s) }}</b> — %: <b>{{ computePercentFor(s) }}%</b>
                      </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                      <div>
                        <label class="text-xs">Soru Sayısı</label>
                        <input
                          type="number"
                          :value="
                            formSubjects[s] &&
                            (formSubjects[s].correct || 0) +
                              (formSubjects[s].wrong || 0) +
                              (formSubjects[s].blank || 0)
                          "
                          disabled
                          class="border p-1 rounded w-full bg-gray-100"
                        />
                      </div>
                      <div>
                        <label class="text-xs">Doğru</label>
                        <input
                          type="number"
                          v-model.number="formSubjects[s].correct"
                          class="border p-1 rounded w-full"
                          min="0"
                        />
                      </div>
                      <div>
                        <label class="text-xs">Yanlış</label>
                        <input
                          type="number"
                          v-model.number="formSubjects[s].wrong"
                          class="border p-1 rounded w-full"
                          min="0"
                        />
                      </div>
                      <div>
                        <label class="text-xs">Boş</label>
                        <input
                          type="number"
                          v-model.number="formSubjects[s].blank"
                          class="border p-1 rounded w-full"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  @click="showAdd = false"
                  class="px-2 py-1 rounded bg-gray-200"
                >
                  İptal
                </button>
                <button type="submit" class="px-3 py-1 rounded bg-green-600 text-white">
                  Kaydet
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Exams list -->
    <div v-if="exams.length === 0" class="text-gray-500">Henüz eklenmiş sınav yok.</div>
    <ul class="mt-2 space-y-2">
      <li v-for="(e, idx) in exams" :key="e.id" class="p-3 border rounded">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium">{{ e.title || 'İsim yok' }}</div>
            <div class="text-sm text-gray-500">Süre: {{ e.duration }} dk</div>
            <div class="mt-2 text-sm">
              <ul class="space-y-1">
                <li v-for="sub in e.subjects" :key="sub.name" class="flex justify-between">
                  <span>{{ sub.name }}</span>
                  <span
                    >{{ sub.correct }}✅ / {{ sub.wrong }}❌ / {{ sub.blank }}↔ •
                    {{ sub.percent }}%</span
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="text-sm text-gray-500">{{ formatDate(e.date) }}</div>
            <div class="flex gap-2">
              <button @click="removeExam(idx)" class="text-red-500">Sil</button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Weekly analysis -->
    <div class="mt-6 bg-gray-50 border p-3 rounded">
      <h3 class="font-semibold mb-2">Haftalık Analiz (Bu Hafta)</h3>
      <div v-if="weeklyLoading">Yükleniyor...</div>
      <div v-else>
        <ul class="space-y-1">
          <li v-for="s in subjects" :key="s" class="flex justify-between p-1">
            <div>{{ s }}</div>
            <div>{{ weeklyStats[s] || 0 }} dk</div>
          </li>
        </ul>
        <div class="mt-3 flex gap-2">
          <button @click="downloadWeeklyCSV" class="bg-blue-600 text-white px-2 py-1 rounded">
            CSV İndir
          </button>
          <button @click="loadWeeklyStats" class="bg-gray-200 px-2 py-1 rounded">Yenile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { settingsAPI, sessionAPI } from '@/services/api'

export default {
  data() {
    return {
      showAdd: false,
      exams: [],
      form: {
        title: '',
        duration: 0,
        // note: per-subject data stored in formSubjects
      },
      chart: null,
      subjects: [],
      selectedChartSubject: '__all',
      weeklyLoading: false,
      weeklyStats: {},
      formSubjects: {},
    }
  },
  watch: {
    exams: {
      handler() {
        this.renderChart()
      },
      deep: true,
    },
    selectedChartSubject() {
      this.renderChart()
    },
    showAdd(newVal) {
      if (newVal) this.ensureFormSubjects()
    },
  },
  // no computed props required for per-subject form
  methods: {
    load() {
      try {
        const raw = localStorage.getItem('exams')
        const arr = raw ? JSON.parse(raw) : []
        // normalize older exams shape (single subject) to new shape
        this.exams = arr.map((e) => {
          if (e.subjects) return e
          // if old style had subject field or single subject, convert
          if (e.subject) {
            return {
              ...e,
              subjects: [
                {
                  name: e.subject,
                  questionCount: e.questionCount || 0,
                  correct: e.correct || 0,
                  wrong: e.wrong || 0,
                  percent: e.percent || 0,
                },
              ],
            }
          }
          return { ...e, subjects: [] }
        })
      } catch (e) {
        this.exams = []
      }
      // load subjects from settings
      this.loadSubjects()
      // load weekly stats
      this.loadWeeklyStats()
      // ensure formSubjects initialized
      this.ensureFormSubjects()
    },

    ensureFormSubjects() {
      if (!this.subjects || this.subjects.length === 0) this.subjects = ['General']
      const map = Object.assign({}, this.formSubjects || {})
      this.subjects.forEach((s) => {
        if (!map[s]) map[s] = { questionCount: 0, correct: 0, wrong: 0 }
      })
      this.formSubjects = map
    },
    openAdd() {
      // ensure subjects and formSubjects are ready before showing
      this.loadSubjects()
      this.ensureFormSubjects()
      this.showAdd = true
    },

    computeNetFor(subject) {
      const fs = this.formSubjects[subject] || { correct: 0, wrong: 0, blank: 0 }
      const net = (Number(fs.correct) || 0) - (Number(fs.wrong) || 0) / 4
      return Math.max(0, Math.round((net + Number.EPSILON) * 100) / 100)
    },
    computePercentFor(subject) {
      const fs = this.formSubjects[subject] || { correct: 0, wrong: 0, blank: 0 }
      const q = (Number(fs.correct) || 0) + (Number(fs.wrong) || 0) + (Number(fs.blank) || 0)
      if (q <= 0) return 0
      const net = (Number(fs.correct) || 0) - (Number(fs.wrong) || 0) / 4
      const pct = (net / q) * 100
      return Math.max(0, Math.min(100, Math.round((pct + Number.EPSILON) * 100) / 100))
    },
    async loadSubjects() {
      try {
        const res = await settingsAPI.getSettings()
        const settings = res?.data || res
        const list = settings?.subjects || []
        this.subjects = list && list.length > 0 ? list : ['General']
        // ensure default subject in form
        if (!this.form.subject && this.subjects.length > 0) this.form.subject = this.subjects[0]
      } catch (err) {
        console.warn('Failed to load settings subjects', err)
        this.subjects = ['General']
      }
    },
    saveExam() {
      if (!this.form.title) {
        alert('Sınav adı girin')
        return
      }

      // gather per-subject entries (validate totals)
      const subjectsArr = (this.subjects || []).map((s) => {
        const fs = this.formSubjects[s] || { correct: 0, wrong: 0, blank: 0 }
        const c = Number(fs.correct) || 0
        const w = Number(fs.wrong) || 0
        const b = Number(fs.blank) || 0
        const q = c + w + b
        // we allow q === 0 (no questions for that subject in this exam)
        const net = Math.max(0, Math.round((c - w / 4 + Number.EPSILON) * 100) / 100)
        const pct =
          q > 0
            ? Math.max(0, Math.min(100, Math.round(((net / q) * 100 + Number.EPSILON) * 100) / 100))
            : 0
        return { name: s, questionCount: q, correct: c, wrong: w, blank: b, net, percent: pct }
      })

      const exam = {
        id: Date.now().toString(),
        title: this.form.title,
        duration: Number(this.form.duration) || 0,
        subjects: subjectsArr,
        date: new Date().toISOString(),
      }

      this.exams.unshift(exam)
      localStorage.setItem('exams', JSON.stringify(this.exams))
      this.renderChart()
      this.showAdd = false
      // reset form
      this.form = { title: '', duration: 0 }
      // reset per-subject inputs
      Object.keys(this.formSubjects || {}).forEach((k) => {
        this.formSubjects[k] = { questionCount: 0, correct: 0, wrong: 0 }
      })
    },
    removeExam(idx) {
      if (!confirm('Bu sınavı silmek istiyor musunuz?')) return
      this.exams.splice(idx, 1)
      localStorage.setItem('exams', JSON.stringify(this.exams))
    },
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleString('tr-TR')
      } catch (e) {
        return iso
      }
    },
    renderChart() {
      try {
        const canvas = document.getElementById('examChart')
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        // filter by selectedChartSubject
        let list = [...this.exams]
        if (this.selectedChartSubject && this.selectedChartSubject !== '__all') {
          // filter exams that contain subject entries matching selected subject
          list = list.filter(
            (x) =>
              Array.isArray(x.subjects) &&
              x.subjects.some((ss) => ss.name === this.selectedChartSubject),
          )
        }
        const sorted = list.sort((a, b) => new Date(a.date) - new Date(b.date))
        const labels = sorted.map((e) => new Date(e.date).toLocaleDateString('tr-TR'))
        const data = sorted.map((e) => {
          // if exam has subjects array, find entry
          if (Array.isArray(e.subjects) && this.selectedChartSubject !== '__all') {
            const sub = e.subjects.find((x) => x.name === this.selectedChartSubject)
            return sub ? Number(sub.percent) || 0 : 0
          }
          // if showing all, try exam-level percent or average of subjects
          if (e.percent) return Number(e.percent) || 0
          if (Array.isArray(e.subjects) && e.subjects.length > 0) {
            const vals = e.subjects.map((x) => Number(x.percent) || 0)
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length
            return Math.round((avg + Number.EPSILON) * 100) / 100
          }
          return 0
        })

        if (this.chart) {
          this.chart.data.labels = labels
          this.chart.data.datasets[0].data = data
          this.chart.update()
          return
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Başarı %',
                data,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true, max: 100 },
            },
          },
        })
      } catch (err) {
        console.warn('Chart render failed', err)
      }
    },
    async loadWeeklyStats() {
      this.weeklyLoading = true
      try {
        // compute current week range (Mon..Sun) - using local timezone
        const now = new Date()
        const day = now.getDay() || 7 // Sunday=0 -> 7
        const monday = new Date(now)
        monday.setDate(now.getDate() - (day - 1))
        monday.setHours(0, 0, 0, 0)
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        sunday.setHours(23, 59, 59, 999)

        const params = { startDate: monday.toISOString(), endDate: sunday.toISOString() }
        const res = await sessionAPI.getStats(params)
        const distribution = res?.subjectDistribution || res?.data?.subjectDistribution || []
        const map = {}
        if (Array.isArray(distribution)) {
          distribution.forEach((r) => {
            const name = r._id || 'Unknown'
            map[name] = r.totalMinutes || 0
          })
        }
        // ensure all settings subjects are present
        this.weeklyStats = {}
        this.subjects.forEach((s) => {
          this.weeklyStats[s] = Math.round((map[s] || 0) * 100) / 100
        })
      } catch (err) {
        console.warn('Weekly stats load failed', err)
        this.weeklyStats = {}
      } finally {
        this.weeklyLoading = false
      }
    },
    downloadWeeklyCSV() {
      const rows = [['Subject', 'Minutes']]
      Object.keys(this.weeklyStats).forEach((k) => rows.push([k, String(this.weeklyStats[k] || 0)]))
      const csv = rows
        .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))
        .join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `weekly_stats_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
  created() {
    this.chart = null
  },
  mounted() {
    // ensure subjects & weekly stats loaded before rendering
    this.load()
    this.$nextTick(() => this.renderChart())
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
}
</script>

<style scoped>
/* Minimal styling aligned with existing UI */
</style>
