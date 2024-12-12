import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { axiosInstance } from '../../api/axiosInstance';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { Loader } from '../../components/Loader';

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
    today: 'Сегодня',
    clear: 'Очистить',
});

export const EditShift = ({ shiftId, onShiftDelete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shift, setShift] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const fetchShiftDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`shifts/shift/${shiftId}`);
                const shiftData = response.data;

                const shiftStartTime = new Date(shiftData.startTime);
                let shiftEndTime = new Date(shiftData.endTime);

                if (shiftEndTime <= shiftStartTime) {
                    shiftEndTime.setDate(shiftEndTime.getDate() + 1);
                }

                setShift(shiftData);
                setStartTime(shiftStartTime);
                setEndTime(shiftEndTime);
            } catch (error) {
                console.error('Ошибка при получении смены:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (shiftId) {
            fetchShiftDetails();
        }
    }, [shiftId]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const newStart = new Date(startTime).toISOString();
            const newEnd = new Date(endTime);

            if (newEnd <= new Date(startTime)) {
                newEnd.setDate(newEnd.getDate() + 1);
            }

            const newEndISO = newEnd.toISOString();
            const response = await axiosInstance.put(`/shifts/update-shift/${shiftId}`, {
                subUserId: shift.subUserId._id,
                startTime: newStart,
                endTime: newEndISO,
                selectedStore: shift.selectedStore,
            });

            if (response.status === 200) {
                setShift(response.data);
                toast.success('Вы успешно обновили смену');
            }
        } catch (error) {
            console.error('Ошибка при обновлении смены:', error);
            toast.error('Не удалось обновить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/shifts/delete-shift/${shiftId}`);
            onShiftDelete(shiftId);
        } catch (error) {
            console.error('Ошибка при удалении смены:', error);
            toast.error('Не удалось удалить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-white mt-4 min-h-[150px]">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                    <Loader />
                </div>
            )}

            {!isLoading && (
                <>
                    <div className="mb-4">
                        <Calendar
                            value={startTime}
                            onChange={(e) => setStartTime(e.value)}
                            showTime
                            locale="ru"
                            hourFormat="24"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="Начало смены:"
                        />
                    </div>
                    <div className="mb-4">
                        <Calendar
                            value={endTime}
                            onChange={(e) => setEndTime(e.value)}
                            showTime
                            locale="ru"
                            hourFormat="24"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="Конец смены:"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button
                            disabled={isLoading}
                            onClick={handleSave}
                            className="flex-1 bg-blue-400 text-white rounded-md p-2"
                            label="Изменить смену"
                        />
                        <Button
                            disabled={isLoading}
                            onClick={handleDelete}
                            className="flex-1 bg-red-400 text-white rounded-md p-2"
                            label="Удалить смену"
                        />
                    </div>
                </>
            )}
        </div>
    );
};
