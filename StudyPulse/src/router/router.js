import { createRouter, createWebHistory } from 'vue-router'

import SessionsView from '@/components/SessionsView.vue'
import DashboardView from '@/components/DashboardView.vue'

const routes = [
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionsView,
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
