import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { addLocale } from 'primereact/api';
import avatar from '../../data/avatar.jpg';
import { axiosInstance } from '../../api/axiosInstance';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
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

export const AddBulkMode = ({ setOpen, stores, subUsers, open }) => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingShifts, setPendingShifts] = useState([]);

    useEffect(() => {
        if (subUsers && subUsers.length > 0) {
            const initialEntries = subUsers.map(({ employee, date }) => ({
                employee,
                date, // Убедитесь, что date передается как строка ISO или объект Date
                selectedStore: employee.departmentId.storeId, // Предполагаем, что storeId содержит информацию о магазине
                startTime: null,
                endTime: null,
            }));
            setEntries(initialEntries);
        } else {
            setEntries([]);
        }
    }, [subUsers]);

    const handleChangeEntry = (index, field, value) => {
        setEntries((prevEntries) => {
            const updatedEntries = [...prevEntries];
            updatedEntries[index] = { ...updatedEntries[index], [field]: value };
            return updatedEntries;
        });
    };

    const handleRemoveEntry = (index) => {
        setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
    };

    const generateShifts = useCallback(() => {
        const shifts = [];
        entries.forEach(({ employee, date, selectedStore, startTime, endTime }) => {
            if (!employee || !date || !selectedStore || !startTime || !endTime) {
                // Пропускаем неполные записи
                return;
            }

            // Создаём DateTime объекты для начала и конца смены, прикрепляя дату
            const shiftStart = DateTime.fromJSDate(date)
                .set({
                    hour: startTime.getHours(),
                    minute: startTime.getMinutes(),
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5', { keepLocalTime: true });

            let shiftEnd = DateTime.fromJSDate(date)
                .set({
                    hour: endTime.getHours(),
                    minute: endTime.getMinutes(),
                    second: 0,
                    millisecond: 0,
                })
                .setZone('UTC+5', { keepLocalTime: true });

            // Если время окончания раньше или равно времени начала, добавляем день
            if (shiftEnd <= shiftStart) {
                shiftEnd = shiftEnd.plus({ days: 1 });
            }

            // Конвертируем в UTC
            const shiftStartUtc = shiftStart.toUTC();
            const shiftEndUtc = shiftEnd.toUTC();

            shifts.push({
                subUserId: employee._id,
                startTime: shiftStartUtc.toISO(),
                endTime: shiftEndUtc.toISO(),
                selectedStore: selectedStore._id,
            });
        });
        return shifts;
    }, [entries]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверяем, заполнены ли все необходимые поля
        for (const entry of entries) {
            if (!entry.selectedStore || !entry.startTime || !entry.endTime) {
                toast.error('Пожалуйста, заполните все обязательные поля.');
                return;
            }
        }

        const shifts = generateShifts();
        if (shifts.length === 0) {
            toast.error('Не удалось сгенерировать смены.');
            return;
        }

        setIsLoading(true);
        try {
            // Проверяем конфликты
            const checkResponse = await axiosInstance.post('/shifts/check-conflicts', { shifts });
            if (checkResponse.status === 200) {
                const { conflict } = checkResponse.data;
                if (conflict) {
                    // Если есть конфликт, показываем модальное окно подтверждения
                    setPendingShifts(shifts);
                    setShowConfirmModal(true);
                } else {
                    // Нет конфликтов, отправляем смены
                    await sendShiftsInChunks(shifts);
                }
            }
        } catch (error) {
            console.error('Error checking conflicts:', error);
            toast.error(error.response?.data?.message || 'Ошибка при проверке конфликтов смен.');
        } finally {
            setIsLoading(false);
        }
    };

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const sendShiftsInChunks = async (shifts) => {
        const CHUNK_SIZE = 50;
        const chunks = chunkArray(shifts, CHUNK_SIZE);
        let currentChunk = 0;
        setIsLoading(true);
        try {
            for (const chunk of chunks) {
                currentChunk += 1;
                const response = await axiosInstance.post(
                    '/shifts',
                    { shifts: chunk },
                    { timeout: 90000 }, // 90 секунд
                );

                if (response.status === 201 || response.status === 200) {
                    // Продолжаем до конца
                } else {
                    throw new Error(`Ошибка при добавлении смен в чанке ${currentChunk}`);
                }
            }
            toast.success('Все смены успешно добавлены');
            setOpen(false);
        } catch (error) {
            console.error('Error adding/updating shifts:', error);
            toast.error(
                error.response?.data?.message ||
                    `Произошла ошибка при добавлении смен на чанке ${currentChunk}.`,
            );
        } finally {
            setIsLoading(false);
        }
    };

    const confirmChanges = async () => {
        setShowConfirmModal(false);
        await sendShiftsInChunks(pendingShifts);
    };

    const cancelChanges = () => {
        setShowConfirmModal(false);
        toast.info('Вы отменили добавление смен');
    };

    return (
        <>
            <Dialog
                header="Добавление смен"
                visible={open}
                onHide={() => setOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg min-w-[400px] max-w-4xl w-full overflow-y-auto"
            >
                <form onSubmit={handleSubmit}>
                    {entries.length > 0 ? (
                        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
                            {entries.map((entry, index) => (
                                <div
                                    key={index}
                                    className="border p-4 rounded-lg relative bg-gray-50 flex flex-col gap-4"
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveEntry(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                entry.employee.image
                                                    ? `https://nomalytica-back.onrender.com${entry.employee.image}`
                                                    : avatar
                                            }
                                            alt={entry.employee.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">
                                                {entry.employee.name}
                                            </span>
                                            <span className="text-gray-600">
                                                Дата:{' '}
                                                {DateTime.fromJSDate(entry.date).toFormat(
                                                    'dd.MM.yyyy',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Магазин:</label>
                                        <Dropdown
                                            value={entry.selectedStore}
                                            onChange={(e) =>
                                                handleChangeEntry(index, 'selectedStore', e.value)
                                            }
                                            options={stores}
                                            optionLabel="storeName"
                                            placeholder="Выберите магазин"
                                            className="w-full border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                                            showClear
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Время начала смены:
                                        </label>
                                        <Calendar
                                            value={entry.startTime}
                                            onChange={(e) =>
                                                handleChangeEntry(index, 'startTime', e.value)
                                            }
                                            timeOnly
                                            hourFormat="24"
                                            showIcon
                                            mask="99:99"
                                            locale="ru"
                                            placeholder="Выберите время начала"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Время окончания смены:
                                        </label>
                                        <Calendar
                                            value={entry.endTime}
                                            onChange={(e) =>
                                                handleChangeEntry(index, 'endTime', e.value)
                                            }
                                            timeOnly
                                            hourFormat="24"
                                            showIcon
                                            mask="99:99"
                                            locale="ru"
                                            placeholder="Выберите время окончания"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Нет выбранных сотрудников или дат.</p>
                    )}

                    {entries.length > 0 && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-blue-500 text-white py-2 px-4 rounded mt-6 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                            } transition duration-200`}
                        >
                            {isLoading ? 'Проверка...' : 'Добавить'}
                        </button>
                    )}
                </form>
            </Dialog>

            {/* Модальное окно подтверждения при перезаписи смен */}
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
                <p className="font-bold text-center">Подтвердить перезапись?</p>
            </Dialog>
        </>
    );
};
