import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../api/axiosInstance';
import { addLocale } from 'primereact/api';
import { DateTime } from 'luxon';
import { CheckInCheckOutModal } from '../Accounting/Workers/CheckInCheckOutModal';
import { formatOnlyTimeDate } from '../../methods/dataFormatter';

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
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
    ],
    monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
    today: 'Сегодня',
    clear: 'Очистить',
});

export const EditBulkMode = ({ setOpen, stores, subUsers, open, handleShiftDelete }) => {
    const [shiftsData, setShiftsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('checkIn');
    const [currentShift, setCurrentShift] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingShifts, setPendingShifts] = useState([]);

    const defaultStore = stores.length > 0 ? stores[0] : null;

    useEffect(() => {
        const transformed = [];

        subUsers.forEach(({ employee, shifts }) => {
            if (!employee || !shifts) return;

            shifts.forEach((shift) => {
                if (!shift) return;

                const shiftStart = DateTime.fromISO(shift.startTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .toJSDate();

                let shiftEnd = DateTime.fromISO(shift.endTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .toJSDate();

                if (shiftEnd <= shiftStart) {
                    shiftEnd = DateTime.fromJSDate(shiftEnd).plus({ days: 1 }).toJSDate();
                }

                const dateOnly = DateTime.fromISO(shift.startTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .startOf('day')
                    .toJSDate();

                const store =
                    stores.find((storeItem) => storeItem._id === shift.selectedStore?._id) || null;

                transformed.push({
                    ...shift,
                    employeeName: employee.name,
                    date: dateOnly,
                    startTime: shiftStart,
                    endTime: shiftEnd,
                    selectedStore: store || defaultStore,
                    id: shift._id,
                    isEdited: false,
                });
            });
        });

        setShiftsData(transformed);
    }, [subUsers, stores, defaultStore]);

    const handleFieldChange = (index, field, value) => {
        setShiftsData((prev) => {
            const updated = [...prev];
            const shift = { ...updated[index], isEdited: true };

            if (field === 'startTime' || field === 'endTime') {
                const existingDate = DateTime.fromJSDate(shift.date).setZone('UTC+5');

                const newTime = DateTime.fromJSDate(value).setZone('UTC+5');

                const newDateTime = existingDate.set({
                    hour: newTime.hour,
                    minute: newTime.minute,
                    second: 0,
                    millisecond: 0,
                });

                if (field === 'endTime') {
                    const startTimeDT = DateTime.fromJSDate(shift.startTime).setZone('UTC+5');
                    if (newDateTime <= startTimeDT) {
                        shift.endTime = newDateTime.plus({ days: 1 }).toUTC().toJSDate();
                    } else {
                        shift.endTime = newDateTime.toUTC().toJSDate();
                    }
                } else {
                    shift.startTime = newDateTime.toUTC().toJSDate();
                }
            } else if (field === 'selectedStore') {
                shift.selectedStore = value || defaultStore;
            } else {
                shift[field] = value;
            }

            updated[index] = shift;
            return updated;
        });
    };

    const handleDateChange = (index, value) => {
        if (!value) {
            toast.error('Дата не может быть пустой.');
            return;
        }

        setShiftsData((prev) => {
            const updated = [...prev];
            const shift = { ...updated[index], date: value, isEdited: true };

            if (!(shift.startTime instanceof Date) || isNaN(shift.startTime)) {
                toast.error('Некорректное время начала смены.');
                return prev;
            }
            if (!(shift.endTime instanceof Date) || isNaN(shift.endTime)) {
                toast.error('Некорректное время окончания смены.');
                return prev;
            }

            const startTimeDT = DateTime.fromJSDate(shift.startTime).setZone('UTC+5');
            const newStartDateTime = DateTime.fromJSDate(value)
                .set({
                    hour: startTimeDT.hour,
                    minute: startTimeDT.minute,
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5');

            const endTimeDT = DateTime.fromJSDate(shift.endTime).setZone('UTC+5');
            let newEndDateTime = DateTime.fromJSDate(value)
                .set({
                    hour: endTimeDT.hour,
                    minute: endTimeDT.minute,
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5');

            if (newEndDateTime <= newStartDateTime) {
                newEndDateTime = newEndDateTime.plus({ days: 1 });
            }

            shift.startTime = newStartDateTime.toUTC().toJSDate();
            shift.endTime = newEndDateTime.toUTC().toJSDate();

            updated[index] = shift;
            return updated;
        });
    };

    const checkConflicts = async (editedShifts) => {
        const shiftsForCheck = editedShifts.map((shift) => {
            const startTimeISO = DateTime.fromJSDate(shift.startTime)
                .setZone('UTC+5')
                .toUTC()
                .toISO();
            const endTimeISO = DateTime.fromJSDate(shift.endTime).setZone('UTC+5').toUTC().toISO();

            return {
                subUserId:
                    typeof shift.subUserId === 'string' ? shift.subUserId : shift.subUserId._id,
                startTime: startTimeISO,
                endTime: endTimeISO,
                selectedStore: shift.selectedStore?._id || null,
            };
        });

        const checkResponse = await axiosInstance.post('/shifts/check-conflicts', {
            shifts: shiftsForCheck,
        });

        return checkResponse.data.conflict ? shiftsForCheck : null;
    };

    const updateShifts = async (editedShifts) => {
        try {
            const updatePromises = editedShifts.map((shift) => {
                const newStart = DateTime.fromJSDate(shift.startTime)
                    .setZone('UTC+5')
                    .toUTC()
                    .toISO();

                const newEnd = DateTime.fromJSDate(shift.endTime).setZone('UTC+5').toUTC().toISO();

                return axiosInstance.put(`/shifts/${shift.id}`, {
                    subUserId:
                        typeof shift.subUserId === 'string' ? shift.subUserId : shift.subUserId._id,
                    startTime: newStart,
                    endTime: newEnd,
                    selectedStore: shift.selectedStore?._id || null,
                });
            });

            const responses = await Promise.all(updatePromises);

            setShiftsData((prev) =>
                prev.map((shift) => {
                    const updatedShift = responses.find((res) => res.data.id === shift.id);
                    if (updatedShift) {
                        const newDate = DateTime.fromISO(updatedShift.data.startTime, {
                            zone: 'utc',
                        })
                            .setZone('UTC+5')
                            .startOf('day')
                            .toJSDate();

                        const newStartTime = DateTime.fromISO(updatedShift.data.startTime, {
                            zone: 'utc',
                        })
                            .setZone('UTC+5')
                            .toJSDate();

                        const newEndTime = DateTime.fromISO(updatedShift.data.endTime, {
                            zone: 'utc',
                        })
                            .setZone('UTC+5')
                            .toJSDate();

                        const updatedStore = updatedShift.data.selectedStore
                            ? stores.find(
                                  (store) => store._id === updatedShift.data.selectedStore._id,
                              ) || null
                            : null;

                        return {
                            ...shift,
                            date: newDate,
                            startTime: newStartTime,
                            endTime: newEndTime,
                            selectedStore: updatedStore || defaultStore,
                            isEdited: false,
                        };
                    }
                    return shift;
                }),
            );

            setOpen(false);
            toast.success('Все изменения успешно сохранены.');
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            toast.error('Не удалось сохранить некоторые изменения.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAll = async () => {
        const editedShifts = shiftsData.filter((shift) => shift.isEdited);

        if (editedShifts.length === 0) {
            toast.info('Нет изменений для сохранения.');
            return;
        }

        const invalidShifts = editedShifts.filter((shift) => !shift.selectedStore);
        if (invalidShifts.length > 0) {
            toast.error('Все смены должны иметь выбранный магазин.');
            return;
        }

        setIsLoading(true);

        try {
            const conflictShifts = await checkConflicts(editedShifts);

            if (conflictShifts) {
                setPendingShifts(editedShifts);
                setShowConfirmModal(true);
                setIsLoading(false);
            } else {
                await updateShifts(editedShifts);
            }
        } catch (error) {
            console.error('Ошибка при проверке конфликтов:', error);
            toast.error(error.response?.data?.message || 'Ошибка при проверке конфликтов смен.');
            setIsLoading(false);
        }
    };

    const handleDelete = (shiftId) => {
        confirmDialog({
            className: 'custom-confirm-dialog',
            message: 'Вы уверены, что хотите удалить эту смену?',
            header: 'Подтверждение удаления',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Да',
            rejectLabel: 'Нет',
            accept: () => deleteShift(shiftId),
            reject: () => toast.info('Удаление отменено'),
        });
    };

    const deleteShift = async (shiftId) => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/shifts/${shiftId}`);
            setShiftsData((prev) => prev.filter((shift) => shift.id !== shiftId));
            handleShiftDelete(shiftId);
            toast.success('Смена успешно удалена');
        } catch (error) {
            toast.error('Не удалось удалить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (shift, type) => {
        setCurrentShift(shift);
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setCurrentShift(null);
        setModalVisible(false);
    };

    const handleCheckInCheckOutUpdate = (updatedShift) => {
        setShiftsData((prev) =>
            prev.map((shift) => {
                if (shift.id === updatedShift.id) {
                    // Повторяем логику преобразования дат, аналогичную той, что в useEffect

                    const shiftStart = DateTime.fromISO(updatedShift.startTime, { zone: 'utc' })
                        .setZone('UTC+5')
                        .toJSDate();
                    let shiftEnd = DateTime.fromISO(updatedShift.endTime, { zone: 'utc' })
                        .setZone('UTC+5')
                        .toJSDate();

                    if (shiftEnd <= shiftStart) {
                        shiftEnd = DateTime.fromJSDate(shiftEnd).plus({ days: 1 }).toJSDate();
                    }

                    const dateOnly = DateTime.fromISO(updatedShift.startTime, { zone: 'utc' })
                        .setZone('UTC+5')
                        .startOf('day')
                        .toJSDate();

                    const updatedStore = updatedShift.selectedStore
                        ? stores.find((store) => store._id === updatedShift.selectedStore._id) ||
                          defaultStore
                        : defaultStore;

                    return {
                        ...shift,
                        ...updatedShift,
                        date: dateOnly,
                        startTime: shiftStart,
                        endTime: shiftEnd,
                        selectedStore: updatedStore,
                        isEdited: true,
                    };
                }
                return shift;
            }),
        );
    };

    const confirmChanges = async () => {
        setShowConfirmModal(false);
        setIsLoading(true);
        await updateShifts(pendingShifts);
    };

    const cancelChanges = () => {
        setShowConfirmModal(false);
        toast.info('Вы отменили сохранение изменений.');
    };

    // Новые функции для автоматической отметки прихода и ухода
    const handleMarkArrivalAsShiftStart = useCallback(
        async (shift) => {
            try {
                const payload = {
                    subUserId:
                        typeof shift.subUserId === 'string' ? shift.subUserId : shift.subUserId._id,
                    startTime: shift.startTime.toISOString(), // Преобразуем Date в ISO строку
                    endTime: shift.endTime.toISOString(),
                    selectedStore: shift.selectedStore._id,
                    // Устанавливаем фактический приход равным началу смены
                    scanTime: shift.startTime.toISOString(),
                    endScanTime: shift.endScanTime ? shift.endScanTime.toISOString() : null,
                };

                const response = await axiosInstance.put(`/shifts/${shift.id}`, payload);
                const updatedShift = response.data;

                // Обновляем локальное состояние
                setShiftsData((prev) =>
                    prev.map((s) =>
                        s.id === updatedShift.id
                            ? {
                                  ...s,
                                  ...updatedShift,
                                  startTime: DateTime.fromISO(updatedShift.startTime, {
                                      zone: 'utc',
                                  })
                                      .setZone('UTC+5')
                                      .toJSDate(),
                                  endTime: DateTime.fromISO(updatedShift.endTime, { zone: 'utc' })
                                      .setZone('UTC+5')
                                      .toJSDate(),
                                  scanTime: updatedShift.scanTime
                                      ? DateTime.fromISO(updatedShift.scanTime, { zone: 'utc' })
                                            .setZone('UTC+5')
                                            .toJSDate()
                                      : null,
                                  endScanTime: updatedShift.endScanTime
                                      ? DateTime.fromISO(updatedShift.endScanTime, { zone: 'utc' })
                                            .setZone('UTC+5')
                                            .toJSDate()
                                      : null,
                                  isEdited: false,
                              }
                            : s,
                    ),
                );

                toast.success('Фактический приход установлен в начало смены');
            } catch (error) {
                console.error('Ошибка при обновлении смены:', error);
                toast.error('Не удалось изменить фактический приход');
            }
        },
        [], // Нет зависимостей, так как используем setShiftsData напрямую
    );

    const handleMarkDepartureAsShiftEnd = useCallback(
        async (shift) => {
            try {
                const payload = {
                    subUserId:
                        typeof shift.subUserId === 'string' ? shift.subUserId : shift.subUserId._id,
                    startTime: shift.startTime.toISOString(),
                    endTime: shift.endTime.toISOString(),
                    selectedStore: shift.selectedStore._id,
                    scanTime: shift.scanTime ? shift.scanTime.toISOString() : null,
                    // Устанавливаем фактический уход равным концу смены
                    endScanTime: shift.endTime.toISOString(),
                };

                const response = await axiosInstance.put(`/shifts/${shift.id}`, payload);
                const updatedShift = response.data;

                // Обновляем локальное состояние
                setShiftsData((prev) =>
                    prev.map((s) =>
                        s.id === updatedShift.id
                            ? {
                                  ...s,
                                  ...updatedShift,
                                  startTime: DateTime.fromISO(updatedShift.startTime, {
                                      zone: 'utc',
                                  })
                                      .setZone('UTC+5')
                                      .toJSDate(),
                                  endTime: DateTime.fromISO(updatedShift.endTime, { zone: 'utc' })
                                      .setZone('UTC+5')
                                      .toJSDate(),
                                  scanTime: updatedShift.scanTime
                                      ? DateTime.fromISO(updatedShift.scanTime, { zone: 'utc' })
                                            .setZone('UTC+5')
                                            .toJSDate()
                                      : null,
                                  endScanTime: updatedShift.endScanTime
                                      ? DateTime.fromISO(updatedShift.endScanTime, { zone: 'utc' })
                                            .setZone('UTC+5')
                                            .toJSDate()
                                      : null,
                                  isEdited: false,
                              }
                            : s,
                    ),
                );

                toast.success('Фактический уход установлен в конец смены');
            } catch (error) {
                console.error('Ошибка при обновлении смены:', error);
                toast.error('Не удалось изменить фактический уход');
            }
        },
        [], // Нет зависимостей, так как используем setShiftsData напрямую
    );

    return (
        <>
            {/* ConfirmDialog Компонент */}
            <ConfirmDialog />

            {/* Модальное окно для изменения прихода/ухода */}
            {currentShift && (
                <CheckInCheckOutModal
                    visible={modalVisible}
                    type={modalType}
                    time={
                        modalType === 'checkIn' ? currentShift.scanTime : currentShift.endScanTime
                    }
                    clearCheckInCheckoutProps={closeModal}
                    shift={currentShift}
                    onUpdate={handleCheckInCheckOutUpdate}
                />
            )}

            {/* Модальное окно для подтверждения перезаписи конфликтных смен */}
            <Dialog
                visible={showConfirmModal}
                onHide={cancelChanges}
                header="Обнаружены пересекающиеся смены"
                footer={
                    <div className="flex gap-2 justify-center">
                        <Button
                            className="flex-1 bg-black text-white px-4 py-2 rounded"
                            label="Отмена"
                            onClick={cancelChanges}
                            disabled={isLoading}
                        />
                        <Button
                            label="Подтвердить"
                            className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                            } transition duration-200`}
                            onClick={confirmChanges}
                            disabled={isLoading}
                        />
                    </div>
                }
            >
                <p className="font-bold text-center">Подтвердить перезапись изменяемых смен?</p>
            </Dialog>

            <Dialog
                header="Редактирование смен"
                visible={open}
                onHide={() => setOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg min-w-[600px] max-w-4xl w-full overflow-y-auto"
            >
                <div className="relative">
                    <div className={`flex flex-col gap-4 ${isLoading ? 'opacity-50' : ''}`}>
                        {shiftsData.length > 0 ? (
                            <>
                                {shiftsData.map((shift, index) => (
                                    <div
                                        key={shift.id}
                                        className="border p-4 rounded-lg bg-gray-50"
                                    >
                                        <h3 className="font-bold mb-6">{shift.employeeName}</h3>

                                        {/* Поле даты */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">
                                                Дата смены
                                            </label>
                                            <Calendar
                                                value={shift.date}
                                                onChange={(e) => handleDateChange(index, e.value)}
                                                dateFormat="dd.mm.yy"
                                                mask="99.99.9999"
                                                showIcon
                                                locale="ru"
                                                placeholder="Выберите дату смены"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />
                                        </div>

                                        {/* Поле магазина */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">
                                                Магазин
                                            </label>
                                            <Dropdown
                                                value={shift.selectedStore}
                                                onChange={(e) => {
                                                    handleFieldChange(
                                                        index,
                                                        'selectedStore',
                                                        e.value,
                                                    );
                                                }}
                                                options={stores}
                                                optionLabel="storeName"
                                                placeholder="Выберите магазин"
                                                className="w-full border-2 text-black rounded-lg"
                                                showClear
                                            />
                                        </div>

                                        {/* Поле начала смены и кнопка изменения прихода */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="w-1/2 mr-2">
                                                <label className="block text-gray-700 mb-1">
                                                    Начало смены
                                                </label>
                                                <Calendar
                                                    value={shift.startTime}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'startTime',
                                                            e.value,
                                                        )
                                                    }
                                                    showTime
                                                    timeOnly
                                                    hourFormat="24"
                                                    showIcon
                                                    mask="99:99"
                                                    locale="ru"
                                                    placeholder="Выберите время начала"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center mt-8">
                                                <p>
                                                    <span className="text-gray-700">
                                                        Фактический приход:
                                                    </span>{' '}
                                                    {formatOnlyTimeDate(shift.scanTime)}
                                                </p>
                                                <Button
                                                    onClick={() => openModal(shift, 'checkIn')}
                                                    className=" text-white bg-blue-400 rounded-lg border h-9 w-9"
                                                    icon="pi pi-user-edit"
                                                />
                                                <Button
                                                    icon="pi pi-check"
                                                    className="bg-green-500 text-white rounded-full h-9 w-9"
                                                    onClick={() =>
                                                        handleMarkArrivalAsShiftStart(shift)
                                                    }
                                                    tooltip="Установить фактический приход равным времени начала смены"
                                                />
                                            </div>
                                        </div>

                                        {/* Поле конца смены и кнопка изменения ухода */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="w-1/2 mr-2">
                                                <label className="block text-gray-700 mb-1">
                                                    Конец смены
                                                </label>
                                                <Calendar
                                                    value={shift.endTime}
                                                    onChange={(e) =>
                                                        handleFieldChange(index, 'endTime', e.value)
                                                    }
                                                    showTime
                                                    timeOnly
                                                    hourFormat="24"
                                                    showIcon
                                                    mask="99:99"
                                                    locale="ru"
                                                    placeholder="Выберите время окончания"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center mt-8">
                                                <p>
                                                    <span className="text-gray-700">
                                                        Фактический уход:
                                                    </span>{' '}
                                                    {formatOnlyTimeDate(shift.endScanTime)}
                                                </p>
                                                <Button
                                                    onClick={() => openModal(shift, 'checkOut')}
                                                    className=" text-white bg-blue-400 rounded-lg border w-9 h-9"
                                                    icon="pi pi-user-edit"
                                                />
                                                <Button
                                                    icon="pi pi-check"
                                                    className="bg-green-500 text-white rounded-full h-9 w-9"
                                                    onClick={() =>
                                                        handleMarkDepartureAsShiftEnd(shift)
                                                    }
                                                    tooltip="Установить фактический уход равным времени конца смены"
                                                />
                                            </div>
                                        </div>

                                        {/* Кнопка удаления на низу карточки */}
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                label="Удалить смену"
                                                icon="pi pi-trash"
                                                className="p-button-danger bg-red-400 rounded-full p-2 text-white"
                                                onClick={() => handleDelete(shift.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {/* Кнопка сохранения всех изменений */}
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={handleSaveAll}
                                        className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded ${
                                            isLoading
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-blue-600'
                                        } transition duration-200`}
                                        label={
                                            isLoading ? 'Сохранение...' : 'Сохранить все изменения'
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">Нет смен для выбранных дат.</p>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
};
