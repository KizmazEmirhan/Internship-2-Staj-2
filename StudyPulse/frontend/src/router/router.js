import { createRouter, createWebHistory } from 'vue-router'

import SessionsView from '@/components/Views/SessionsView.vue'
import DashboardView from '@/components/Views/DashboardView.vue'
import SettingsView from '@/components/Views/SettingsView.vue'
import MyAccountView from '@/components/Views/MyAccountView.vue'
import RegisterationPage from '@/components/Views/RegisterationPage.vue'

const routes = [
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'MyAccount',
    component: MyAccountView,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterationPage,
    meta: { requiresAuth: false },
    props: { mode: 'register' },
  },
  {
    path: '/login',
    name: 'Login',
    component: RegisterationPage,
    meta: { requiresAuth: false },
    props: { mode: 'login' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
