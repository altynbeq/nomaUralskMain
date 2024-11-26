import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';

export const StoreSalesPlan = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);

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

    return (
        <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md p-4 mt-[10%]">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">storee</h2>
                    <p className="text-gray-500 text-sm">Сотрудник</p>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            <div className="flex justify-between mb-4">
                <button className="w-1/2 bg-blue-500 text-white py-2 rounded-md mr-2">
                    Списание
                </button>
                <button className="w-1/2 bg-blue-500 text-white py-2 rounded-md ml-2">Смена</button>
            </div>

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

            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDay={selectedDay}
                dailyData={dailyData}
            />
        </div>
    );
};
