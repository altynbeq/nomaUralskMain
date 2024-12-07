// src/methods/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Создание экземпляра axios
export const axiosInstance = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api', // Ваш базовый URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно для отправки HttpOnly cookies
});

// Переменные для управления состоянием обновления токена
let isRefreshing = false;
let failedQueue = [];

// Функция для обработки очереди запросов
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Функция для обновления токена
const refreshToken = () => {
    return axiosInstance.post('/auth/refresh-token').then((response) => response.data.accessToken);
};

// Интерцептор запросов для добавления токена в заголовок
axiosInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Интерцептор ответов для обработки ошибок 401 и обновления токена
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, является ли ошибка 401 и не был ли запрос уже повторен
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если обновление уже происходит, добавляем запрос в очередь
                try {
                    const token = await new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                localStorage.setItem('accessToken', newToken);
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
