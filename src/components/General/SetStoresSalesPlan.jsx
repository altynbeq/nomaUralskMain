import { useState } from 'react';
import { CalendarModal } from '../CalendarModal';
import { Dropdown } from 'primereact/dropdown';
import { useStateContext } from '../../contexts/ContextProvider';
import avatar from '../../data/avatar.jpg';
import { dailyData } from '../../data/dailyData';

export const SetStoresSalesPlan = () => {
    const { companyStructure } = useStateContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isMonthView, setIsMonthView] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleView = () => {
        setIsMonthView(!isMonthView);
    };

    const weekDays = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];

    const openModal = (day) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    // Enhanced filtering logic
    const filteredStores = companyStructure.stores?.filter((store) => {
        const matchesSearchTerm = store.storeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSelectedStore = selectedStore ? store._id === selectedStore._id : true;
        const matchesSelectedDepartment = selectedDepartment
            ? companyStructure.departments?.some(
                  (dept) => dept.storeId === store._id && dept._id === selectedDepartment._id,
              )
            : true;

        return matchesSearchTerm && matchesSelectedStore && matchesSelectedDepartment;
    });

    return (
        <div className="w-[90%] bg-white rounded-lg shadow-md p-4 ">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
<<<<<<< Updated upstream
                    <h2 className="font-semibold text-lg text-black">План магазинов</h2>
=======
                    <h2 className="font-semibold text-lg text-black">
                        Поставить план для магазинов
                    </h2>
>>>>>>> Stashed changes
                    <p className="text-gray-500 text-sm">Романтик Уральск</p>
                </div>
            </div>
            <hr className="bg-red w-full mx-auto my-4" />
            <div className="flex gap-4 mb-4">
                <div className="w-full relative">
                    <input
                        type="text"
                        placeholder="Поиск магазина"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap z-10 gap-1 border-solid border-gray-500">
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.value)}
                        options={companyStructure?.stores || []}
                        optionLabel="storeName"
                        showClear
                        placeholder="Выберите магазин"
                        className="bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div className="flex flex-wrap z-10 gap-1 border-solid border-gray-500">
                    <Dropdown
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.value)}
                        options={companyStructure?.departments || []}
                        optionLabel="name"
                        showClear
                        placeholder="Выберите отдел"
                        className="bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div className="relative gap-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center p-1">
                    <button
                        onClick={toggleView}
                        className={`p-1 rounded-full transition-colors duration-300 relative z-2 text-sm ${
                            !isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                        }`}
                    >
                        Выставлен
                    </button>
                    <button
                        onClick={toggleView}
                        className={`p-1 rounded-full transition-colors duration-300 relative z-2 text-sm ${
                            isMonthView ? 'bg-white shadow-md' : 'bg-transparent text-gray-500'
                        }`}
                    >
                        Нету
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-between mb-4">
                <div>
                    <h3>Общий план: 123 321 231 тг</h3>
                </div>
            </div>
            {isMonthView ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
                    {filteredStores?.length > 0 ? (
                        filteredStores.map((store) => (
                            <div
                                key={store._id}
                                className="flex flex-col items-center text-center p-1 border rounded-lg"
                            >
                                <img
                                    src={
                                        store?.image
                                            ? `https://nomalytica-back.onrender.com${store.image}`
                                            : avatar
                                    }
                                    alt={store.storeName}
                                    className="w-12 h-12 rounded-full object-cover mb-2"
                                />
                                <div className="text-sm font-semibold">{store.storeName}</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-full">
                            Магазины не найдены.
                        </p>
                    )}
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
