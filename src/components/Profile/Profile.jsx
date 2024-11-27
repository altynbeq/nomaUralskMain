import { useState, useEffect } from 'react';
import { CalendarModal } from '../CalendarModal';

export const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [subuserShifts, setSubuserShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };
    const weekDays = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];

    const openModal = (day) => {
        setSelectedDay(day);
        const formattedDay = new Date(new Date().setDate(day)).toISOString().slice(0, 10);
        const shift = subuserShifts.find((shift) => {
            const startDate = shift.startTime.slice(0, 10);
            const endDate = shift.endTime.slice(0, 10);
            return startDate === formattedDay || endDate === formattedDay;
        });

        setSelectedShift(shift || null);
        setIsModalOpen(true);
    };
    const getDayColor = (day) => {
        const formattedDay = new Date(new Date().setDate(day)).toISOString().slice(0, 10);

        const shift = subuserShifts.find((shift) => {
            const startDate = shift.startTime.slice(0, 10); // Оставляем только дату
            const endDate = shift.endTime.slice(0, 10); // Оставляем только дату
            return startDate === formattedDay || endDate === formattedDay;
        });
        if (shift) {
            return 'bg-blue-500 text-white';
        }
        return 'bg-gray-300';
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
        return `60%`;
    };

    useEffect(() => {
        const subuserId = localStorage.getItem('_id');
        const fetchSubUserShifts = async () => {
            try {
                const response = await fetch(
                    `https://nomalytica-back.onrender.com/api/shifts/${subuserId}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
                setSubuserShifts(result);
            } catch (error) {
                console.error('Error fetching sub-user data:', error);
            }
        };
        fetchSubUserShifts();
    }, []);

    return (
        <div className="w-[90%] md:w-[50%] ml-5  bg-white subtle-border rounded-lg shadow-md p-4 ">
            <div className="flex flex-row justify-between">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                        <h2 className="font-semibold text-lg text-black">План на 11-2024</h2>
                        <p className="text-gray-500 text-sm">Романтик Уральск</p>
                    </div>
                </div>
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
            <hr className="bg-red max-w-xs mx-auto my-4" />
            {/* <div className="flex justify-between mb-4">
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
            </div> */}
            <div className="flex flex-col gap-4 justify-between mb-4">
                <div className="flex flex-col md:flex-row  justify-between p-2">
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
                selectedShift={selectedShift}
            />
        </div>
    );
};
