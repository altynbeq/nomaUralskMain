import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { axiosInstance } from '../../api/axiosInstance';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';

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

export const EditShift = ({ shiftId, onShiftDelete, onShiftUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shift, setShift] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const fetchShiftDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`shifts/shift/${shiftId}`);
                setShift(response.data);
                setStartTime(new Date(response.data.startTime));
                setEndTime(new Date(response.data.endTime));
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
            const newEnd = new Date(endTime).toISOString();

            // Проверка на пересечение
            const checkResponse = await axiosInstance.get(`/shifts/check-conflict/${shiftId}`, {
                params: {
                    startTime: newStart,
                    endTime: newEnd,
                },
            });
            if (checkResponse.data.conflict) {
                // Есть пересечение
                toast.error('Смена пересекается по времени с другой сменой.');
                setIsLoading(false);
                return;
            }

            // Нет пересечений — обновляем смену
            const response = await axiosInstance.put(`/shifts/update-shift/${shiftId}`, {
                subUserId: shift.subUserId._id,
                startTime: newStart,
                endTime: newEnd,
                selectedStore: shift.selectedStore,
            });
            if (response.status === 200) {
                onShiftUpdate(response.data);
                setShift(response.data);
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
            onShiftDelete(shiftId); // Вызов функции из родительского компонента для удаления смены из списка
        } catch (error) {
            console.error('Ошибка при удалении смены:', error);
            toast.error('Не удалось удалить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!shift) {
        return null;
    }

    return (
        <>
            <div className="bg-white mt-4">
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
            </div>
        </>
    );
};
