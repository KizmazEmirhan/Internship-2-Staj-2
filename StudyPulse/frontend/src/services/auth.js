import { authAPI } from './api';

export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    return response;
  } catch (error) {
    console.error('Login hatası:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    return response;
  } catch (error) {
    console.error('Register hatası:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout hatası:', error);
  } finally {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const getProfile = async () => {
  try {
    const response = await authAPI.getProfile();
    return response.data;
  } catch (error) {
    console.error('Profil bilgileri alınamadı:', error);
    throw error;
  }
};

// Token kontrolü için yardımcı fonksiyon
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Token'ı alma
export const getToken = () => {
  return localStorage.getItem('token');
};
