import React, { useState, useEffect, useCallback } from 'react';
import { CalendarModal } from '../CalendarModal';
import { getCurrentMonthYear } from '../../methods/getCurrentMonthYear';
import { useSubUserStore, useAuthStore } from '../../store/index';
import avatar from '../../data/avatar.jpg';
import { DateTime } from 'luxon';
import { socket } from '../../socket';
import { getDayColorType, getDayColorClasses } from '../../methods/shiftColorLogic';

export const SubUserCalendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedShifts, setSelectedShifts] = useState([]);
    const subUsersShifts = useSubUserStore((state) => state.shifts);
    const subUserImage = useSubUserStore((state) => state.subUser?.image);
    const subUserId = useAuthStore((state) => state.user?.id); // Получаем ID под-пользователя

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };

    const getCurrentWeekDates = () => {
        const currentDate = DateTime.now();
        const start = currentDate.startOf('week').setLocale('ru');
        return Array.from({ length: 7 }, (_, i) => start.plus({ days: i }));
    };

    const formatDate = (date) => date.toFormat('yyyy-MM-dd');

    const getDayClasses = (date) => {
        // 1) Определяем все смены на этот день
        const formattedDate = formatDate(date);
        const shiftsThisDay =
            subUsersShifts?.filter((shift) => {
                const shiftDate = DateTime.fromISO(shift.startTime).toFormat('yyyy-MM-dd');
                return shiftDate === formattedDate;
            }) || [];

        // 2) Получаем тип окраски
        const colorType = getDayColorType(shiftsThisDay);
        // 3) Получаем стили/класс/tooltip
        const { style, className, tooltip } = getDayColorClasses(colorType);

        return { style, className, tooltip };
    };

    const openModal = (date) => {
        setSelectedDay(date);
        const formattedDate = formatDate(date);

        const shifts = subUsersShifts?.filter((shift) => {
            const shiftDate = DateTime.fromISO(shift.startTime).toFormat('yyyy-MM-dd');
            return shiftDate === formattedDate;
        });

        setSelectedShifts(shifts || []);
        setIsModalOpen(true);
    };

    const getDaysInMonth = (year, month) => {
        return DateTime.local(year, month + 1).daysInMonth;
    };

    const currentDate = DateTime.now();
    const currentYear = currentDate.year;
    const currentMonth = currentDate.month - 1;
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);

    // Обработчик для обновления существующей смены
    const handleSocketShiftUpdate = useCallback(
        (updatedShift) => {
            // Проверяем, принадлежит ли смена текущему под-пользователю
            if (updatedShift.subUserId.id !== subUserId) return;

            setSelectedShifts((prevShifts) => {
                const updatedShifts = prevShifts.map((shift) =>
                    shift._id === updatedShift._id ? { ...shift, ...updatedShift } : shift,
                );
                return updatedShifts;
            });

            useSubUserStore.setState((state) => {
                const updatedShifts = state.shifts.map((shift) =>
                    shift._id === updatedShift._id ? { ...shift, ...updatedShift } : shift,
                );
                return { shifts: updatedShifts };
            });
        },
        [subUserId],
    );

    // Обработчик для добавления новых смен
    const handleSocketNewShifts = useCallback(
        (newShifts) => {
            // Фильтруем только те смены, которые относятся к текущему под-пользователю
            const filteredNewShifts = Array.isArray(newShifts)
                ? newShifts.filter((shift) => shift.subUserId.id === subUserId)
                : [];

            if (filteredNewShifts.length === 0) return;

            setSelectedShifts((prevShifts) => {
                const selectedDate = selectedDay
                    ? DateTime.fromJSDate(selectedDay).toFormat('yyyy-MM-dd')
                    : null;

                const newShiftsForSelectedDay = filteredNewShifts.filter((newShift) => {
                    const shiftDate = DateTime.fromISO(newShift.startTime).toFormat('yyyy-MM-dd');
                    return shiftDate === selectedDate;
                });

                const updatedShifts = [...prevShifts, ...newShiftsForSelectedDay];

                const uniqueShifts = Array.from(
                    new Map(updatedShifts.map((shift) => [shift._id, shift])).values(),
                );

                return uniqueShifts;
            });

            useSubUserStore.setState((state) => {
                const updatedShifts = [...state.shifts, ...filteredNewShifts];

                const uniqueShifts = Array.from(
                    new Map(updatedShifts.map((shift) => [shift._id, shift])).values(),
                );

                return { shifts: uniqueShifts };
            });
        },
        [selectedDay, subUserId],
    );

    useEffect(() => {
        // Обработчик обновления смены
        socket.on('update-shift', (data) => {
            handleSocketShiftUpdate(data.shift);
        });

        return () => {
            socket.off('update-shift');
        };
    }, [handleSocketShiftUpdate]);

    useEffect(() => {
        // Обработчик новых смен
        socket.on('new-shift', (newShifts) => {
            handleSocketNewShifts(newShifts);
        });

        return () => {
            socket.off('new-shift');
        };
    }, [handleSocketNewShifts]);

    return (
        <div className="w-[90%] md:w-[50%] ml-5 bg-white subtle-border rounded-lg shadow-md p-4">
            <div className="flex flex-row justify-between">
                <div className="flex items-center">
                    <img
                        className="h-12 w-12 object-fill rounded-full inline-flex mr-4"
                        src={
                            subUserImage
                                ? `https://nomalytica-back.onrender.com${subUserImage}`
                                : avatar
                        }
                        alt="user-profile"
                    />
                    <div>
                        <h2 className="font-semibold text-lg text-black">
                            Смены на {getCurrentMonthYear()}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative gap-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center p-1">
                        <button
                            onClick={toggleView}
                            className={`p-1 rounded-full transition-colors duration-300 relative z-2 text-sm ${
                                !isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={toggleView}
                            className={`p-1 rounded-full transition-colors duration-300 relative z-2 text-sm ${
                                isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            Месяц
                        </button>
                    </div>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            {isMonthView ? (
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(daysInMonth).keys()].map((dayIndex) => {
                        const day = dayIndex + 1;
                        const date = DateTime.local(currentYear, currentMonth + 1, day);

                        // Получаем класс/стиль/tooltip для окраски дня
                        const { style, className, tooltip } = getDayClasses(date);

                        return (
                            <button
                                key={day}
                                onClick={() => openModal(date)}
                                style={style}
                                title={tooltip}
                                className={`w-12 h-12 flex items-center justify-center rounded-full border text-sm hover:opacity-75 transition ${className}`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {getCurrentWeekDates().map((date, index) => {
                        const { style, className, tooltip } = getDayClasses(date);

                        return (
                            <button
                                key={index}
                                onClick={() => openModal(date)}
                                style={style}
                                title={tooltip}
                                className={`w-12 h-12 flex flex-col items-center justify-center rounded-full border text-sm hover:opacity-75 transition ${className}`}
                            >
                                <span>{weekDays[index]}</span>
                                <span>{date.day}</span>
                            </button>
                        );
                    })}
                </div>
            )}
            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                selectedShifts={selectedShifts}
            />
        </div>
    );
};
