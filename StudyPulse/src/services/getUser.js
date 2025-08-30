import api from './api'
import { setUser } from '@/stores/userStore'

export async function getUser() {
  const res = await api.get('/auth/me')
  setUser(res.data)
  return res.data
}
