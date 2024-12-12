import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { formatOnlyTimeDate } from '../../../methods/dataFormatter';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { AddShift } from '../../Calendar/AddShift';
import { EditShift } from '../../Calendar/EditShift';
import { toast } from 'react-toastify';
import { useCompanyStructureStore, useAuthStore } from '../../../store/index';
import { socket } from '../../../socket'; // путь к вашему socket.js
import { PaginationControls } from '../PaginationControls';
import { ShiftModal } from './ShiftModal';
import { CalendarTable } from './CalendarTable';
import { Filters } from './Filters';
import { Button } from 'primereact/button';
import { CheckInCheckOutModal } from './CheckInCheckOutModal';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmployeeCalendar = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    // const subUsers = useCompanyStructureStore((state) => state.subUsers);
    const departments = useCompanyStructureStore((state) => state.departments);
    const user = useAuthStore((state) => state.user);
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
    const [showModalAddShift, setShowModalAddShift] = useState(false);
    const [checkInCheckoutProps, setCheckinCheckoutProps] = useState({
        type: '',
        visible: false,
        time: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    // Локальное состояние для subUsers, чтобы обновлять их динамически
    const [subUsersState, setSubUsersState] = useState([]);

    useEffect(() => {
        const companyId = user?.companyId ? user.companyId : user?.id;
        if (!companyId) {
            return;
        }
        const fetchCompanySubUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(
                    `/structure/get-structure-by-userId/${companyId}`,
                    {
                        timeout: 90000,
                    },
                );
                setSubUsersState(response.data.subUsers);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanySubUsers();
    }, [user.companyId, user?.id]);

    useEffect(() => {
        socket.on('new-shift', (newShifts) => {
            setSubUsersState((prevSubUsers) => {
                // Копируем предыдущее состояние
                const updatedUsers = [...prevSubUsers];

                newShifts.forEach((shift) => {
                    const userIndex = updatedUsers.findIndex(
                        (user) => user._id === shift.subUserId._id,
                    );

                    if (userIndex !== -1) {
                        const user = updatedUsers[userIndex];

                        // Если у пользователя нет смен, создаем пустой массив
                        if (!user.shifts) user.shifts = [];

                        // Проверяем, существует ли уже эта смена
                        const shiftExists = user.shifts.some(
                            (existingShift) => existingShift._id === shift._id,
                        );

                        // Добавляем только если смены еще нет
                        if (!shiftExists) {
                            user.shifts.push(shift);
                        }
                    }
                });

                return updatedUsers;
            });
        });

        // Очистка подписки при размонтировании компонента
        return () => {
            socket.off('new-shift');
        };
    }, []);

    // Состояние для отфильтрованных отделов на основе выбранного магазина
    const [filteredDepartments, setFilteredDepartments] = useState([]);

    const handleSocketShiftUpdate = useCallback((updatedShift) => {
        // Обновляем данные в subUsersState
        setSubUsersState((prevSubUsers) => {
            return prevSubUsers.map((user) => {
                if (!user.shifts) return user;

                // Ищем нужную смену по ID
                const shiftIndex = user.shifts.findIndex((s) => s._id === updatedShift._id);
                if (shiftIndex !== -1) {
                    // Клонируем массив, чтобы не мутировать state напрямую
                    const updatedShifts = [...user.shifts];
                    updatedShifts[shiftIndex] = updatedShift;
                    return { ...user, shifts: updatedShifts };
                }
                return user;
            });
        });
        setSelectedDayShiftsModal((prevShifts) => {
            return prevShifts.map((s) => (s._id === updatedShift._id ? updatedShift : s));
        });
    }, []);

    useEffect(() => {
        // Слушаем событие 'update-shift' от сервера
        socket.on('update-shift', (data) => {
            // handleSocketShiftUpdate(data.shift);
        });

        // Очистка при размонтировании компонента
        return () => {
            socket.off('update-shift');
        };
    }, [handleSocketShiftUpdate]);

    // useEffect(() => {
    //     setSubUsersState(subUsers);
    // }, [subUsers]);

    const calculateLateMinutes = useCallback((startTime, scanTime) => {
        if (!startTime || !scanTime) return 0;
        const start = new Date(startTime);
        const scan = new Date(scanTime);
        const diffMs = scan - start;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes > 0 ? diffMinutes : 0;
    }, []);

    const calculateWorkedTime = useCallback((scanTime, endScanTime) => {
        if (!scanTime || !endScanTime) return { hours: 0, minutes: 0 };

        const start = new Date(scanTime);
        const end = new Date(endScanTime);

        // Если время окончания меньше времени начала (пересечение полуночи)
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const diffMs = end - start; // Разница в миллисекундах
        const totalMinutes = diffMs / (1000 * 60); // Общее время в минутах

        const roundedMinutes = Math.ceil(totalMinutes); // Используем Math.ceil для учета долей минут
        const hours = Math.floor(roundedMinutes / 60);
        const minutes = roundedMinutes % 60;

        return { hours, minutes };
    }, []);

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

    // Фильтрация отделов после выбора магазина
    useEffect(() => {
        if (selectedStore) {
            const filtered = departments.filter((dept) => dept.storeId === selectedStore._id);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
            setSelectedDepartment(null); // Сбрасываем выбранный отдел при сбросе магазина
        }
    }, [selectedStore, departments]);

    const filteredSubusers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return subUsersState?.filter((subuser) => {
            const matchesSearch = subuser.name.toLowerCase().includes(lowerSearch);
            const matchesDepartment = selectedDepartment
                ? subuser.departmentId === selectedDepartment._id
                : true;

            const subuserDepartment = departments.find((dept) => dept._id === subuser.departmentId);
            const subuserStoreId = subuserDepartment ? subuserDepartment.storeId : null;

            const matchesStore = selectedStore ? subuserStoreId === selectedStore._id : true;

            return matchesSearch && matchesDepartment && matchesStore;
        });
    }, [departments, searchTerm, selectedDepartment, selectedStore, subUsersState]);

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

    const getDayColor = useCallback(
        (shifts) => {
            if (shifts.length === 0) {
                return { type: 'gray' };
            }

            // Предполагаем, что на день может быть только одна смена.
            // Если их несколько, можно адаптировать логику.
            const shift = shifts[0];

            const hasScanIn = !!shift.scanTime;
            const hasScanOut = !!shift.endScanTime;

            if (!hasScanIn && !hasScanOut) {
                return { type: 'blue' };
            }

            const lateMinutes = calculateLateMinutes(shift.startTime, shift.scanTime);
            const workedTime = calculateWorkedTime(shift.scanTime, shift.endScanTime);

            const isLate = lateMinutes > 0;
            const isIncomplete =
                !hasScanOut ||
                (shift.endTime &&
                    shift.endScanTime &&
                    new Date(shift.endScanTime) < new Date(shift.endTime));

            if (!isLate && !isIncomplete) {
                return { type: 'green' };
            }

            if (isLate && !hasScanOut) {
                return { type: 'split-red-blue' };
            }

            return { type: 'split' };
        },
        [calculateLateMinutes, calculateWorkedTime],
    );

    // Функция для удаления смены из selectedDayShiftsModal и из subUsersState
    const handleShiftDelete = useCallback((shiftId) => {
        // Удаляем смену из модалки
        setSelectedDayShiftsModal((prevShifts) =>
            prevShifts.filter((shift) => shift._id !== shiftId),
        );

        // Удаляем смену из subUsersState
        setSubUsersState((prevSubUsers) => {
            return prevSubUsers.map((user) => {
                if (user.shifts) {
                    const hasShift = user.shifts.some((s) => s._id === shiftId);
                    if (hasShift) {
                        return {
                            ...user,
                            shifts: user.shifts.filter((s) => s._id !== shiftId),
                        };
                    }
                }
                return user;
            });
        });

        toast.success('Вы успешно удалили смену');
    }, []);

    const handleShiftUpdate = useCallback((updatedShift) => {
        // Обновляем смену в selectedDayShiftsModal
        setSelectedDayShiftsModal((prevShifts) =>
            prevShifts.map((shift) => (shift._id === updatedShift._id ? updatedShift : shift)),
        );

        // Обновляем смену в subUsersState
        setSubUsersState((prevSubUsers) => {
            return prevSubUsers.map((user) => {
                if (user._id === updatedShift.subUserId) {
                    return {
                        ...user,
                        shifts: user.shifts.map((s) =>
                            s._id === updatedShift._id ? updatedShift.id : s,
                        ),
                    };
                }
                return user;
            });
        });

        toast.success('Вы успешно обновили смену');
    }, []);

    const showEditCheckinCheckOutModalHandler = (type, visible, time) => {
        setCheckinCheckoutProps({ type, visible, time });
    };

    const clearCheckInCheckoutProps = () => {
        setCheckinCheckoutProps({
            type: '',
            visible: false,
            time: null,
        });
    };

    const renderDayShiftsModalContent = useCallback(() => {
        if (selectedDayShiftsModal.length > 0) {
            return (
                <div>
                    <p>
                        <span className="font-bold text-lg ml-4">Магазин:</span>{' '}
                        {selectedDayShiftsModal[0]?.selectedStore.storeName}
                    </p>
                    <ul className="list-none flex-col gap-6 flex">
                        {selectedDayShiftsModal.map((shift) => {
                            const startTime = new Date(shift.startTime);
                            let endTime = new Date(shift.endTime);

                            if (endTime <= startTime) {
                                endTime.setDate(endTime.getDate() + 1);
                            }
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
                                <div key={shift._id} className="rounded-lg shadow-lg p-4">
                                    <li key={shift._id} className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <p>
                                                <span className="font-bold text-lg">
                                                    Начало смены:
                                                </span>{' '}
                                                {formatOnlyTimeDate(shift.startTime)}
                                            </p>
                                            <p>
                                                <span className="font-bold text-lg">
                                                    Конец смены:
                                                </span>{' '}
                                                {formatOnlyTimeDate(shift.endTime)}
                                            </p>
                                            <p>
                                                <span className="font-bold text-lg">
                                                    Длительность:
                                                </span>{' '}
                                                {durationText}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            {scanTime && (
                                                <div className="flex gap-4 items-center justify-between">
                                                    <p>
                                                        <span className="font-bold text-lg">
                                                            Фактический приход:
                                                        </span>{' '}
                                                        {formatOnlyTimeDate(shift.scanTime)}
                                                    </p>
                                                    <Button
                                                        onClick={() => {
                                                            showEditCheckinCheckOutModalHandler(
                                                                'checkIn',
                                                                true,
                                                                scanTime,
                                                            );
                                                        }}
                                                        className="text-white bg-blue-400 rounded-lg border p-1"
                                                        label="Изменить"
                                                        icon="pi pi-user-edit"
                                                    />
                                                </div>
                                            )}
                                            {endScanTime && (
                                                <div className="flex gap-4 items-center justify-between mt-5">
                                                    <p>
                                                        <span className="font-bold text-lg">
                                                            Фактический уход:
                                                        </span>{' '}
                                                        {formatOnlyTimeDate(shift.endScanTime)}
                                                    </p>
                                                    <Button
                                                        onClick={() => {
                                                            showEditCheckinCheckOutModalHandler(
                                                                'checkOut',
                                                                true,
                                                                scanTime,
                                                            );
                                                        }}
                                                        className="text-white bg-blue-400 rounded-lg border p-1"
                                                        label="Изменить"
                                                        icon="pi pi-user-edit"
                                                    />
                                                </div>
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
                                    <EditShift
                                        shiftId={shift._id}
                                        onShiftDelete={handleShiftDelete}
                                        onShiftUpdate={handleShiftUpdate}
                                    />
                                    <CheckInCheckOutModal
                                        handleShiftUpdate={handleShiftUpdate}
                                        {...checkInCheckoutProps}
                                        shift={shift}
                                        clearCheckInCheckoutProps={clearCheckInCheckoutProps}
                                    />
                                </div>
                            );
                        })}
                    </ul>
                </div>
            );
        } else {
            return <p>Нет смен</p>;
        }
    }, [
        selectedDayShiftsModal,
        calculateLateMinutes,
        calculateWorkedTime,
        handleShiftDelete,
        handleShiftUpdate,
        checkInCheckoutProps,
    ]);

    return (
        <div>
            <div className="w-[95%] justify-center align-center m-10 mt-5 bg-white p-6 rounded-lg shadow-md subtle-border">
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
                            <button
                                onClick={() => setShowModalAddShift(true)}
                                className="bg-blue-500 flex items-center gap-2 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition"
                            >
                                <p>Добавить смену</p>
                                <FaPlus />
                            </button>
                            <AddShift
                                open={showModalAddShift}
                                setOpen={setShowModalAddShift}
                                stores={stores}
                                subUsers={subUsersState}
                            />
                        </div>
                        <Filters
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            selectedStore={selectedStore}
                            setSelectedStore={setSelectedStore}
                            selectedDepartment={selectedDepartment}
                            setSelectedDepartment={setSelectedDepartment}
                            stores={stores}
                            filteredDepartments={filteredDepartments}
                        />
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

                {/* <td
                                    colSpan={daysArray.length + 1}
                                    className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70"
                                >
                                    <Loader />
                                </td> */}

                <CalendarTable
                    currentSubusers={currentSubusers || []}
                    daysArray={daysArray}
                    year={year}
                    month={month}
                    isLoading={isLoading}
                    getShiftsForDay={getShiftsForDay}
                    getDayColor={getDayColor}
                    setSelectedDayShiftsModal={setSelectedDayShiftsModal}
                    getDepartmentName={getDepartmentName}
                />
                <ShiftModal
                    selectedDayShiftsModal={selectedDayShiftsModal}
                    setSelectedDayShiftsModal={setSelectedDayShiftsModal}
                    renderDayShiftsModalContent={renderDayShiftsModalContent}
                />
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            </div>
        </div>
    );
};
