import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-toastify';
import { Loader } from '../../components/Loader';
import { axiosInstance } from '../../api/axiosInstance';
import { addLocale } from 'primereact/api';
import { DateTime } from 'luxon';

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

export const EditBulkMode = ({ setOpen, stores, subUsers, open }) => {
    const [shiftsData, setShiftsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Определяем дефолтный магазин (например, первый в списке)
    const defaultStore = stores.length > 0 ? stores[0] : null;

    useEffect(() => {
        const transformed = [];

        subUsers.forEach(({ employee, shifts }) => {
            if (!employee || !shifts) return;

            shifts.forEach((shift) => {
                if (!shift) return; // Пропускаем null

                // Преобразуем время начала и конца смены
                const shiftStart = DateTime.fromISO(shift.startTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .toJSDate();

                let shiftEnd = DateTime.fromISO(shift.endTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .toJSDate();

                if (shiftEnd <= shiftStart) {
                    shiftEnd = DateTime.fromJSDate(shiftEnd).plus({ days: 1 }).toJSDate();
                }

                // Извлекаем дату из startTime
                const dateOnly = DateTime.fromISO(shift.startTime, { zone: 'utc' })
                    .setZone('UTC+5')
                    .startOf('day')
                    .toJSDate();

                // Найдите соответствующий магазин из массива stores
                const store =
                    stores.find((storeItem) => storeItem._id === shift.selectedStore?._id) || null;

                transformed.push({
                    ...shift,
                    employeeName: employee.name,
                    date: dateOnly, // Добавляем отдельное поле даты
                    startTime: shiftStart,
                    endTime: shiftEnd,
                    selectedStore: store || defaultStore, // Устанавливаем полный объект магазина или дефолтный
                    id: shift._id, // Устанавливаем id для корректного рендера
                    isEdited: false, // Флаг для отслеживания изменений
                });
            });
        });

        console.log('Transformed Shifts:', transformed); // Для отладки
        setShiftsData(transformed);
    }, [subUsers, stores, defaultStore]);

    // Обработчик изменения поля
    const handleFieldChange = (index, field, value) => {
        console.log(`Changing field ${field} for shift ${index} to`, value); // Для отладки

        setShiftsData((prev) => {
            const updated = [...prev];
            const shift = { ...updated[index], isEdited: true };

            if (field === 'startTime' || field === 'endTime') {
                // Получаем существующую дату смены
                const existingDate = DateTime.fromJSDate(shift.date).setZone('UTC+5');

                // Создаём объект DateTime для нового времени
                const newTime = DateTime.fromJSDate(value).setZone('UTC+5');

                // Объединяем существующую дату с новым временем
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
                // value уже содержит полный объект магазина или null
                shift.selectedStore = value || defaultStore; // Устанавливаем дефолтный магазин, если value null
            } else {
                // Для остальных полей просто обновляем значение
                shift[field] = value;
            }

            updated[index] = shift;
            return updated;
        });
    };

    // Обработчик изменения даты
    const handleDateChange = (index, value) => {
        if (!value) {
            toast.error('Дата не может быть пустой.');
            return;
        }

        setShiftsData((prev) => {
            const updated = [...prev];
            const shift = { ...updated[index], date: value, isEdited: true };

            // Проверяем, что shift.startTime и shift.endTime являются валидными Date объектами
            if (!(shift.startTime instanceof Date) || isNaN(shift.startTime)) {
                toast.error('Некорректное время начала смены.');
                return prev;
            }
            if (!(shift.endTime instanceof Date) || isNaN(shift.endTime)) {
                toast.error('Некорректное время окончания смены.');
                return prev;
            }

            // Объединяем новую дату с существующим временем начала
            const startTimeDT = DateTime.fromJSDate(shift.startTime).setZone('UTC+5');
            const newStartDateTime = DateTime.fromJSDate(value)
                .set({
                    hour: startTimeDT.hour,
                    minute: startTimeDT.minute,
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5');

            // Объединяем новую дату с существующим временем конца
            const endTimeDT = DateTime.fromJSDate(shift.endTime).setZone('UTC+5');
            let newEndDateTime = DateTime.fromJSDate(value)
                .set({
                    hour: endTimeDT.hour,
                    minute: endTimeDT.minute,
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5');

            // Если время окончания меньше или равно времени начала, добавляем день
            if (newEndDateTime <= newStartDateTime) {
                newEndDateTime = newEndDateTime.plus({ days: 1 });
            }

            shift.startTime = newStartDateTime.toUTC().toJSDate();
            shift.endTime = newEndDateTime.toUTC().toJSDate();

            updated[index] = shift;
            return updated;
        });
    };

    // Обработчик сохранения всех изменений
    const handleSaveAll = async () => {
        const editedShifts = shiftsData.filter((shift) => shift.isEdited);

        if (editedShifts.length === 0) {
            toast.info('Нет изменений для сохранения.');
            return;
        }

        // Проверка наличия магазина для всех изменённых смен
        const invalidShifts = editedShifts.filter((shift) => !shift.selectedStore);
        if (invalidShifts.length > 0) {
            toast.error('Все смены должны иметь выбранный магазин.');
            return;
        }

        setIsLoading(true);

        try {
            // Создаём массив промисов для обновления всех изменённых смен
            const updatePromises = editedShifts.map((shift) => {
                const newStart = DateTime.fromJSDate(shift.startTime)
                    .setZone('UTC+5')
                    .toUTC()
                    .toISO();

                const newEnd = DateTime.fromJSDate(shift.endTime).setZone('UTC+5').toUTC().toISO();

                return axiosInstance.put(`/shifts/${shift.id}`, {
                    subUserId: shift.subUserId,
                    startTime: newStart,
                    endTime: newEnd,
                    selectedStore: shift.selectedStore?._id || null, // Отправляем только _id магазина
                });
            });

            // Ждём завершения всех запросов
            const responses = await Promise.all(updatePromises);
            console.log('Server Responses:', responses); // Для отладки

            // Обновляем локальное состояние, отмечая смены как неотредактированные
            setShiftsData((prev) =>
                prev.map((shift) => {
                    const updatedShift = responses.find((res) => res.data.id === shift.id);
                    if (updatedShift) {
                        // Обновляем дату
                        const newDate = DateTime.fromISO(updatedShift.data.startTime, {
                            zone: 'utc',
                        })
                            .setZone('UTC+5')
                            .startOf('day')
                            .toJSDate();

                        // Обновляем startTime и endTime
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

                        // Находим соответствующий объект магазина
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
                            selectedStore: updatedStore || defaultStore, // Устанавливаем полный объект магазина или дефолтный
                            isEdited: false,
                        };
                    }
                    return shift;
                }),
            );

            toast.success('Все изменения успешно сохранены.');
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            toast.error('Не удалось сохранить некоторые изменения.');
        } finally {
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
            toast.success('Смена успешно удалена');
        } catch (error) {
            toast.error('Не удалось удалить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* ConfirmDialog Компонент */}
            <ConfirmDialog />

            <Dialog
                header="Редактирование смен"
                visible={open}
                onHide={() => setOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg min-w-[600px] max-w-4xl w-full overflow-y-auto"
            >
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <Loader />
                        </div>
                    )}
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
                                                    console.log(`Dropdown changed to:`, e.value); // Для отладки
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

                                        {/* Поле начала смены */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-1">
                                                Начало смены
                                            </label>
                                            <Calendar
                                                value={shift.startTime}
                                                onChange={(e) =>
                                                    handleFieldChange(index, 'startTime', e.value)
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

                                        {/* Поле конца смены */}
                                        <div className="mb-4">
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
                                        className="p-button-success bg-green-500 rounded-full p-2 text-white"
                                        label="Сохранить все изменения"
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
