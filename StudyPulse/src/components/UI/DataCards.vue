<template>
  <div
    id="card"
    class="border-1 border-gray-200 rounded-lg flex w-full p-4"
    v-for="dataKey in datas"
    :key="dataKey.title"
  >
    <div class="font-bold">
      <h1 class="text-sm font-normal">{{ dataKey.title }}</h1>
      <div>{{ dataKey.count }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      required: true,
    },
  },
}
</script>
