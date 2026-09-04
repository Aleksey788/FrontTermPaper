import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
        'Content-Type': 'application/json',
    },
    timeout: 1500,
})

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response) {
      // Сервер ответил с кодом ошибки (4xx, 5xx)
      console.error('Ошибка сервера:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Например, если токен протух, можно разлогинить пользователя
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (проблемы с сетью)
      console.error('Ошибка сети:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
    apiClient,
};