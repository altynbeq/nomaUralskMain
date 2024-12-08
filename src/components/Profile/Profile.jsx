import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { getCurrentMonthYear } from '../../methods/getCurrentMonthYear';
import { useProfileStore } from '../../store/index';

export const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedShift, setSelectedShift] = useState(null);
    const subUsersShifts = useProfileStore((state) => state.shifts);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };

    const getCurrentWeekDates = () => {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay() || 7; // Понедельник как первый день
        const monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() - dayOfWeek + 1);

        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date);
        }

        return weekDates;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const getDayColor = (date) => {
        const formattedDate = formatDate(date);

        const hasShift = subUsersShifts?.some((shift) => {
            const startDate = shift.startTime.slice(0, 10);
            const endDate = shift.endTime.slice(0, 10);
            return startDate === formattedDate || endDate === formattedDate;
        });

        return hasShift ? 'bg-blue-500 text-white' : 'bg-gray-300';
    };

    const openModal = (date) => {
        setSelectedDay(date);
        const formattedDate = formatDate(date);

        const shift = subUsersShifts?.find((shift) => {
            const startDate = shift.startTime.slice(0, 10);
            const endDate = shift.endTime.slice(0, 10);
            return startDate === formattedDate || endDate === formattedDate;
        });

        setSelectedShift(shift || null);
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
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                        <h2 className="font-semibold text-lg text-black">
                            План на {getCurrentMonthYear()}
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
                    {[...Array(daysInMonth).keys()].map((day) => {
                        const date = new Date(currentYear, currentMonth, day + 1);
                        return (
                            <button
                                key={day + 1}
                                onClick={() => openModal(date)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${getDayColor(
                                    date,
                                )} border text-sm`}
                            >
                                {day + 1}
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
                            className={`w-8 h-8 p-6 flex flex-col items-center justify-center rounded-full ${getDayColor(
                                date,
                            )} border text-sm`}
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
                selectedShift={selectedShift}
            />
        </div>
    );
};
