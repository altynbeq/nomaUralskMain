import { useState, useEffect, useMemo } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';
export const EmpltSiftStats = () => {
    const { companyStructure } = useStateContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [month, year]);

    const fetchStats = async () => {
        if (!selectedStore) {
            setStats(null);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/stats/${selectedStore._id}/${month + 1}/${year}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (response.ok) {
                setStats(response.data);
            }
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStore, month, year]);

    const employeesForSelectedDay = useMemo(() => {
        if (!selectedStore || !selectedDay) return [];

        // Запрос на получение смен для выбранного дня
        // Возможно, стоит создать отдельный эндпоинт для получения данных по дню
        // Для упрощения используем уже полученные данные

        // Здесь можно реализовать дополнительную логику, если требуется

        return []; // Пока оставляем пустым
    }, [selectedStore, selectedDay]);

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
            employees: [
                {
                    name: 'John Doe',
                    position: 'Manager',
                    timeLate: '31 mins',
                    date: '01.11.24',
                    location: 'Store 1',
                },
                {
                    name: 'John Doe',
                    position: 'Manager',
                    timeLate: '31 mins',
                    date: '01.11.24',
                    location: 'Store 1',
                },
            ],
        },
        {
            date: 2,
            tasksCompleted: false,
            wasLate: true,
            employees: [
                {
                    name: 'John Doe',
                    position: 'Manager',
                    timeLate: '31 mins',
                    date: '01.11.24',
                    location: 'Store 1',
                },
                {
                    name: 'John Doe',
                    position: 'Manager',
                    timeLate: '31 mins',
                    date: '01.11.24',
                    location: 'Store 1',
                },
            ],
        },
    ];

    return (
        <div className="w-[90%] md:w-[43%] bg-white rounded-lg subtle-border shadow-md p-4 ">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">Опоздания на 11-2024</h2>
                    <p className="text-gray-500 text-sm">ЭТО ДЕМО, без паники</p>
                </div>
            </div>
            <hr className="bg-red max-w-xs mx-auto my-4" />
            <div className="flex flex-row gap-2  md:gap-0 justify-between mb-4">
                <Dropdown
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.value)}
                    options={companyStructure?.stores || []}
                    optionLabel="storeName"
                    showClear
                    placeholder="Магазин"
                    className="bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <div className="flex items-center justify-center">
                    <div className="relative gap-1 bg-gray-200 rounded-full flex items-center p-1">
                        <button
                            onClick={toggleView}
                            className={`p-1 rounded-full transition-colors duration-300 relative z-10 text-sm ${
                                !isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={toggleView}
                            className={`p-1 rounded-full transition-colors duration-300 relative z-10 text-sm ${
                                isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            Месяц
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-between mb-4">
                <div className="flex flex-col md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Количество часов:</h3>
                        <h4>{stats?.toFixed(2)} ч</h4>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Отработано:</h3>
                        <h3 className="flex flex-row">
                            480
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                54%
                            </p>
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Остаток:</h3>
                        <h3 className="flex flex-row">
                            430
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                46%
                            </p>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Количество опозданий:</h3>
                        <h3>11</h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Основное:</h3>
                        <h3 className="flex flex-row">
                            Сатпаев
                            <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                3ч
                            </p>
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Отдел:</h3>
                        <h3 className="flex flex-row">
                            Флористы
                            {/* <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                46%
                            </p> */}
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-evenly subtle-border p-1">
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Cред опоздание:</h3>
                        <h3>16 минут</h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Макс опоздание:</h3>
                        <h3 className="flex flex-row">
                            42 мин
                            {/* <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                3ч
                            </p> */}
                        </h3>
                    </div>
                    <div className="flex flex-row md:flex-col text-center justify-center">
                        <h3>Опоздавший:</h3>
                        <h3 className="flex flex-row">
                            Айжан Быржан
                            {/* <p className="bg-yellow-400 text-black p-1 text-xs ml-1 rounded-2xl">
                                46%
                            </p> */}
                        </h3>
                    </div>
                </div>
            </div>
            {isMonthView ? (
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(daysInMonth)].map((_, index) => {
                        const dayNumber = index + 1;
                        return (
                            <p
                                key={index}
                                className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center py-1 text-center text-sm text-black ${getDayColor(dayNumber)}`}
                            >
                                {dayNumber}
                            </p>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => openModal(index + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border text-sm"
                        >
                            {day}
                        </button>
                    ))}
                </div>
            )}
            {isModalOpen && selectedDay && (
                <div className="fixed z-10 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 pt-4 pr-4 text-gray-500 hover:text-gray-700 rounded-md"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold text-center text-black">
                            Details for {selectedDay}-11-2024
                        </h2>
                        <div className="mt-4 space-y-4">
                            {dailyData
                                .find((item) => item.date === selectedDay)
                                ?.employees.map((employee, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
                                    >
                                        {/* Фото и Имя/Должность */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-black">
                                                    {employee.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {employee.position}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Дата */}
                                        <div className="text-center text-gray-500">
                                            <p className="text-sm">{employee.date}</p>
                                        </div>

                                        {/* Время опоздания */}
                                        <div className="text-center text-gray-500">
                                            <p className="text-sm">{employee.timeLate}</p>
                                        </div>

                                        {/* Филиал */}
                                        <div className="text-right text-gray-500">
                                            <p className="text-sm">{employee.location}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
