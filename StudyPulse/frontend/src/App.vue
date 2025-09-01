<template>
  <div>
    <HeaderComponent v-if="!$route.meta.noLayout && isAuthenticated" :userData="userData" />

    <div v-if="!$route.meta.noLayout && isAuthenticated" class="flex justify-center">
      <div class="container">
        <div class="flex justify-between flex-col sm:flex-row">
          <NavbarComponent @logout="handleLogout" />
          <router-view />
        </div>
      </div>
    </div>

    <div v-else>
      <router-view @login-success="handleLoginSuccess" />
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
  data() {
    return {
      isAuthenticated: false,
      token: localStorage.getItem('token'),
      userData: null,
    }
  },
  watch: {
    token(newToken) {
      this.isAuthenticated = !!newToken
      this.checkAuthentication()
    },
    $route(to) {
      this.checkAuthentication(to)
    },
  },
  methods: {
    checkAuthentication(route = this.$route) {
      const requiresAuth = route.meta.requiresAuth !== false
      const hasToken = !!this.token

      if (requiresAuth && !hasToken) {
        this.$router.push('/login')
        return false
      }

      if (!requiresAuth && hasToken && (route.path === '/login' || route.path === '/register')) {
        this.$router.push('/')
        return false
      }

      this.isAuthenticated = hasToken
      return true
    },
    handleStorageChange() {
      this.isAuthenticated = !!localStorage.getItem('token')
    },
    updateToken() {
      this.token = localStorage.getItem('token')
    },
    async handleLoginSuccess({ token, user }) {
      localStorage.setItem('token', token)
      await this.fetchUserData()
      this.$router.push('/')
    },
    async fetchUserData() {
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.userData = await response.json()
    },
    handleLogout() {
      localStorage.removeItem('token')
      this.token = null
      this.userData = null
      this.isAuthenticated = false
      this.$router.push('/login')
    },
  },
  mounted() {
    this.checkAuthentication()
    this.fetchUserData()
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      this.userData = JSON.parse(savedUser)
    }
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
}
</script>
