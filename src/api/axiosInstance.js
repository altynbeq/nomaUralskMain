// src/methods/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Основной экземпляр axios
export const axiosInstance = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api', // Ваш базовый URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно для отправки HttpOnly cookies
});

// Отдельный экземпляр axios без интерсепторов для refresh-token запросов
const axiosWithoutInterceptors = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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
const refreshToken = async () => {
    return axiosWithoutInterceptors
        .post('/auth/refresh-token')
        .then((response) => response.data.accessToken);
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

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Проверяем, был ли запрос уже повторен
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Исключаем запросы на обновление токена из обработки интерсептором
            if (originalRequest.url.includes('/auth/refresh-token')) {
                // Если refresh-token запрос получил 401, перенаправляем на страницу входа
                useAuthStore.getState().setAccessToken(null);
                window.location.href = '/login';
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
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

            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                useAuthStore.getState().setAccessToken(newToken);
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (err) {
                console.log(err);
                processQueue(err, null);
                useAuthStore.getState().setAccessToken(null);
                useAuthStore.getState().reset();
                // window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
