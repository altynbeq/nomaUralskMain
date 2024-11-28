import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from '../../../contexts/ContextProvider';

export const EmployeeCalendar = () => {
    const { companyStructure } = useStateContext();

    const [selectedDate, setSelectedDate] = useState(new Date()); // Выбранная дата (месяц и год)
    const [hoveredCircle, setHoveredCircle] = useState(null); // Для тултипа
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для поиска
    const employeesPerPage = 10; // Количество сотрудников на странице
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSubusers, setCurrentSubusers] = useState([]);

    const filteredSubusers = useMemo(() => {
        return companyStructure.subUsers?.filter((subuser) => {
            const matchesSearch = subuser.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = selectedDepartment
                ? subuser.departmentId === selectedDepartment.id
                : true;
            const matchesStore = selectedStore ? subuser.storeId === selectedStore.id : true;

            return matchesSearch && matchesDepartment && matchesStore;
        });
    }, [companyStructure, searchTerm, selectedDepartment, selectedStore]);

    // Получаем количество дней в выбранном месяце
    const daysInMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
    ).getDate();

    // Генерируем массив номеров дней
    const dayNumbers = [...Array(daysInMonth)].map((_, index) => index + 1);

    // Генерируем названия дней недели динамически
    const weekDays = dayNumbers.map((day) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    });

    const handleMouseEnter = (employeeIndex, dayIndex) => {
        setHoveredCircle({ employeeIndex, dayIndex });
    };

    const handleMouseLeave = () => {
        setHoveredCircle(null);
    };

    useEffect(() => {
        setTotalPages(Math.ceil(filteredSubusers?.length / employeesPerPage));
        setCurrentSubusers(
            filteredSubusers?.slice(
                (currentPage - 1) * employeesPerPage,
                currentPage * employeesPerPage,
            ),
        );
    }, [currentPage, filteredSubusers]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getDepartmentName = (departmentId) => {
        if (!companyStructure?.departments?.length) return 'Неизвестный департамент';

        const department = companyStructure.departments.find((dept) => dept._id === departmentId);

        return department ? department.name : 'Неизвестный департамент';
    };

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6 m-16">
            {/* Верхняя панель */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    {/* Используем компонент Calendar для выбора месяца и года */}
                    <Calendar
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.value)}
                        view="month"
                        dateFormat="mm/yy"
                        yearNavigator
                        yearRange="2020:2030"
                        showIcon
                        className="p-inputtext-sm"
                        locale="ru"
                        monthNavigator
                    />
                    <h2 className="text-lg font-semibold text-black">
                        {selectedDate.toLocaleDateString('ru-RU', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>
                </div>
                <div className="flex gap-4">
                    <Dropdown
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.value)}
                        showClear
                        options={companyStructure?.departments || []}
                        optionLabel="name"
                        placeholder="Выберите отдел"
                        className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.value)}
                        options={companyStructure?.stores || []}
                        optionLabel="storeName"
                        showClear
                        placeholder="Выберите магазин"
                        className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Поиск"
                        className="flex-1 w-full pl-10 p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Сотрудник</th>
                            {dayNumbers.map((day, index) => (
                                <th key={index} className="px-2 py-1 text-center text-sm">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-left"></th>
                            {weekDays.map((weekDay, index) => (
                                <th
                                    key={index}
                                    className="px-2 py-1 text-center text-xs text-gray-500"
                                >
                                    {weekDay}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubusers?.map((employee, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>{' '}
                                    {/* Серый кружок */}
                                    <span>{`${employee.name} (${getDepartmentName(employee.departmentId)})`}</span>
                                </td>
                                {dayNumbers.map((day, dayIndex) => (
                                    <td
                                        key={dayIndex}
                                        className="px-2 py-2 text-center relative"
                                        onMouseEnter={() => handleMouseEnter(index, dayIndex)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto hover:bg-blue-500"></div>
                                        {hoveredCircle &&
                                            hoveredCircle.employeeIndex === index &&
                                            hoveredCircle.dayIndex === dayIndex && (
                                                <div
                                                    className={`absolute z-10 p-2 text-sm bg-white border rounded-lg shadow-lg text-black whitespace-nowrap ${
                                                        dayIndex < 5
                                                            ? 'left-full ml-2'
                                                            : dayIndex > daysInMonth - 5
                                                              ? 'right-full mr-2'
                                                              : 'left-1/2 transform -translate-x-1/2'
                                                    } ${
                                                        index >= employeesPerPage - 2
                                                            ? 'bottom-full mb-2'
                                                            : index === employeesPerPage - 3
                                                              ? 'bottom-full mb-1'
                                                              : 'top-full mt-2'
                                                    }`}
                                                >
                                                    <p>
                                                        Дата:{' '}
                                                        {`${day}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`}
                                                    </p>
                                                    <p>Место: {employee.storeId}</p>
                                                    <p>Начало: 09:00</p>
                                                    <p>Конец: 18:00</p>
                                                    <p>Отметился: 09:04</p>
                                                    <p>Закончил: 17:59</p>
                                                </div>
                                            )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
                    }`}
                >
                    Предыдущая
                </button>
                <span className="text-gray-700">{`Страница ${currentPage} из ${totalPages}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'
                    }`}
                >
                    Следующая
                </button>
            </div>
        </div>
    );
};
