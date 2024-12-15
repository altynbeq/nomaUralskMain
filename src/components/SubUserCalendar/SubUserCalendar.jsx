// SubUserCalendar.jsx

import React, { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { getCurrentMonthYear } from '../../methods/getCurrentMonthYear';
import { useSubUserStore } from '../../store/index';
import avatar from '../../data/avatar.jpg';
import { startOfWeek, addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const SubUserCalendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedShifts, setSelectedShifts] = useState([]); // Изменено на массив
    const subUsersShifts = useSubUserStore((state) => state.shifts);
    const subUserImage = useSubUserStore((state) => state.subUser?.image);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };

    const getCurrentWeekDates = () => {
        const currentDate = new Date();
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Понедельник как первый день
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    };

    const formatDate = (date) => format(date, 'yyyy-MM-dd', { locale: ru });

    const getDayColor = (date) => {
        const formattedDate = formatDate(date);

        // Получаем все смены на выбранный день
        const shifts =
            subUsersShifts?.filter((shift) => {
                const shiftDate = format(new Date(shift.startTime), 'yyyy-MM-dd');
                return shiftDate === formattedDate;
            }) || [];

        if (shifts.length === 0) {
            return 'bg-gray-300 text-black'; // Нет смены
        }

        // Логика определения цвета на основе нескольких смен
        let hasLate = false;
        let hasIncomplete = false;
        let hasNoScans = true; // Предполагаем, что нет сканов

        shifts.forEach((shift) => {
            if (shift.scanTime) {
                hasNoScans = false;
                const lateMinutes = shift.lateMinutes || 0;
                if (lateMinutes > 0) hasLate = true;
            }
            if (
                !shift.endScanTime ||
                (shift.endTime && new Date(shift.endScanTime) < new Date(shift.endTime))
            ) {
                hasIncomplete = true;
            }
        });

        // Определяем цвет в зависимости от условий
        if (hasLate && hasIncomplete) {
            return 'bg-gradient-to-r from-red-500 to-blue-500 text-white';
        } else if (hasLate) {
            return 'bg-red-500 text-white';
        } else if (hasIncomplete) {
            return 'bg-blue-500 text-white';
        } else if (hasNoScans) {
            return 'bg-blue-500 text-white';
        } else {
            return 'bg-green-500 text-white';
        }
    };

    const openModal = (date) => {
        setSelectedDay(date);
        const formattedDate = formatDate(date);

        const shifts = subUsersShifts?.filter((shift) => {
            const shiftDate = format(new Date(shift.startTime), 'yyyy-MM-dd');
            return shiftDate === formattedDate;
        });

        setSelectedShifts(shifts || []);
        setIsModalOpen(true);
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);

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
                    {/* Месячный вид */}
                    {[...Array(daysInMonth).keys()].map((dayIndex) => {
                        const day = dayIndex + 1;
                        const date = new Date(currentYear, currentMonth, day);
                        return (
                            <button
                                key={day}
                                onClick={() => openModal(date)}
                                className={`w-12 h-12 flex items-center justify-center rounded-full border text-sm ${getDayColor(
                                    date,
                                )}`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {/* Недельный вид */}
                    {getCurrentWeekDates().map((date, index) => (
                        <button
                            key={index}
                            onClick={() => openModal(date)}
                            className={`w-12 h-12 flex flex-col items-center justify-center rounded-full border text-sm ${getDayColor(
                                date,
                            )}`}
                        >
                            <span>{weekDays[index]}</span>
                            <span>{date.getDate()}</span>
                        </button>
                    ))}
                </div>
            )}
            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                selectedShifts={selectedShifts} // Передаём массив смен
            />
        </div>
    );
};
