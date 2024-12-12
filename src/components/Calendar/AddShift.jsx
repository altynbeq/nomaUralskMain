// AddShift.js

import React, { useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { addLocale } from 'primereact/api';
import avatar from '../../data/avatar.jpg';
import { axiosInstance } from '../../api/axiosInstance';
import { useCompanyStructureStore } from '../../store';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

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

export const AddShift = ({ setOpen, stores, subUsers, open, onShiftsAdded }) => {
    const [selectedSubusers, setSelectedSubusers] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const departments = useCompanyStructureStore((state) => state.departments);
    const [selectedStore, setSelectedStore] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingShifts, setPendingShifts] = useState([]); // тут храним сгенерированные смены перед отправкой

    // Размер чанка для отправки смен
    const CHUNK_SIZE = 50;

    const generateShifts = useCallback(() => {
        const shifts = [];
        if (!dateRange || !startTime || !endTime || !selectedSubusers.length || !selectedStore) {
            return shifts;
        }

        // Генерация всех дат в выбранном диапазоне
        const dates = [];
        let currentDate = new Date(dateRange[0]);
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange[1]);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const shiftStartTime = new Date(startTime);
        const shiftEndTime = new Date(endTime);

        // Если конец смены раньше или равен началу — значит следующий день
        let adjustedEnd = new Date(shiftEndTime);
        if (adjustedEnd <= shiftStartTime) {
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);
        }

        // Создание смен для каждой даты и каждого выбранного пользователя
        dates.forEach((date) => {
            const shiftStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                shiftStartTime.getHours(),
                shiftStartTime.getMinutes(),
                0,
            );

            const shiftEnd = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                adjustedEnd.getHours(),
                adjustedEnd.getMinutes(),
                0,
            );

            selectedSubusers.forEach((user) => {
                shifts.push({
                    subUserId: user._id,
                    startTime: shiftStart.toISOString(),
                    endTime: shiftEnd.toISOString(),
                    selectedStore: selectedStore._id,
                });
            });
        });

        return shifts;
    }, [dateRange, startTime, endTime, selectedSubusers, selectedStore]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubusers.length || !dateRange || !startTime || !endTime || !selectedStore) {
            toast.error('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const shifts = generateShifts();
        if (shifts.length === 0) {
            toast.error('Не удалось сгенерировать смены.');
            return;
        }

        setIsLoading(true);
        try {
            // Сначала проверяем конфликты
            const checkResponse = await axiosInstance.post('/shifts/check-conflicts', { shifts });
            if (checkResponse.status === 200) {
                const { conflict } = checkResponse.data;
                if (conflict) {
                    // Если есть конфликт — показать модальное окно подтверждения
                    setPendingShifts(shifts);
                    setShowConfirmModal(true);
                } else {
                    // Нет конфликта — сразу отправляем
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

    /**
     * Функция для разбиения массива на чанки
     * @param {Array} array - исходный массив
     * @param {number} size - размер чанка
     * @returns {Array[]} - массив чанков
     */
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    /**
     * Функция для отправки смен чанками
     * @param {Array} shifts - массив смен
     */
    const sendShiftsInChunks = async (shifts) => {
        const chunks = chunkArray(shifts, CHUNK_SIZE);
        let currentChunk = 0;
        setIsLoading(true);
        try {
            for (const chunk of chunks) {
                currentChunk += 1;
                const response = await axiosInstance.post(
                    '/shifts/create-shifts',
                    { shifts: chunk },
                    {
                        timeout: 90000, // 90 секунд
                    },
                );

                if (response.status === 201 || response.status === 200) {
                    // onShiftsAdded(response.data);
                } else {
                    throw new Error(`Неизвестный статус ответа: ${response.status}`);
                }
            }

            // После успешной отправки всех чанков
            setOpen(false);
            toast.success('Все смены успешно добавлены');
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
        // Пользователь подтвердил перезапись смен
        setShowConfirmModal(false);
        await sendShiftsInChunks(pendingShifts);
    };

    const cancelChanges = () => {
        // Отмена — просто закрываем модалку, ничего не отправляем
        setShowConfirmModal(false);
        toast.info('Вы отменили добавление смен');
    };

    const searchUsers = (event) => {
        if (!event.query.trim().length) {
            setFilteredUsers([]);
        } else {
            if (subUsers) {
                const filtered = subUsers.filter((user) =>
                    user.name.toLowerCase().includes(event.query.toLowerCase()),
                );
                setFilteredUsers(filtered);
            }
        }
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex items-center">
                <img
                    src={item.image ? `https://nomalytica-back.onrender.com${item.image}` : avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                    <div>{item.name}</div>
                    <div className="text-gray-500 text-sm">{item.departmentId.name}</div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Dialog
                header="Добавить новые смены"
                visible={open}
                onHide={() => setOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-2xl w-full overflow-y-auto"
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Сотрудники:</label>
                        <AutoComplete
                            value={selectedSubusers}
                            suggestions={filteredUsers}
                            completeMethod={searchUsers}
                            onChange={(e) => setSelectedSubusers(e.value)}
                            field="name"
                            itemTemplate={itemTemplate}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            inputClassName="focus:outline-none focus:ring-0"
                            placeholder="Выберите сотрудников"
                            panelStyle={{ width: '295px' }}
                            multiple
                            dropdown
                        />
                    </div>
                    {/* Горизонтальный список выбранных сотрудников */}
                    {selectedSubusers.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">
                                Выбранные сотрудники:
                            </label>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-4 max-h-40 overflow-y-auto">
                                {selectedSubusers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center bg-gray-100 p-2 rounded-lg"
                                    >
                                        <img
                                            src={
                                                user.image
                                                    ? `https://nomalytica-back.onrender.com${user.image}`
                                                    : avatar
                                            }
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <span className="text-gray-800 mr-2">{user.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedSubusers((prev) =>
                                                    prev.filter((u) => u._id !== user._id),
                                                )
                                            }
                                            className="text-black hover:text-red-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mb-6">
                        <Dropdown
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.value)}
                            options={stores}
                            optionLabel="storeName"
                            placeholder="Выберите магазин"
                            className="w-full border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                            showClear
                        />
                    </div>
                    {/* Выбор периода смены */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Период смены:</label>
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            showIcon
                            locale="ru"
                            placeholder="Выберите период"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    {/* Выбор времени начала смены */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Время начала смены:</label>
                        <Calendar
                            value={startTime}
                            onChange={(e) => setStartTime(e.value)}
                            timeOnly
                            hourFormat="24"
                            showIcon
                            locale="ru"
                            placeholder="Выберите время начала"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    {/* Выбор времени окончания смены */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Время окончания смены:</label>
                        <Calendar
                            value={endTime}
                            onChange={(e) => setEndTime(e.value)}
                            timeOnly
                            hourFormat="24"
                            showIcon
                            locale="ru"
                            placeholder="Выберите время окончания"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        } transition duration-200`}
                    >
                        {isLoading ? 'Проверка...' : 'Добавить'}
                    </button>
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
                            className="flex-1 cursor-pointer bg-black text-white px2 px-4 rounded"
                            label="Отмена"
                            onClick={cancelChanges}
                            disabled={isLoading}
                        />
                        <Button
                            label="Подтвердить"
                            className={`flex-1 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded ${
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
