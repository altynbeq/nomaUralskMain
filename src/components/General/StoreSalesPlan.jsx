import { useEffect, useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { dailyData } from '../../data/dailyData';
import { Dropdown } from 'primereact/dropdown';

export const StoreSalesPlan = ({ stores }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [totalPlan, setTotalPlan] = useState();

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

    useEffect(() => {
        if (selectedStore) {
            // Общий план для выбранного магазина
            const store = stores?.find((store) => store.storeName === selectedStore.storeName);
            setTotalPlan(store?.plans?.reduce((total, plan) => total + plan.goal, 0) || 0);
        } else {
            // Общий план для всех магазинов
            setTotalPlan(
                stores?.reduce(
                    (total, store) =>
                        total +
                        (store.plans?.reduce((storeTotal, plan) => storeTotal + plan.goal, 0) || 0),
                    0,
                ),
            );
        }
    }, [stores, selectedStore]);

    return (
        <div className="w-[90%] md:w-[43%] mt-10 md:mt-0 subtle-border  bg-white rounded-lg shadow-md p-4 ">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">План продаж на 11-2024</h2>
                    <p className="text-gray-500 text-sm">ЭТО ДЕМО, без паники</p>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            <div className="flex gap-2 md:gap-0 flex-row md:flex-row justify-between mb-4">
                <Dropdown
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.value)}
                    options={stores || []}
                    optionLabel="storeName"
                    showClear
                    placeholder="Магазин"
                    className="border-blue-500 border-2 rounded-lg focus:ring-2 focus:ring-blue-300"
                />
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
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Общий план:</h3>
                        <h3>{totalPlan} тг</h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            110 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                89%
                            </p>
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            12 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                11%
                            </p>
                        </h3>
                    </div>
                </div>
                <div className="flex  flex-col gap-2 md:gap-0 md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>План цветок:</h3>
                        <h3> 78 321 231 тг</h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            67 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                73%
                            </p>
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            11 321 231 тг
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                27%
                            </p>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>План сопутка:</h3>
                        <h3> 8 331 400 тг</h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Выполнено:</h3>
                        <h3 className="flex flex-row">
                            4 021 231 тг
                            <p className="bg-red-600 text-black p-1 text-xs ml-1 rounded-2xl">
                                47%
                            </p>
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
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
