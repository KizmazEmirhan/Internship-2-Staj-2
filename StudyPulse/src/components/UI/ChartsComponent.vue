<template>
  <div class="flex flex-row flex-wrap gap-4 w-full max-w-full bg-white p-4">
    <div
      class="flex-1 min-w-[250px] max-w-full flex justify-center border rounded-lg border-gray-200 p-1"
    >
      <canvas
        ref="myChart"
        width="350"
        height="350"
        class="bg-white p-4 w-full h-auto max-w-full"
      ></canvas>
    </div>

    <div
      class="flex-1 min-w-[250px] max-w-full flex justify-center border rounded-lg border-gray-200 p-1"
    >
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
Chart.register(...registerables)

export default {
  methods: {
    displayBarChart() {
      const ctx = this.$refs.myChart.getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
          datasets: [
            {
              label: '# Çalışma Süresi (Saat)',
              data: [5, 5, 3, 5, 2, 3, 1],
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
    },
    displayDoughnutChart() {
      const ctx = this.$refs.doughnutChart.getContext('2d')
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
          datasets: [
            {
              label: '# Çalışma Süresi (Saat)',
              data: [5, 5, 3, 5, 2, 3, 1],
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
    },
  },
  mounted() {
    this.displayBarChart()
    this.displayDoughnutChart()
  },
}
</script>
