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

export default {
  components: { DataCards },
  data() {
    return {
      datas: [
        { title: 'Derslerim', count: 10 },
        { title: 'Görevlerim', count: 5 },
        { title: 'Sınavlarım', count: 3 },
      ],
    }
  },
}
</script>
