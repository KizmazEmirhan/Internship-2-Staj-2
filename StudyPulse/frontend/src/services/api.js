import axios from 'axios'

const API_URL = import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:4000/api'
console.log(API_URL)
// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor - her istekte token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş

      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  logout: async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Services shouldn't depend on Vue instance. Let the caller handle redirects.
    return { success: true }
  },
}

export const sessionAPI = {
  create: async (sessionData) => {
    const response = await api.post('/sessions', sessionData)

    return response.data
  },

  getAll: async (params) => {
    const response = await api.get('/sessions', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/sessions/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/sessions/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/sessions/${id}`)
    return response.data
  },

  getStats: async (params) => {
    const response = await api.get('/sessions/stats/summary', { params })
    return response.data
  },
}

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put(`/users/${data.id}`, data)
    return response.data
  },

  changePassword: async (userId, passwordData) => {
    const response = await api.put(`/users/${userId}/password`, passwordData)
    return response.data
  },
}

export const settingsAPI = {
  getSettings: async () => {
    const response = await api.get('/settings')
    return response.data
  },

  updateSettings: async (data) => {
    const response = await api.put('/settings', data)
    return response.data
  },
}

export default api
