import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useStateContext } from '../../../contexts/ContextProvider';
import { formatOnlyTimeDate, formatOnlyDate } from '../../../methods/dataFormatter';
import { Dialog } from 'primereact/dialog';

export const EmployeeCalendar = () => {
    const { companyStructure } = useStateContext();
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const employeesPerPage = 10;
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSubusers, setCurrentSubusers] = useState([]);
    const [selectedDayShiftsModal, setSelectedDayShiftsModal] = useState([]);

    // Вспомогательная функция для расчета опоздания
    const calculateLateMinutes = (startTime, scanTime) => {
        if (!startTime || !scanTime) return 0;

        const start = new Date(startTime);
        const scan = new Date(scanTime);

        const diffMs = scan - start;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        return diffMinutes > 0 ? diffMinutes : 0;
    };

    // Вспомогательная функция для расчета отработанного времени
    const calculateWorkedTime = (scanTime, endScanTime) => {
        if (!scanTime || !endScanTime) return { hours: 0, minutes: 0 };

        const start = new Date(scanTime);
        const end = new Date(endScanTime);

        const diffMs = end - start;
        if (diffMs < 0) return { hours: 0, minutes: 0 }; // Защита от отрицательных значений

        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return { hours, minutes };
    };

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

    const daysInMonth = new Date(year, month + 1, 0).getDate();

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

    const renderDayShiftsModalContent = () => {
        if (selectedDayShiftsModal.length > 0) {
            return (
                <div>
                    <p>Магазин: {selectedDayShiftsModal[0]?.selectedStore.storeName}</p>
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

                            // Расчет опоздания
                            const lateMinutes = calculateLateMinutes(
                                shift.startTime,
                                shift.scanTime,
                            );
                            const lateText =
                                lateMinutes > 0 ? `Опоздал на ${lateMinutes} мин` : 'Не опоздал';

                            // Расчет отработанного времени
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
                                        <p>Начало смены: {formatOnlyTimeDate(shift.startTime)}</p>
                                        <p>Конец смены: {formatOnlyTimeDate(shift.endTime)}</p>
                                        <p>Длительность: {durationText}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        {scanTime && (
                                            <p>
                                                Фактический приход:{' '}
                                                {formatOnlyTimeDate(shift.scanTime)}
                                            </p>
                                        )}
                                        {endScanTime && (
                                            <p>
                                                Фактический уход:{' '}
                                                {formatOnlyTimeDate(shift.endScanTime)}
                                            </p>
                                        )}
                                        {/* Отображение опоздания */}
                                        <p
                                            className={
                                                lateMinutes > 0 ? 'text-red-500' : 'text-green-500'
                                            }
                                        >
                                            {lateText}
                                        </p>
                                        {/* Отображение отработанного времени */}
                                        {scanTime && endScanTime && (
                                            <p className="text-blue-500">
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
    };

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
                    <div className="flex gap-2 justify-between">
                        <Dropdown
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.value)}
                            showClear
                            options={companyStructure?.departments || []}
                            optionLabel="name"
                            placeholder="Отдел"
                            className="flex-1 border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                        />
                        <Dropdown
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.value)}
                            options={companyStructure?.stores || []}
                            optionLabel="storeName"
                            showClear
                            placeholder="Магазин"
                            className="flex-1 border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск"
                            className="flex-1 w-full pl-10 p-2 border-2 border-blue-500 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto w-full max-w-full">
                <table className="table-auto w-full max-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 text-left">Сотрудник</th>
                            {[...Array(daysInMonth)].map((_, index) => (
                                <th key={index} className="px-2 py-1 text-center text-sm">
                                    {index + 1}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-2 py-1 text-left"></th>
                            {[...Array(daysInMonth)].map((_, index) => {
                                const date = new Date(year, month, index + 1);
                                const weekDay = new Intl.DateTimeFormat('ru-RU', {
                                    weekday: 'short',
                                }).format(date);
                                return (
                                    <th
                                        key={index}
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
                                        <p className="text-sm">{`${employee.name}`}</p>
                                        <p className="text-sm">
                                            ({getDepartmentName(employee.departmentId)})
                                        </p>
                                    </div>
                                </td>
                                {[...Array(daysInMonth)].map((_, dayIndex) => {
                                    const shifts = getShiftsForDay(employee.shifts, dayIndex + 1);
                                    return (
                                        <td
                                            key={dayIndex}
                                            className="py-1 text-center relative cursor-pointer"
                                            onClick={() => setSelectedDayShiftsModal(shifts)}
                                        >
                                            <div
                                                className={`w-4 h-4 flex items-center rounded-full ${
                                                    shifts.length > 0
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-200'
                                                } hover:bg-blue-500`}
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
                    header={`Смена на ${selectedDayShiftsModal[0]?.startTime ? formatOnlyDate(selectedDayShiftsModal[0]?.startTime) : ''}`}
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
