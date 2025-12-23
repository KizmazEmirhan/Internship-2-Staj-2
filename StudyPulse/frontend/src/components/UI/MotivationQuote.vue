<template>
  <div class="p-4 rounded-lg bg-white card-hover">
    <div class="text-sm text-gray-500">Günün Motivasyonu</div>
    <div class="mt-2 font-semibold text-lg">"{{ quote.text }}"</div>
    <div class="mt-1 text-xs text-gray-400">— {{ quote.author }}</div>
  </div>
</template>

<script>
// small deterministic daily quote selector
const QUOTES = [
  { text: 'Küçük adımlar büyük farklar yaratır.', author: 'Anonim' },
  { text: 'Bugün yaptığın iyi bir şey, yarına güç verir.', author: 'Anonim' },
  { text: 'Süreklilik, yetenekten daha değerlidir.', author: 'Anonim' },
  { text: 'Hedefini küçük parçalara böl ve bugün en küçüğünü yap.', author: 'Anonim' },
  { text: 'En iyi zaman şimdi; ikinci en iyi zaman yarın.', author: 'Anonim' },
  { text: 'Hata, öğrenmenin bir işaretidir.', author: 'Anonim' },
  { text: 'Odaklan ; gerisi zamanla gelir.', author: 'Anonim' },
  { text: 'Düzenli çalışma, yeteneğin en iyi arkadaşıdır.', author: 'Anonim' },
  { text: 'Bugün yapabileceğin en küçük ilerleme bile kıymetlidir.', author: 'Anonim' },
  { text: 'Bir şeyi ertelemek kolay; başlamak cesaret ister.', author: 'Anonim' },
]

export default {
  name: 'MotivationQuote',
  data() {
    return { quote: QUOTES[0] }
  },
  created() {
    try {
      const now = new Date()
      const seed = Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`)
      const idx = seed % QUOTES.length
      this.quote = QUOTES[idx]
    } catch (e) {
      this.quote = QUOTES[0]
    }
  },
}
</script>

<style scoped>
.card-hover { background: #fff }
</style>
