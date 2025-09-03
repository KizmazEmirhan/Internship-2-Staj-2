<template>
  <div>
    <!-- Eğer authenticated ise layout -->
    <HeaderComponent v-if="isAuthenticated && !$route.meta.noLayout" :userData="userData" />

    <div v-if="isAuthenticated && !$route.meta.noLayout" class="flex justify-center">
      <div class="container">
        <div class="flex justify-between flex-col sm:flex-row">
          <NavbarComponent @logout="handleLogout" />
          <router-view :key="$route.fullPath" />
        </div>
      </div>
    </div>

    <!-- Auth yoksa login/register -->
    <div v-else>
      <router-view @login-success="handleLoginSuccess" :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/UI/HeaderComponent.vue'
import NavbarComponent from './components/UI/NavbarComponent.vue'

export default {
  components: {
    HeaderComponent,
    NavbarComponent,
  },
  data() {
    return {
      isAuthenticated: false,
      token: localStorage.getItem('token'),
      userData: {},
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
      this.token = token // Token'ı hemen güncelle

      // Kullanıcı verilerini bekle ve sonra yönlendir
      await this.fetchUserData()
      this.$router.push('/sessions')
    },
    async fetchUserData() {
      const token = localStorage.getItem('token')

      if (!token) {
        //console.log('Token yok, fetch iptal edildi')
        this.userData = {} // Token yoksa userData'yı temizle
        return
      }

      try {
        //console.log('Kullanıcı verileri çekiliyor...')
        const response = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          this.userData = await response.json()
          console.log('Kullanıcı verileri alındı:', this.userData)
        } else {
          console.error('Kullanıcı verileri alınamadı:', response.status)
          if (response.status === 401) {
            this.handleLogout()
          }
        }
      } catch (error) {
        console.log('Fetch hatası:', error)
      }
    },
    handleLogout() {
      localStorage.removeItem('token')
      this.token = null
      this.userData = null
      this.isAuthenticated = false
      this.$router.push('/login')
    },
  },
  watch: {
    token(newToken) {
      this.isAuthenticated = !!newToken
      this.checkAuthentication()
      if (newToken) {
        this.fetchUserData()
      } else {
        this.userData = {}
      }
    },
    $route(to) {
      this.checkAuthentication(to)
    },
  },
  mounted() {
    this.fetchUserData()
    this.checkAuthentication()
    if (this.token) {
      this.fetchUserData()
    }
    window.addEventListener('storage', this.handleStorageChange)
  },

  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
}
</script>
