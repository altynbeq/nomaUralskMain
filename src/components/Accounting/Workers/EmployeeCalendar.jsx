import React, { useState, useMemo, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { formatOnlyTimeDate, formatOnlyDate } from '../../../methods/dataFormatter';
import { Dialog } from 'primereact/dialog';
import { FaSearch, FaPlus, FaFilter } from 'react-icons/fa';

export const EmployeeCalendar = ({ departments, stores, subUsers }) => {
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const employeesPerPage = 10;
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDayShiftsModal, setSelectedDayShiftsModal] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Вспомогательная функция для расчета опоздания
    const calculateLateMinutes = useCallback((startTime, scanTime) => {
        if (!startTime || !scanTime) return 0;
        const start = new Date(startTime);
        const scan = new Date(scanTime);
        const diffMs = scan - start;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes > 0 ? diffMinutes : 0;
    }, []);

    // Вспомогательная функция для расчета отработанного времени
    const calculateWorkedTime = useCallback((scanTime, endScanTime) => {
        if (!scanTime || !endScanTime) return { hours: 0, minutes: 0 };

        const start = new Date(scanTime);
        const end = new Date(endScanTime);

        const diffMs = end - start;
        if (diffMs < 0) return { hours: 0, minutes: 0 };

        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return { hours, minutes };
    }, []);

    // Создаём мапу для быстрого доступа к названию департамента
    const departmentsMap = useMemo(() => {
        const map = new Map();
        departments?.forEach((dept) => {
            map.set(dept._id, dept.name);
        });
        return map;
    }, [departments]);

    const getDepartmentName = useCallback(
        (departmentId) => {
            return departmentsMap.get(departmentId) ?? 'Неизвестный департамент';
        },
        [departmentsMap],
    );

    // Фильтрация subUsers по критериям
    const filteredSubusers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return subUsers?.filter((subuser) => {
            const matchesSearch = subuser.name.toLowerCase().includes(lowerSearch);
            const matchesDepartment = selectedDepartment
                ? subuser.departmentId === selectedDepartment._id
                : true;

            const subuserDepartment = departments.find((dept) => dept._id === subuser.departmentId);
            const subuserStoreId = subuserDepartment ? subuserDepartment.storeId : null;

            const matchesStore = selectedStore ? subuserStoreId === selectedStore._id : true;

            return matchesSearch && matchesDepartment && matchesStore;
        });
    }, [departments, searchTerm, selectedDepartment, selectedStore, subUsers]);

    const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
    const daysArray = useMemo(
        () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
        [daysInMonth],
    );
    const monthName = useMemo(
        () => new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(year, month)),
        [year, month],
    );

    const totalPages = useMemo(
        () => Math.ceil(filteredSubusers?.length / employeesPerPage),
        [filteredSubusers, employeesPerPage],
    );

    const currentSubusers = useMemo(() => {
        return filteredSubusers?.slice(
            (currentPage - 1) * employeesPerPage,
            currentPage * employeesPerPage,
        );
    }, [currentPage, filteredSubusers, employeesPerPage]);

    const handlePrevMonth = useCallback(() => {
        if (month === 0) {
            setMonth(11);
            setYear((prevYear) => prevYear - 1);
        } else {
            setMonth((prevMonth) => prevMonth - 1);
        }
    }, [month]);

    const handleNextMonth = useCallback(() => {
        if (month === 11) {
            setMonth(0);
            setYear((prevYear) => prevYear + 1);
        } else {
            setMonth((prevMonth) => prevMonth + 1);
        }
    }, [month]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    }, [totalPages]);

    // Мемоизация функции получения смен за день
    const getShiftsForDay = useMemo(() => {
        return (shifts, day) => {
            const dayStart = new Date(year, month, day, 0, 0, 0);
            const dayEnd = new Date(year, month, day, 23, 59, 59);
            return (
                shifts?.filter((shift) => {
                    const shiftStart = new Date(shift.startTime);
                    return shiftStart >= dayStart && shiftStart <= dayEnd;
                }) || []
            );
        };
    }, [month, year]);

    // Определение цвета дня
    const getDayColor = useCallback(
        (shifts) => {
            if (shifts.length === 0) {
                return 'bg-gray-200';
            }
            const hasLate = shifts.some(
                (shift) => calculateLateMinutes(shift.startTime, shift.scanTime) > 0,
            );
            return hasLate ? 'bg-red-500' : 'bg-blue-500';
        },
        [calculateLateMinutes],
    );

    const renderDayShiftsModalContent = useCallback(() => {
        if (selectedDayShiftsModal.length > 0) {
            return (
                <div>
                    <p>
                        <span className="font-bold text-lg">Магазин:</span>{' '}
                        {selectedDayShiftsModal[0]?.selectedStore.storeName}
                    </p>
                    <ul className="list-none flex-col gap-6 flex">
                        {selectedDayShiftsModal.map((shift) => {
                            const startTime = new Date(shift.startTime);
                            const endTime = new Date(shift.endTime);
                            const scanTime = shift.scanTime ? new Date(shift.scanTime) : null;
                            const endScanTime = shift.endScanTime
                                ? new Date(shift.endScanTime)
                                : null;

                            const durationMs = endTime - startTime;
                            const totalMinutes = Math.floor(durationMs / (1000 * 60));
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;

                            const durationText =
                                hours > 0
                                    ? `${hours} ч ${minutes > 0 ? `${minutes} мин` : ''}`
                                    : `${minutes} мин`;

                            // Рассчитываем опоздание, если есть startTime и scanTime
                            const lateMinutes =
                                shift.startTime && shift.scanTime
                                    ? calculateLateMinutes(shift.startTime, shift.scanTime)
                                    : 0;
                            const lateText =
                                shift.startTime && shift.scanTime
                                    ? lateMinutes > 0
                                        ? `Опоздал на ${lateMinutes} мин`
                                        : 'Не опоздал'
                                    : '';

                            const workedTime = calculateWorkedTime(
                                shift.scanTime,
                                shift.endScanTime,
                            );
                            const workedTimeText =
                                workedTime.hours > 0
                                    ? `${workedTime.hours} ч ${workedTime.minutes > 0 ? `${workedTime.minutes} мин` : ''}`
                                    : `${workedTime.minutes} мин`;

                            return (
                                <li key={shift._id} className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <p>
                                            <span className="font-bold text-lg">Начало смены:</span>{' '}
                                            {formatOnlyTimeDate(shift.startTime)}
                                        </p>
                                        <p>
                                            <span className="font-bold text-lg">Конец смены:</span>{' '}
                                            {formatOnlyTimeDate(shift.endTime)}
                                        </p>
                                        <p>
                                            <span className="font-bold text-lg">Длительность:</span>{' '}
                                            {durationText}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        {scanTime && (
                                            <p>
                                                <span className="font-bold text-lg">
                                                    Фактический приход:
                                                </span>{' '}
                                                {formatOnlyTimeDate(shift.scanTime)}
                                            </p>
                                        )}
                                        {endScanTime && (
                                            <p>
                                                <span className="font-bold text-lg">
                                                    Фактический уход:
                                                </span>{' '}
                                                {formatOnlyTimeDate(shift.endScanTime)}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        {shift.scanTime && (
                                            <p
                                                className={
                                                    lateMinutes > 0
                                                        ? 'text-red-500 font-bold text-lg'
                                                        : 'text-green-500 font-bold text-lg'
                                                }
                                            >
                                                {lateText}
                                            </p>
                                        )}
                                        {scanTime && endScanTime && (
                                            <p className="text-blue-500 font-bold text-lg">
                                                Отработано: {workedTimeText}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        } else {
            return <p>Нет смен</p>;
        }
    }, [selectedDayShiftsModal, calculateLateMinutes, calculateWorkedTime]);

    return (
        <div className="w-[100%] bg-white p-6 mx-16 rounded-lg shadow-md">
            {/* Верхняя панель */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center gap-2 ml-4 mt-4">
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
                <div className="flex gap-4 mt-5 md:mt-0 flex-col md:flex-row">
                    <div className="flex flex-row gap-2">
                        <button className="bg-blue-500 flex items-center gap-2 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition">
                            <p>Добавить смену</p>
                            <FaPlus />
                        </button>
                    </div>
                    <div className="relative">
                        {/* Filter Button */}
                        <button
                            className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <FaFilter />
                            <span>Фильтр</span>
                        </button>

                        {/* Dropdown Content */}
                        {isFilterOpen && (
                            <div className="absolute z-10 bg-white p-4 mt-2 w-72 shadow-lg rounded-lg border border-gray-200">
                                {/* Department Dropdown */}
                                <Dropdown
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.value)}
                                    showClear
                                    options={departments || []}
                                    optionLabel="name"
                                    placeholder="Отдел"
                                    className="w-full mb-3 border-blue-500 border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                                />

                                {/* Store Dropdown */}
                                <Dropdown
                                    value={selectedStore}
                                    onChange={(e) => setSelectedStore(e.value)}
                                    options={stores || []}
                                    optionLabel="storeName"
                                    showClear
                                    placeholder="Магазин"
                                    className="w-full border-blue-500 border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск"
                            className="flex-1 w-full pl-10 p-2 border-2 border-blue-500 rounded-lg"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto w-full max-w-full">
                <table className="table-auto w-full max-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 text-left">Сотрудник</th>
                            {daysArray.map((day) => (
                                <th key={day} className="px-2 py-1 text-center text-sm">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-2 py-1 text-left"></th>
                            {daysArray.map((day) => {
                                const date = new Date(year, month, day);
                                const weekDay = new Intl.DateTimeFormat('ru-RU', {
                                    weekday: 'short',
                                }).format(date);
                                return (
                                    <th
                                        key={day}
                                        className="py-1 text-center text-xs text-gray-500"
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
                                <td className="px-4 py-2 inline-flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="flex flex-col">
                                        <p className="text-sm">{employee.name}</p>
                                        <p className="text-sm">
                                            ({getDepartmentName(employee.departmentId)})
                                        </p>
                                    </div>
                                </td>
                                {daysArray.map((day) => {
                                    const shifts = getShiftsForDay(employee.shifts, day);
                                    const dayColor = getDayColor(shifts);

                                    return (
                                        <td
                                            key={day}
                                            className="py-1 text-center relative cursor-pointer"
                                            onClick={() => setSelectedDayShiftsModal(shifts)}
                                        >
                                            <div
                                                className={`w-4 h-4 flex items-center rounded-full ${dayColor} hover:bg-blue-500`}
                                            ></div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedDayShiftsModal?.length > 0 && (
                <Dialog
                    visible={selectedDayShiftsModal?.length > 0}
                    onHide={() => setSelectedDayShiftsModal([])}
                    header={`Смена на ${
                        selectedDayShiftsModal[0]?.startTime
                            ? formatOnlyDate(selectedDayShiftsModal[0]?.startTime)
                            : ''
                    }`}
                >
                    {renderDayShiftsModalContent()}
                </Dialog>
            )}
            {/* Пагинация */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ml-4 rounded-lg ${
                        currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
                    }`}
                >
                    &lt;
                </button>
                <span className="text-gray-700">{`Страница ${currentPage} из ${totalPages || 1}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 mr-4 rounded-lg ${
                        currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'
                    }`}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};
