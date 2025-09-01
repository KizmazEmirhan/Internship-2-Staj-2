<template>
  <HeaderComponent></HeaderComponent>
  <router-view></router-view>
</template>

<script>
import HeaderComponent from '@/components/UI/HeaderComponent.vue'
import DashboardView from '@/components/Views/DashboardView.vue'
export default {
  components: {
    HeaderComponent,
    DashboardView,
  },
}
</script>
