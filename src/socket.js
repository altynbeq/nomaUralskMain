import { io } from 'socket.io-client';

// Адрес вашего сервера (должен совпадать с тем, что вы указали в CORS)
export const socket = io('https://nomalytica-back.onrender.com', {
    withCredentials: true,
    transports: ['websocket', 'polling'], // Обычно достаточно указать это, чтобы избежать проблем
});
