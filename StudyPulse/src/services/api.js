import axios from 'axios'

// prefer an environment override in development; otherwise use deployed backend
const DEFAULT_BASE = 'https://internship-2-staj-2-xl3g.vercel.app/api'
const baseURL = import.meta.env.VITE_API_BASE || DEFAULT_BASE

const api = axios.create({
  baseURL,
  timeout: 10000,
})

// initialize auth header from localStorage if present
const token = localStorage.getItem('token')
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }
}

// response interceptor: centralized error handling + auto-logout on 401
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error.response?.status
    console.error('API error', status, error.response?.data || error.message)
    if (status === 401) {
      // token invalid or expired - clear local token and navigate to auth
      setAuthToken(null)
      try {
        window.location.href = '/auth'
      } catch (e) {
        console.warn('Could not redirect to /auth', e)
      }
    }
    return Promise.reject(error)
  },
)

export default api
