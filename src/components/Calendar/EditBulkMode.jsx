import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
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

    useEffect(() => {
        const transformed = [];

        subUsers.forEach(({ employee, shifts, date }) => {
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

                transformed.push({
                    ...shift,
                    employeeName: employee.name,
                    startTime: shiftStart,
                    endTime: shiftEnd,
                    selectedStore: shift.selectedStore || null,
                    id: shift._id, // Устанавливаем id для корректного рендера
                });
            });
        });

        setShiftsData(transformed);
    }, [subUsers]);

    const handleSave = async (shiftId, index) => {
        setIsLoading(true);
        try {
            const shift = shiftsData[index];

            let newStart = DateTime.fromJSDate(shift.startTime).setZone('UTC+5').toUTC().toISO();
            let newEnd = DateTime.fromJSDate(shift.endTime).setZone('UTC+5').toUTC().toISO();

            const startDateTime = DateTime.fromISO(newStart, { zone: 'utc' });
            const endDateTime = DateTime.fromISO(newEnd, { zone: 'utc' });
            if (endDateTime <= startDateTime) {
                newEnd = endDateTime.plus({ days: 1 }).toISO();
            }

            const response = await axiosInstance.put(`/shifts/${shiftId}`, {
                subUserId: shift.subUserId,
                startTime: newStart,
                endTime: newEnd,
                selectedStore: shift.selectedStore._id,
            });

            if (response.status === 200) {
                toast.success('Вы успешно обновили смену');
                // Обновляем локальное состояние с новыми данными смены
                setShiftsData((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        startTime: DateTime.fromISO(response.data.startTime, { zone: 'utc' })
                            .setZone('UTC+5')
                            .toJSDate(),
                        endTime: DateTime.fromISO(response.data.endTime, { zone: 'utc' })
                            .setZone('UTC+5')
                            .toJSDate(),
                        selectedStore: response.data.selectedStore || null,
                    };
                    return updated;
                });
            }
        } catch (error) {
            console.error('Ошибка при обновлении смены:', error);
            toast.error('Не удалось обновить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (shiftId) => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/shifts/${shiftId}`);
            setShiftsData((prev) => prev.filter((shift) => shift.id !== shiftId));
            toast.success('Смена успешно удалена');
        } catch (error) {
            console.error('Ошибка при удалении смены:', error);
            toast.error('Не удалось удалить смену.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeChange = (index, field, value) => {
        setShiftsData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleStoreChange = (index, value) => {
        setShiftsData((prev) => {
            const updated = [...prev];
            updated[index].selectedStore = value;
            return updated;
        });
    };

    return (
        <Dialog
            header="Редактирование смен за выбранные даты"
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
                        shiftsData.map((shift, index) => (
                            <div
                                key={shift.id}
                                className="border p-4 rounded-lg bg-gray-50 relative"
                            >
                                <h3 className="font-bold mb-2">{shift.employeeName}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Смена ID: {shift.id} | Магазин:{' '}
                                    {shift.selectedStore?.storeName || 'Не выбран'}
                                </p>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Магазин</label>
                                    <Dropdown
                                        value={shift.selectedStore}
                                        onChange={(e) => handleStoreChange(index, e.value)}
                                        options={stores}
                                        optionLabel="storeName"
                                        placeholder="Выберите магазин"
                                        className="w-full border-2 text-black rounded-lg"
                                        showClear
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Начало смены</label>
                                    <Calendar
                                        value={shift.startTime}
                                        onChange={(e) =>
                                            handleTimeChange(index, 'startTime', e.value)
                                        }
                                        showTime
                                        timeOnly
                                        mask="99:99"
                                        showIcon
                                        locale="ru"
                                        hourFormat="24"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Выберите время начала"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Конец смены</label>
                                    <Calendar
                                        value={shift.endTime}
                                        onChange={(e) =>
                                            handleTimeChange(index, 'endTime', e.value)
                                        }
                                        showTime
                                        timeOnly
                                        mask="99:99"
                                        showIcon
                                        locale="ru"
                                        hourFormat="24"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Выберите время окончания"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleSave(shift.id, index)}
                                        className="flex-1 bg-blue-400 text-white rounded-md p-2"
                                        label="Изменить смену"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={() => handleDelete(shift.id)}
                                        className="flex-1 bg-red-400 text-white rounded-md p-2"
                                        label="Удалить смену"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Нет смен для выбранных дат.</p>
                    )}
                </div>
            </div>
        </Dialog>
    );
};
