import { userAPI } from './api'

export const getUser = async () => {
  try {
    const response = await userAPI.getProfile()

    return response.data.user
  } catch (error) {
    console.error('Kullanıcı bilgileri alınamadı:', error)
    throw error
  }
}

export const updateUser = async (userData) => {
  try {
    const response = await userAPI.updateProfile(userData)
    return response.data
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error)
    throw error
  }
}
