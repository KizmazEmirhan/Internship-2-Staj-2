<template>
  <div>
    <HeaderComponent v-if="!$route.meta.noLayout" />

    <div v-if="!$route.meta.noLayout" class="flex justify-center">
      <div class="container">
        <div class="flex justify-between flex-col sm:flex-row">
          <NavbarComponent />
          <router-view />
        </div>
      </div>
    </div>

    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/UI/HeaderComponent.vue'
import NavbarComponent from './components/Views/NavbarComponent.vue'

export default {
  components: {
    HeaderComponent,
    NavbarComponent,
  },
  methods: {
    getAuthToken() {
      if (!localStorage.getItem('token')) {
        this.$router.push('/auth')
      }
    },
  },
  mounted() {
    this.getAuthToken()
  },
}
</script>
