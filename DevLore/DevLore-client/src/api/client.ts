import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5218';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации (если будет)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок (опционально)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // перенаправление на страницу логина
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);