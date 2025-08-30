import api from './api'
import { setSession } from '@/stores/sessionStore'
export async function getSessions() {
  try {
  const res = await api.get('/sessions')
  setSession(res.data)
  return res.data
  } catch (err) {
  console.error('getSessions error', err.response?.data || err.message || err)
  throw err
  }
}
