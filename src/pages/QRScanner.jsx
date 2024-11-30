// src/components/QRScanner.jsx
import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export const QRScanner = () => {
    const [message, setMessage] = useState('');

    const handleScan = async (data) => {
        console.log(data);
        if (data) {
            try {
                // Предполагаем, что QR-код содержит JSON с координатами
                const qrData = JSON.parse(data);
                const { latitude: qrLat, longitude: qrLng } = qrData.location;

                // Получаем текущую геолокацию пользователя
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;

                            // Проверяем, совпадают ли локации (например, в пределах 50 метров)
                            const distance = getDistanceFromLatLonInMeters(
                                qrLat,
                                qrLng,
                                latitude,
                                longitude,
                            );
                            if (distance <= 50) {
                                // Порог можно настроить
                                // Отправляем данные на бэкенд с помощью fetch
                                const response = await fetch('http://localhost:5000/api/scan', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        qrData,
                                        scanTime: new Date(),
                                        userLocation: { latitude, longitude },
                                    }),
                                });

                                const result = await response.json();

                                if (result.success) {
                                    setMessage('Сканирование успешно!');
                                } else {
                                    setMessage('Ошибка при сохранении данных на сервере.');
                                }
                            } else {
                                setMessage(
                                    'Вы находитесь не в правильной локации для сканирования этого QR-кода.',
                                );
                            }
                        },
                        () => {
                            setMessage('Не удалось получить вашу геолокацию.');
                        },
                    );
                } else {
                    setMessage('Ваш браузер не поддерживает геолокацию.');
                }
            } catch (error) {
                console.error(error);
                setMessage('Ошибка обработки QR-кода.');
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
        setMessage('Ошибка при сканировании QR-кода.');
    };

    // Функция для вычисления расстояния между двумя точками на Земле
    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Радиус Земли в метрах
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    return (
        <div className="flex flex-col max-w-[600px] items-center justify-center mx-auto mt-14 gap-4">
            <h2>Сканируйте QR-код</h2>
            <Scanner
                onScan={(result) => console.log(result)}
                onError={(error) => console.log(error)}
            />
            {message && <p>{message}</p>}
        </div>
    );
};
