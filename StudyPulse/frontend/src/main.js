import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"
import api from './services/api'

const app = createApp(App)

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
