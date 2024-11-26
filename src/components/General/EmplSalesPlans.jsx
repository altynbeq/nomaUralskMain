import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { FaRegEdit } from 'react-icons/fa';
import { FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';

export const EmplSalesPlans = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };
    const weekDays = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];

    const openModal = (day) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };
    const getDayColor = (day) => {
        const dayData = dailyData.find((item) => item.date === day);
        if (!dayData) return 'bg-gray-300';

        if (dayData.tasksCompleted && !dayData.wasLate) {
            return 'bg-green-500';
        } else if (!dayData.wasLate) {
            return 'bg-yellow-400';
        } else {
            return 'bg-red-500';
        }
    };
    const dailyData = [
        {
            date: 1,
            tasksCompleted: true,
            wasLate: false,
            workHours: '12:00 - 20:00',
            cameAt: '12:00',
            leftAt: '20:00',
            plan: '600 000 тг',
            actual: '600 000 тг',
        },
        {
            date: 2,
            tasksCompleted: false,
            wasLate: true,
            workHours: '12:00 - 20:00',
            cameAt: '12:30',
            leftAt: '19:00',
            plan: '600 000 тг',
            actual: '480 000 тг',
        },

        {
            date: 3,
            tasksCompleted: false,
            wasLate: false,
            workHours: '12:00 - 20:00',
            cameAt: '12:30',
            leftAt: '19:00',
            plan: '600 000 тг',
            actual: '480 000 тг',
        },
    ];
    const getProgressWidth = () => {
        // if (!dayData) return '0%';

        const planAmount = '600 000';
        const actualAmount = '100 000';
        return `60%`;
    };

    return (
        <div className="max-w-1xl  bg-white rounded-lg shadow-md p-4 mt-[10%]">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">План на 11-2024</h2>
                    <p className="text-gray-500 text-sm">Романтик Уральск</p>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            <div className="flex justify-between mb-4">
                <button className=" p-2 flex text-sm flex-row justify-center align-center gap-2 text-center bg-gray-200 text-black  rounded-2xl mr-2">
                    Редактировать
                    <FaRegEdit />
                </button>
                <div className="flex items-center justify-center ">
                    <div className="relative gap-1  bg-gray-200 dark:bg-gray-700 rounded-full flex items-center p-1">
                        <button
                            onClick={toggleView}
                            className={` p-1 rounded-full transition-colors duration-300 relative z-2  text-sm
                                    ${!isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'}`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={toggleView}
                            className={` p-1 rounded-full transition-colors duration-300 relative z-2 text-sm
                                    ${isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'}`}
                        >
                            Месяц
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-between mb-4">
                <div className="">
                    <h3>Общий план: 123 321 231 тг</h3>
                    <h3>Остаток: 12 321 231 тг</h3>
                </div>
                <div>
                    <h3 className="flex text-center justify-center">12 321 231 тг (60%)</h3>
                    <div className="w-full bg-gray-200 h-2 rounded-full my-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: getProgressWidth() }}
                        />
                    </div>
                </div>
            </div>
            {isMonthView ? (
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(31).keys()].map((day) => (
                        <button
                            key={day + 1}
                            onClick={() => openModal(day + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${getDayColor(
                                day + 1,
                            )} border text-sm`}
                        >
                            {day + 1}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => openModal(day)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border text-sm"
                        >
                            {day}
                        </button>
                    ))}
                </div>
            )}
            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                dailyData={dailyData}
            />
        </div>
    );
};
