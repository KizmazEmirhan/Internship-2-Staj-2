<template>
  <HeaderComponent></HeaderComponent>
  <router-view></router-view>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import DashboardView from '@/components/DashboardView.vue'
export default {
  components: {
    HeaderComponent,
    DashboardView,
  },
}
</script>
