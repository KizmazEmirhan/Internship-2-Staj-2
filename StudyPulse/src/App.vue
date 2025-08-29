<template>
  <HeaderComponent></HeaderComponent>
  <div class="flex justify-center">
    <div class="container">
      <div class="flex justify-between flex-col sm:flex-row">
        <NavbarComponent></NavbarComponent>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/Views/HeaderComponent.vue'
import HomePage from './views/HomePage.vue'
import NavbarComponent from './components/Views/NavbarComponent.vue'
export default {
  components: {
    HeaderComponent,
    HomePage,
    NavbarComponent,
  },
}
</script>
