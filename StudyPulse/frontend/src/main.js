import './assets/main.css'
import './assets/dark-theme.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"
import api from './services/api'

const app = createApp(App)

// Apply saved theme preference if exists
const saved = localStorage.getItem('theme')
if (saved === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
}

app.use(router)

// Global auth kontrolü
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

app.mount('#app')
