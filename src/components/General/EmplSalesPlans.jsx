import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { FaRegEdit } from 'react-icons/fa';
import { FaCalendarWeek, FaSearch } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';

export const EmplSalesPlans = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('Сентябрь');
    const months = [
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
    ];
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
    const workers = [
        {
            id: 1,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 2,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 3,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 5,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 6,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 7,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 8,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: 9,
            name: 'John Doe',
            position: 'Manager',
            imageUrl: 'https://via.placeholder.com/100',
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    // Filter workers based on the search term
    const filteredWorkers = workers.filter((worker) =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return (
        <div className="w-[90%]  bg-white rounded-lg shadow-md p-4 ">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <h2 className="font-semibold text-lg text-black">План сотрудников</h2>
                    <p className="text-gray-500 text-sm">Романтик Уральск</p>
                </div>
            </div>
            <hr className="bg-red w-full mx-auto my-4" />
            <div className="flex gap-4 justify-between align-center items-center  mb-4">
                <div className="w-full mb-4 relative">
                    <input
                        type="text"
                        placeholder="Search for an employee"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex flex-wrap z-10 pb-6 gap-1 border-solid border-gray-500">
                    <Dropdown
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.value)}
                        options={months}
                        optionLabel="name"
                        placeholder="Выберите месяц"
                        className="w-full md:w-14rem border border-gray-400 text-black bg-white"
                    />
                </div>
                <div className="flex flex-wrap z-10 pb-6 gap-1 border-solid border-gray-500">
                    <Dropdown
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.value)}
                        options={months}
                        optionLabel="name"
                        placeholder="Выберите месяц"
                        className="w-full md:w-14rem border border-gray-400 text-black bg-white"
                    />
                </div>
                <div className="flex items-center justify-center ">
                    <div className="relative gap-1  bg-gray-200 dark:bg-gray-700 rounded-full flex items-center p-1">
                        <button
                            onClick={toggleView}
                            className={` p-1 rounded-full transition-colors duration-300 relative z-2  text-sm
                                    ${!isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'}`}
                        >
                            Выставлен
                        </button>
                        <button
                            onClick={toggleView}
                            className={` p-1 rounded-full transition-colors duration-300 relative z-2 text-sm
                                    ${isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'}`}
                        >
                            Нету
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-between mb-4">
                <div className="">
                    <h3>Общий план: 123 321 231 тг</h3>
                    {/* <h3>Остаток: 12 321 231 тг</h3> */}
                </div>
            </div>
            {isMonthView ? (
                <div className="grid grid-cols-3 gap-2">
                    {workers.map((worker) => (
                        <div
                            key={worker.id}
                            className="flex flex-col items-center text-center p-1 border rounded-lg"
                        >
                            <img
                                src={worker.imageUrl}
                                alt={worker.name}
                                className="w-12 h-12 rounded-full object-cover mb-2"
                            />
                            <div className="text-sm font-semibold">{worker.name}</div>
                            <div className="text-xs text-gray-500">{worker.position}</div>
                        </div>
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
