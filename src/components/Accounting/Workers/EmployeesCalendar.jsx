import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { formatOnlyTimeDate } from '../../../methods/dataFormatter';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { AddShift } from '../../Calendar/AddShift';
import { EditShift } from '../../Calendar/EditShift';
import { toast } from 'react-toastify';
import { useCompanyStructureStore, useAuthStore } from '../../../store/index';
import { socket } from '../../../socket';
import { PaginationControls } from '../PaginationControls';
import { ShiftModal } from './ShiftModal';
import { CalendarTable } from './CalendarTable';
import { Filters } from './Filters';
import { Button } from 'primereact/button';
import { CheckInCheckOutModal } from './CheckInCheckOutModal';
import { axiosInstance } from '../../../api/axiosInstance';
import { DateTime } from 'luxon';
import { AddSingleShift } from '../../Calendar/AddSingleShift';

export const EmployeesCalendar = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    const departments = useCompanyStructureStore((state) => state.departments);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [subUsersState, setSubUsersState] = useState([]);
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
    const [selectedShiftForEdit, setSelectedShiftForEdit] = useState(null);
    const [editAction, setEditAction] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedDateForNewShift, setSelectedDateForNewShift] = useState(null);
    const [selectedEmployeeForNewShift, setSelectedEmployeeForNewShift] = useState(null);
    const [showAddShiftModal, setShowAddShiftModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const companyId = user?.companyId ? user.companyId : user?.id;
        if (!companyId) {
            return;
        }
        const fetchCompanySubUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/subusers/company/${companyId}`);
                setSubUsersState(response.data);
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
                const updatedUsers = [...prevSubUsers];

                newShifts.forEach((shift) => {
                    const userIndex = updatedUsers.findIndex(
                        (user) => user._id === shift.subUserId._id,
                    );

                    if (userIndex !== -1) {
                        const user = updatedUsers[userIndex];

                        if (!user.shifts) user.shifts = [];

                        const shiftExists = user.shifts.some(
                            (existingShift) => existingShift._id === shift._id,
                        );

                        if (!shiftExists) {
                            user.shifts.push(shift);
                        }
                    }
                });

                return updatedUsers;
            });
        });

        return () => {
            socket.off('new-shift');
        };
    }, []);

    const handleSocketShiftUpdate = useCallback((updatedShift) => {
        setSubUsersState((prevSubUsers) => {
            return prevSubUsers.map((user) => {
                if (!user.shifts) return user;

                const shiftIndex = user.shifts.findIndex((s) => s._id === updatedShift._id);
                if (shiftIndex !== -1) {
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
        socket.on('update-shift', (data) => {
            handleSocketShiftUpdate(data.shift);
        });

        return () => {
            socket.off('update-shift');
        };
    }, [handleSocketShiftUpdate]);

    useEffect(() => {
        if (selectedStore) {
            const filtered = departments.filter((dept) => dept.storeId === selectedStore._id);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
            setSelectedDepartment(null);
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

    const getDayColor = useCallback((shifts) => {
        if (shifts.length === 0) {
            // No shifts in the day
            return { type: 'gray' };
        }

        let hasFullWorkedShifts = true;
        let hasAnyIncompleteShifts = false;
        let hasAnyLateShifts = false;
        let hasShiftsWithoutCheckInOrOut = true;

        shifts.forEach((shift) => {
            const hasScanIn = !!shift.scanTime;
            const hasScanOut = !!shift.endScanTime;
            const isLate = shift.lateMinutes > 0;
            const workedMinutes =
                (shift.workedTime?.hours || 0) * 60 + (shift.workedTime?.minutes || 0);
            const shiftDurationMinutes =
                (shift.shiftDuration.hours || 0) * 60 + (shift.shiftDuration.minutes || 0);
            const isFullyWorked = workedMinutes >= shiftDurationMinutes;

            // If the shift has no scan in and scan out, mark it as shift without any attendance
            if (!hasScanIn && !hasScanOut) {
                hasShiftsWithoutCheckInOrOut = true;
            } else {
                hasShiftsWithoutCheckInOrOut = false;
            }

            // Check if any shift in the day is not fully worked
            if (!isFullyWorked) {
                hasAnyIncompleteShifts = true;
            }

            // Check if any shift has lateness
            if (isLate) {
                hasAnyLateShifts = true;
            }

            // If there's any shift that wasn't fully worked, then it's not a fully worked day
            if (!hasScanIn || !hasScanOut || !isFullyWorked) {
                hasFullWorkedShifts = false;
            }
        });

        if (hasShiftsWithoutCheckInOrOut) {
            return { type: 'blue' };
        }

        if (hasFullWorkedShifts) {
            return { type: 'green' };
        }

        if (hasAnyLateShifts && hasShiftsWithoutCheckInOrOut) {
            return { type: 'split-red-blue' };
        }

        if (!hasAnyLateShifts && hasAnyIncompleteShifts) {
            return { type: 'split-green-red' };
        }

        if (hasAnyLateShifts) {
            return { type: 'split-red-blue' };
        }

        return { type: 'gray' };
    }, []);

    const handleShiftDelete = useCallback((shiftId) => {
        setSelectedDayShiftsModal((prevShifts) =>
            prevShifts.filter((shift) => shift._id !== shiftId),
        );

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

    const handleOpenEditModal = useCallback((shift, action) => {
        const shiftWithDates = {
            ...shift,
            scanTime: shift.scanTime ? new Date(shift.scanTime) : null,
            endScanTime: shift.endScanTime ? new Date(shift.endScanTime) : null,
        };
        setSelectedShiftForEdit(shiftWithDates);
        setEditAction(action);
        setIsEditModalVisible(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setSelectedShiftForEdit(null);
        setEditAction('');
        setIsEditModalVisible(false);
    }, []);

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
                            const startTime = DateTime.fromISO(shift.startTime, { zone: 'utc' })
                                .setZone('UTC+5')
                                .toJSDate();
                            let endTime = DateTime.fromISO(shift.endTime, { zone: 'utc' })
                                .setZone('UTC+5')
                                .toJSDate();

                            if (endTime <= startTime) {
                                endTime = DateTime.fromJSDate(endTime).plus({ days: 1 }).toJSDate();
                            }
                            const scanTime = shift.scanTime
                                ? DateTime.fromISO(shift.scanTime, { zone: 'utc' })
                                      .setZone('UTC+5')
                                      .toJSDate()
                                : null;
                            const endScanTime = shift.endScanTime
                                ? DateTime.fromISO(shift.endScanTime, { zone: 'utc' })
                                      .setZone('UTC+5')
                                      .toJSDate()
                                : null;

                            const durationText =
                                shift.shiftDuration.hours > 0
                                    ? `${shift.shiftDuration.hours} ч ${shift.shiftDuration.minutes > 0 ? `${shift.shiftDuration.minutes} мин` : ''}`
                                    : `${shift.shiftDuration.minutes} мин`;

                            const lateMinutes = shift.lateMinutes || 0;
                            const lateText =
                                shift.lateMinutes > 0
                                    ? `Опоздал на ${shift.lateMinutes} мин`
                                    : 'Не опоздал';
                            const workedTimeText =
                                shift.workedTime?.hours > 0
                                    ? `${shift.workedTime?.hours} ч ${shift?.workedTime.minutes > 0 ? `${shift.workedTime.minutes} мин` : ''}`
                                    : `${shift.workedTime?.minutes} мин`;

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
                                            <div className="flex gap-4 items-center justify-between">
                                                <p>
                                                    <span className="font-bold text-lg">
                                                        Фактический приход:
                                                    </span>{' '}
                                                    {formatOnlyTimeDate(shift.scanTime)}
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        handleOpenEditModal(shift, 'checkIn');
                                                    }}
                                                    className="text-white bg-blue-400 rounded-lg border p-1"
                                                    label="Изменить"
                                                    icon="pi pi-user-edit"
                                                />
                                            </div>
                                            <div className="flex gap-4 items-center justify-between mt-5">
                                                <p>
                                                    <span className="font-bold text-lg">
                                                        Фактический уход:
                                                    </span>{' '}
                                                    {formatOnlyTimeDate(shift.endScanTime)}
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        handleOpenEditModal(shift, 'checkOut');
                                                    }}
                                                    className="text-white bg-blue-400 rounded-lg border p-1"
                                                    label="Изменить"
                                                    icon="pi pi-user-edit"
                                                />
                                            </div>
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
    }, [selectedDayShiftsModal, handleShiftDelete, handleOpenEditModal]);

    const onDayClick = useCallback(
        (employee, day, shifts) => {
            if (shifts.length === 0) {
                // День без смен, открываем модалку для добавления смены с автоматически выбранным сотрудником
                setSelectedEmployeeForNewShift(employee);
                setSelectedDateForNewShift({
                    day,
                    month: month + 1, // Luxon использует 1-12 для месяцев
                    year,
                });
                setShowAddShiftModal(true);
            } else {
                // День со сменами, открываем модалку с деталями смен
                setSelectedDayShiftsModal(shifts);
            }
        },
        [month, year],
    );

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
                <CalendarTable
                    currentSubusers={currentSubusers || []}
                    daysArray={daysArray}
                    year={year}
                    month={month}
                    isLoading={isLoading}
                    getShiftsForDay={getShiftsForDay}
                    getDayColor={getDayColor}
                    onDayClick={onDayClick}
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

                {selectedShiftForEdit && (
                    <CheckInCheckOutModal
                        visible={isEditModalVisible}
                        type={editAction}
                        time={
                            editAction === 'checkIn'
                                ? selectedShiftForEdit.scanTime
                                : selectedShiftForEdit.endScanTime
                        }
                        clearCheckInCheckoutProps={handleCloseEditModal}
                        shift={selectedShiftForEdit}
                    />
                )}

                {selectedDateForNewShift && selectedEmployeeForNewShift && (
                    <AddSingleShift
                        stores={stores || []}
                        selectedDateForNewShift={selectedDateForNewShift}
                        employee={selectedEmployeeForNewShift}
                        visible={showAddShiftModal}
                        onHide={setShowAddShiftModal}
                    />
                )}
            </div>
        </div>
    );
};
