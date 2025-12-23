<template>
  <div class="flex flex-row flex-wrap gap-4 w-full max-w-full bg-white p-4">
    <div
      class="flex-1 flex-col min-w-[250px] max-w-full flex justify-center border rounded-lg border-gray-200 p-1"
    >
      <h1 class="text-nowrap font-bold text-md ml-4 mt-4 text-gray-400">Günlük Soru Çözümleri</h1>
      <canvas
        ref="myChart"
        width="350"
        height="350"
        class="bg-white p-4 w-full h-auto max-w-full"
      ></canvas>
    </div>

    <div
      class="flex-1 flex-col min-w-[250px] max-w-full flex justify-center border rounded-lg border-gray-200 p-1"
    >
      <h1 class="text-nowrap font-bold text-md ml-4 mt-4 text-gray-400">Günlük Çalışma Saatleri</h1>
      <canvas
        ref="doughnutChart"
        width="550"
        height="250"
        class="bg-white p-4 w-full h-auto max-w-full"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { sessionAPI, settingsAPI } from '@/services/api'

Chart.register(...registerables)

export default {
  data() {
    return {
      barChart: null,
      doughnutChart: null,
    }
  },
  methods: {
    startOfDay(d) {
      const dt = new Date(d)
      dt.setHours(0, 0, 0, 0)
      return dt
    },
    endOfDay(d) {
      const dt = new Date(d)
      dt.setHours(23, 59, 59, 999)
      return dt
    },

    async loadWeeklyTotals(days = 7) {
      try {
        // build array of last N days (labels) from oldest -> newest
        const labels = []
        const dates = []
        for (let i = days - 1; i >= 0; i--) {
          const dd = new Date()
          dd.setDate(dd.getDate() - i)
          labels.push(dd.toLocaleDateString('tr-TR'))
          dates.push(new Date(dd))
        }

        // fetch sessions for the full range and aggregate per day
        const start = this.startOfDay(dates[0]).toISOString()
        const end = this.endOfDay(dates[dates.length - 1]).toISOString()
        const res = await sessionAPI.getAll({ startDate: start, endDate: end })
        const sessions = Array.isArray(res) ? res : res?.data || []

        const map = {}
        // init map
        labels.forEach((lbl) => (map[lbl] = 0))

        sessions.forEach((s) => {
          try {
            if (!s.duration) return
            const key = new Date(s.startTime).toLocaleDateString('tr-TR')
            if (!map[key]) map[key] = 0
            map[key] += Number(s.duration) || 0
          } catch (e) {
            // skip malformed
          }
        })

        // convert minutes -> hours (rounded 2 decimals)
        const data = labels.map((l) => Math.round(((map[l] || 0) / 60 + Number.EPSILON) * 100) / 100)

        // render or update bar chart
        const ctx = this.$refs.myChart.getContext('2d')
        if (this.barChart) {
          this.barChart.data.labels = labels
          this.barChart.data.datasets[0].data = data
          this.barChart.update()
          return
        }

        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: '# Günlük Çalışma Süresi (Saat)',
                data,
                borderWidth: 1,
                backgroundColor: '#8d1ccf70',
                hoverBackgroundColor: '#8e1ccf',
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      } catch (err) {
        console.warn('Failed to load weekly totals', err)
      }
    },

    async loadTodaySubjectDistribution() {
      try {
        const now = new Date()
        const start = this.startOfDay(now).toISOString()
        const end = this.endOfDay(now).toISOString()
        const res = await sessionAPI.getStats({ startDate: start, endDate: end })
        const distribution = res?.subjectDistribution || res?.data?.subjectDistribution || []

        const labels = []
        const data = []
        distribution.forEach((r) => {
          const name = r._id || 'Unknown'
          const minutes = r.totalMinutes || 0
          labels.push(name)
          // convert to hours with 2 decimals for display
          data.push(Math.round(((minutes || 0) / 60 + Number.EPSILON) * 100) / 100)
        })

        const ctx = this.$refs.doughnutChart.getContext('2d')
        if (this.doughnutChart) {
          this.doughnutChart.data.labels = labels
          this.doughnutChart.data.datasets[0].data = data
          this.doughnutChart.update()
          return
        }

        this.doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                label: 'Derslere Göre Çalışma (Saat)',
                data,
                backgroundColor: [
                  '#8d1ccf70',
                  '#f97316',
                  '#06b6d4',
                  '#f43f5e',
                  '#22c55e',
                  '#eab308',
                  '#7c3aed',
                ],
              },
            ],
          },
          options: { responsive: true },
        })
      } catch (err) {
        console.warn('Failed to load subject distribution', err)
      }
    },
  },
  async mounted() {
    await this.loadWeeklyTotals(7)
    await this.loadTodaySubjectDistribution()
  },
  beforeUnmount() {
    if (this.barChart) {
      this.barChart.destroy()
      this.barChart = null
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy()
      this.doughnutChart = null
    }
  },
}
</script>
