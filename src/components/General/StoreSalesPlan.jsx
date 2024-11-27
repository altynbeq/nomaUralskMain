import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { FaRegEdit } from 'react-icons/fa';
import { dailyData } from '../../data/dailyData';

export const StoreSalesPlan = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedStore, setSelectedStore] = useState('Абая');

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };

    const handleStoreChange = (event) => {
        setSelectedStore(event.target.value);
    };

    const weekDays = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];
    const stores = ['Абая', 'Фурманова', 'Центр'];
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

    const getProgressWidth = () => {
        return `60%`;
    };

    return (
        <div className="w-[43%]  bg-white rounded-lg shadow-md p-4 ">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">План продаж на 11-2024</h2>
                    <p className="text-gray-500 text-sm">Романтик Уральск</p>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            <div className="flex justify-between mb-4">
                <select
                    value={selectedStore}
                    onChange={handleStoreChange}
                    className="p-2 bg-gray-200 text-black rounded-lg"
                >
                    {stores.map((store, index) => (
                        <option key={index} value={store}>
                            {store}
                        </option>
                    ))}
                </select>
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
                <div className="flex flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-col text-center justify-center">
                        <h3>Общий план:</h3>
                        <h3> 123 321 231 тг</h3>
                    </div>
                    <div>
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            110 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                89%
                            </p>
                        </h3>
                    </div>
                    <div>
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            12 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                11%
                            </p>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-col text-center justify-center">
                        <h3>План цветок:</h3>
                        <h3> 78 321 231 тг</h3>
                    </div>
                    <div>
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            67 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                73%
                            </p>
                        </h3>
                    </div>
                    <div>
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            11 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                27%
                            </p>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-col text-center justify-center">
                        <h3>План сопутка:</h3>
                        <h3> 8 331 400 тг</h3>
                    </div>
                    <div>
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            4 021 231 тг
                            <p className="bg-red-600 text-black p-1 text-xs ml-1 rounded-2xl">
                                47%
                            </p>
                        </h3>
                    </div>
                    <div>
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            4 321 231 тг
                            <p className="bg-red-600 text-black p-1 text-xs ml-1 rounded-2xl">
                                53%
                            </p>
                        </h3>
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
