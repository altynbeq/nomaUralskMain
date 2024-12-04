import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { formatDate } from '../../methods/dataFormatter';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

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

export const ScheduleWithEdit = ({ open, setOpen, shiftId, fetchShifts, selectedStore }) => {
    const [shift, setShift] = useState(null);
    const [editing, setEditing] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && shiftId) {
            fetchShiftDetails();
        }
    }, [open, shiftId]);

    const fetchShiftDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/shift/${shiftId}`,
            );
            if (!response.ok) {
                throw new Error('Failed to fetch shift details');
            }
            const data = await response.json();
            setShift(data);
            setStartTime(new Date(data.startTime));
            setEndTime(new Date(data.endTime));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/update-shift/${shiftId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subUserId: shift.subUserId._id,
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                        selectedStore: selectedStore._id,
                    }),
                },
            );
            if (!response.ok) {
                throw new Error('Failed to update shift');
            }
            await fetchShifts();
            setEditing(false);
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/delete-shift/${shiftId}`,
                {
                    method: 'DELETE',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to delete shift');
            }
            await fetchShifts();
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!shift) {
        return null;
    }

    return (
        <>
            {open && (
                <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[300]">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-bold flex mr-5 pr-10 mb-4">Детали смены</h2>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setEditing(false);
                                }}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes className="mb-4" />
                            </button>
                        </div>
                        {editing ? (
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
                                <button
                                    disabled={isLoading}
                                    onClick={handleSave}
                                    className={`flex bg-green-500 text-white py-2 px-4 rounded ml-auto ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p>
                                        <strong>Сотрудник:</strong> {shift.subUserId.name}
                                    </p>
                                    <p>
                                        <strong>Начало смены:</strong> {formatDate(shift.startTime)}
                                    </p>
                                    <p>
                                        <strong>Конец смены:</strong> {formatDate(shift.endTime)}
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleEdit}
                                        className="flex bg-blue-500 text-white py-2 px-4 rounded"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        disabled={isLoading}
                                        onClick={handleDelete}
                                        className={`flex  bg-red-500 text-white py-2 px-4 rounded ${
                                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
