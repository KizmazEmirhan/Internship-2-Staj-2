<template>
  <div class="p-4 bg-white w-full">
    <h2 class="font-bold text-xl mb-4">Sınavlar</h2>

    <div class="mb-4 flex items-center justify-between">
      <div>
        <button @click="showAdd = true" class="bg-[#8D1CCE] text-white px-3 py-1 rounded">Sınav Ekle</button>
      </div>
      <div class="w-1/2">
        <canvas id="examChart"></canvas>
      </div>
    </div>

    <!-- Add Exam Modal -->
    <teleport to="body">
      <div v-if="showAdd" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div class="bg-white rounded p-4 w-96 shadow-lg">
          <h3 class="font-bold mb-2">Yeni Sınav Ekle</h3>
          <form @submit.prevent="saveExam">
            <div class="flex flex-col gap-2">
              <label class="text-sm">Sınav Adı (yayını)</label>
              <input v-model="form.title" class="border p-1 rounded" placeholder="Örn: Matematik Vize" />

              <label class="text-sm">Soru Sayısı</label>
              <input type="number" v-model.number="form.questionCount" class="border p-1 rounded" min="1" />

              <label class="text-sm">Süresi (dakika)</label>
              <input type="number" v-model.number="form.duration" class="border p-1 rounded" min="1" />

              <label class="text-sm">Doğru Sayısı</label>
              <input type="number" v-model.number="form.correct" class="border p-1 rounded" min="0" />

              <label class="text-sm">Yanlış Sayısı</label>
              <input type="number" v-model.number="form.wrong" class="border p-1 rounded" min="0" />

              <div class="text-sm text-gray-600">
                <div>Net (hesaplanan): <b>{{ computedNet }}</b></div>
                <div>Başarı Yüzdesi (hesaplanan): <b>{{ computedPercent }}%</b></div>
              </div>

              <div class="flex justify-end gap-2 mt-3">
                <button type="button" @click="showAdd = false" class="px-2 py-1 rounded bg-gray-200">İptal</button>
                <button type="submit" class="px-3 py-1 rounded bg-green-600 text-white">Kaydet</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Exams list -->
    <div v-if="exams.length === 0" class="text-gray-500">Henüz eklenmiş sınav yok.</div>
    <ul class="mt-2 space-y-2">
      <li v-for="(e, idx) in exams" :key="e.id" class="p-3 border rounded flex justify-between items-center">
        <div>
          <div class="font-medium">{{ e.title || 'İsim yok' }}</div>
          <div class="text-sm text-gray-500">Soru: {{ e.questionCount }} • Süre: {{ e.duration }} dk</div>
          <div class="text-sm">Doğru: {{ e.correct }} • Yanlış: {{ e.wrong }} • Net: {{ e.net }} • Başarı: {{ e.percent }}%</div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="text-sm text-gray-500">{{ formatDate(e.date) }}</div>
          <div class="flex gap-2">
            <button @click="removeExam(idx)" class="text-red-500">Sil</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  data() {
    return {
      showAdd: false,
      exams: [],
      form: {
        title: '',
        questionCount: 0,
        duration: 0,
        correct: 0,
        wrong: 0,
      },
      chart: null,
    }
  },
  watch: {
    exams: {
      handler() {
        this.renderChart()
      },
      deep: true,
    }
  },
  computed: {
    computedNet() {
      // net = correct - (wrong / 4) (standart yanlış 4:1)
      const net = (Number(this.form.correct) || 0) - ((Number(this.form.wrong) || 0) / 4)
      return Math.max(0, Math.round((net + Number.EPSILON) * 100) / 100)
    },
    computedPercent() {
      const q = Number(this.form.questionCount) || 0
      if (q <= 0) return 0
      const net = this.computedNet
      const pct = (net / q) * 100
      return Math.max(0, Math.min(100, Math.round((pct + Number.EPSILON) * 100) / 100))
    }
  },
  methods: {
    load() {
      try {
        const raw = localStorage.getItem('exams')
        this.exams = raw ? JSON.parse(raw) : []
      } catch (e) {
        this.exams = []
      }
    },
    saveExam() {
      // validation
      const q = Number(this.form.questionCount) || 0
      const c = Number(this.form.correct) || 0
      const w = Number(this.form.wrong) || 0
      if (!this.form.title) {
        alert('Sınav adı girin')
        return
      }
      if (q <= 0) {
        alert('Soru sayısını girin')
        return
      }
      if (c + w > q) {
        alert('Doğru + Yanlış sayısı soru sayısını aşamaz')
        return
      }

      const exam = {
        id: Date.now().toString(),
        title: this.form.title,
        questionCount: q,
        duration: Number(this.form.duration) || 0,
        correct: c,
        wrong: w,
        net: this.computedNet,
        percent: this.computedPercent,
        date: new Date().toISOString(),
      }

      this.exams.unshift(exam)
      localStorage.setItem('exams', JSON.stringify(this.exams))
      this.renderChart()
      this.showAdd = false
      // reset form
      this.form = { title: '', questionCount: 0, duration: 0, correct: 0, wrong: 0 }
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
        const sorted = [...this.exams].sort((a, b) => new Date(a.date) - new Date(b.date))
        const labels = sorted.map((e) => new Date(e.date).toLocaleDateString('tr-TR'))
        const data = sorted.map((e) => Number(e.percent) || 0)

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
              y: { beginAtZero: true, max: 100 }
            }
          }
        })
      } catch (err) {
        console.warn('Chart render failed', err)
      }
    }
  },
  created() {
    this.chart = null
  },
  mounted() {
    this.load()
    this.$nextTick(() => this.renderChart())
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  }
}
</script>

<style scoped>
/* Minimal styling aligned with existing UI */
</style>
