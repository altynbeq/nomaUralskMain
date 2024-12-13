// src/methods/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Основной экземпляр axios
export const axiosInstance = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Передавать куки
    timeout: 90000,
});

// Отдельный экземпляр axios без интерцепторов для запросов refresh-token
const axiosWithoutInterceptors = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
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
    const { refreshToken, setAccessToken, setRefreshToken } = useAuthStore.getState();
    return axiosWithoutInterceptors
        .post('/auth/refresh-token', { refreshToken })
        .then((response) => {
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            return response.data.accessToken;
        })
        .catch((error) => {
            // В случае ошибки очищаем токены
            setAccessToken(null);
            setRefreshToken(null);
            throw error;
        });
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
    (error) => Promise.reject(error),
);

// Интерцептор ответов для обработки ошибок 401 и обновления токена
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // Проверяем, существует ли оригинальный запрос
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Проверяем, является ли ошибка 401
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Если запрос был к /auth/refresh-token, не пытаемся обновить токен снова
            if (originalRequest.url.includes('/auth/refresh-token')) {
                // Очистка токенов в хранилище
                useAuthStore.getState().setAccessToken(null);
                useAuthStore.getState().setRefreshToken(null);
                return Promise.reject(error);
            }

            // Устанавливаем флаг _retry, чтобы избежать бесконечного цикла
            originalRequest._retry = true;

            if (isRefreshing) {
                // Если токен уже обновляется, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            // Если токен не обновляется, начинаем процесс обновления
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                refreshToken()
                    .then((newAccessToken) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                        processQueue(null, newAccessToken);
                        resolve(axiosInstance(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        // Если ошибка не 401 или уже был запрос на обновление, отклоняем ошибку
        return Promise.reject(error);
    },
);

export default axiosInstance;
