<template>
  <div class="flex flex-col w-full">
    <TotalStudy></TotalStudy>
    <TotalDatas></TotalDatas>
    <ChartsComponent></ChartsComponent>
  </div>
</template>

<script>
import TotalStudy from '../UI/TotalStudy.vue'
import ChartsComponent from '../UI/ChartsComponent.vue'
import TotalDatas from '../UI/TotalDatas.vue'
export default {
  components: {
    TotalStudy,
    ChartsComponent,
    TotalDatas,
  },
}
</script>
