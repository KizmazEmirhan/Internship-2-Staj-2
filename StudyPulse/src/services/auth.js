import api, { setAuthToken } from './api'
import { setUser, clearUser } from '@/stores/userStore'

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  const { token } = res.data
  setAuthToken(token)
  // optionally fetch current user
  try {
    const userRes = await api.get('/auth/me')
    setUser(userRes.data)
  } catch (err) {
    // ignore — user can be fetched later
    console.warn('Could not fetch user after login', err)
  }
  return res.data
}

export async function register(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password })
  const { token } = res.data

  setAuthToken(token)
  try {
    const userRes = await api.get('/auth/me')
    setUser(userRes.data)
  } catch (err) {
    console.warn('Could not fetch user after register', err)
  }
  return res.data
}

export function logout() {
  setAuthToken(null)
  clearUser()
}

export function getCurrentUserToken() {
  return localStorage.getItem('token')
}
