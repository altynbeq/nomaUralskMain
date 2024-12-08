// src/methods/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Основной экземпляр axios
export const axiosInstance = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000, // 10 секунд
});

// Отдельный экземпляр axios без интерсепторов для refresh-token запросов
const axiosWithoutInterceptors = axios.create({
    baseURL: 'https://nomalytica-back.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
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
    const response = await axiosWithoutInterceptors.post('/auth/refresh-token');
    return response.data.accessToken;
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
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes('/auth/refresh-token')) {
                useAuthStore.getState().setAccessToken(null);
                useAuthStore.getState().reset();
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
                console.error('Ошибка при обновлении токена:', err);
                processQueue(err, null);
                useAuthStore.getState().setAccessToken(null);
                useAuthStore.getState().reset();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

// Проактивное обновление токена
// const scheduleTokenRefresh = () => {
//     const { accessToken } = useAuthStore.getState();
//     if (accessToken) {
//         const decoded = jwt.decode(accessToken);
//         if (decoded && decoded.exp) {
//             const expiresAt = decoded.exp * 1000;
//             const now = Date.now();
//             const timeout = expiresAt - now - 60 * 1000; // Обновить за 1 минуту до истечения

//             if (timeout > 0) {
//                 setTimeout(async () => {
//                     try {
//                         const newToken = await refreshToken();
//                         useAuthStore.getState().setAccessToken(newToken);
//                         scheduleTokenRefresh(); // Перепланировать обновление
//                     } catch (err) {
//                         console.error('Не удалось обновить токен:', err);
//                         useAuthStore.getState().setAccessToken(null);
//                         useAuthStore.getState().reset();
//                         // Здесь можно показать уведомление пользователю
//                     }
//                 }, timeout);
//             }
//         }
//     }
// };

// // Вызов функции после успешного входа или обновления токена
// useAuthStore.subscribe((state) => {
//     scheduleTokenRefresh();
// });

export default axiosInstance;
