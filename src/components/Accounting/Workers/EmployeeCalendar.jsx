import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useStateContext } from '../../../contexts/ContextProvider';
import { formatOnlyTimeDate } from '../../../methods/dataFormatter';

export const EmployeeCalendar = () => {
    const { companyStructure } = useStateContext();
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth()); // Ноябрь (0-11)
    const [year, setYear] = useState(currentDate.getFullYear());
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
                ? subuser.departmentId === selectedDepartment._id
                : true;

            const subuserDepartment = companyStructure.departments.find(
                (dept) => dept._id === subuser.departmentId,
            );
            const subuserStoreId = subuserDepartment ? subuserDepartment.storeId : null;

            const matchesStore = selectedStore ? subuserStoreId === selectedStore._id : true;

            return matchesSearch && matchesDepartment && matchesStore;
        });
    }, [companyStructure, searchTerm, selectedDepartment, selectedStore]);

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Кол-во дней в месяце

    // Получаем название месяца динамически
    const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(
        new Date(year, month),
    );

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

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

    const getShiftsForDay = (shifts, day) => {
        const dayStart = new Date(year, month, day, 0, 0, 0);
        const dayEnd = new Date(year, month, day, 23, 59, 59);

        return (
            shifts?.filter((shift) => {
                const shiftStart = new Date(shift.startTime);

                // Проверяем, начинается ли смена в текущий день
                return shiftStart >= dayStart && shiftStart <= dayEnd;
            }) || []
        );
    };

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6 m-16">
            {/* Верхняя панель */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 w-10 h-10 bg-gray-200 rounded-full text-gray-600"
                    >
                        ←
                    </button>
                    <h2 className="text-lg font-semibold text-black">{`${monthName} ${year} г.`}</h2>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 w-10 h-10 bg-gray-200 rounded-full text-gray-600"
                    >
                        →
                    </button>
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
                            {[...Array(daysInMonth)].map((_, index) => (
                                <th key={index} className="px-2 py-1 text-center text-sm">
                                    {index + 1}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-left"></th>
                            {[...Array(daysInMonth)].map((_, index) => {
                                const date = new Date(year, month, index + 1);
                                const weekDay = new Intl.DateTimeFormat('ru-RU', {
                                    weekday: 'short',
                                }).format(date);
                                return (
                                    <th
                                        key={index}
                                        className="px-2 py-1 text-center text-xs text-gray-500"
                                    >
                                        {weekDay}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubusers?.map((employee, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>{' '}
                                    {/* Серый кружок */}
                                    <span>{`${employee.name} (${getDepartmentName(
                                        employee.departmentId,
                                    )})`}</span>
                                </td>
                                {[...Array(daysInMonth)].map((_, dayIndex) => {
                                    const shifts = getShiftsForDay(employee.shifts, dayIndex + 1);
                                    return (
                                        <td
                                            key={dayIndex}
                                            className="px-2 py-2 text-center relative"
                                            onMouseEnter={() => handleMouseEnter(index, dayIndex)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div
                                                className={`w-6 h-6 rounded-full mx-auto ${
                                                    shifts.length > 0
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-200'
                                                } hover:bg-blue-500`}
                                            ></div>
                                            {hoveredCircle &&
                                                hoveredCircle.employeeIndex === index &&
                                                hoveredCircle.dayIndex === dayIndex && (
                                                    <div className="absolute z-10 p-2 text-sm bg-white border rounded-lg shadow-lg text-black min-w-[180px]">
                                                        <p>
                                                            Дата:{' '}
                                                            {`${dayIndex + 1}.${month + 1}.${year}`}
                                                        </p>
                                                        {shifts.length > 0 ? (
                                                            shifts.map((shift) => (
                                                                <div key={shift._id}>
                                                                    <p>
                                                                        Начало:{' '}
                                                                        {formatOnlyTimeDate(
                                                                            shift.startTime,
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        Конец:{' '}
                                                                        {formatOnlyTimeDate(
                                                                            shift.endTime,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>Нет смен</p>
                                                        )}
                                                    </div>
                                                )}
                                        </td>
                                    );
                                })}
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
