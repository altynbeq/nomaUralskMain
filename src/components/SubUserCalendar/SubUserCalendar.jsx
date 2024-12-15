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
            // 5. Если в дне смены нет, то день серый
            return 'bg-gray-300';
        }

        let hasFullWorkedShifts = true;
        let hasAnyIncompleteShifts = false;
        let hasAnyLateShifts = false;
        let hasShiftsWithoutCheckInOrOut = true;

        shifts.forEach((shift) => {
            const hasScanIn = !!shift.scanTime;
            const hasScanOut = !!shift.endScanTime;
            const isLate = shift.lateMinutes > 0;
            const workedMinutes =
                (shift.workedTime?.hours || 0) * 60 + (shift.workedTime?.minutes || 0);
            const shiftDurationMinutes =
                (shift.shiftDuration.hours || 0) * 60 + (shift.shiftDuration.minutes || 0);
            const isFullyWorked = workedMinutes >= shiftDurationMinutes;

            // 4. Если в дне есть смены, но нет ни прихода, ни ухода, то цвет только синий
            if (!hasScanIn && !hasScanOut) {
                hasShiftsWithoutCheckInOrOut = true;
            } else {
                hasShiftsWithoutCheckInOrOut = false;
            }

            // Проверяем, если смена не полностью отработана
            if (!isFullyWorked) {
                hasAnyIncompleteShifts = true;
            }

            // Проверяем, если была задержка на смену
            if (isLate) {
                hasAnyLateShifts = true;
            }

            // Если нет прихода или ухода или смена не полностью отработана, то она не считается "полностью отработанной"
            if (!hasScanIn || !hasScanOut || !isFullyWorked) {
                hasFullWorkedShifts = false;
            }
        });

        // 4. Если ни одна из смен не имеет прихода и ухода
        if (hasShiftsWithoutCheckInOrOut) {
            return 'bg-blue-500 text-white';
        }

        // 1. Если не опоздал и отработал все свои смены на день, то цвет дня зеленый
        if (hasFullWorkedShifts) {
            return 'bg-green-500 text-white';
        }

        // 2. Если опоздал и не отметил в одной из смен на день, то одна часть красная, другая синяя
        if (hasAnyLateShifts && hasShiftsWithoutCheckInOrOut) {
            return 'bg-red-500 bg-right-1/2 bg-blue-500 bg-left-1/2 text-white';
        }

        // 3. Если не опоздал и отработал не всю смену в одной из смен на день, то одна зеленая, другая красная
        if (!hasAnyLateShifts && hasAnyIncompleteShifts) {
            return 'bg-green-500 bg-right-1/2 bg-red-500 bg-left-1/2 text-white';
        }

        // 2. Если опоздал и отработал частично или есть другие нарушения, то цвет одна часть красная, другая синяя
        if (hasAnyLateShifts) {
            return 'bg-red-500 bg-right-1/2 bg-blue-500 bg-left-1/2 text-white';
        }

        // Если ничего не сработало, по умолчанию день серый
        return 'bg-gray-300';
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
