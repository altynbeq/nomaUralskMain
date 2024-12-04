import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addLocale } from 'primereact/api';
import avatar from '../../data/avatar.jpg';

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

export const AddShift = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(props.open);
    const [selectedSubusers, setSelectedSubusers] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubusers.length || !start || !end) {
            toast.error('Пожалуйста, выберите хотя бы одного сотрудника и укажите время смены.');
            return;
        }
        setIsLoading(true);
        try {
            // Создание массива запросов для всех выбранных сотрудников
            const shiftPromises = selectedSubusers.map((user) =>
                fetch('https://nomalytica-back.onrender.com/api/shifts/create-shift', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subUserId: user._id,
                        startTime: start.toISOString(),
                        endTime: end.toISOString(),
                        selectedStore: props.selectedStore._id,
                    }),
                }),
            );

            // Ожидание выполнения всех запросов
            const responses = await Promise.all(shiftPromises);

            // Проверка на успешность всех запросов
            const allSuccessful = responses.every((response) => response.ok);
            if (!allSuccessful) {
                throw new Error('Некоторые смены не были добавлены.');
            }

            toast.success('Смены успешно добавлены');
            await props.fetchShifts();
            props.setOpen(false);
        } catch (error) {
            console.error('Error adding shifts:', error);
            toast.error('Произошла ошибка при добавлении смен.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsModalOpen(props.open);
    }, [props.open]);

    const searchUsers = (event) => {
        if (!event.query.trim().length) {
            setFilteredUsers([]);
        } else {
            const filtered = props.subusers.filter((user) =>
                user.name.toLowerCase().includes(event.query.toLowerCase()),
            );
            setFilteredUsers(filtered);
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
                    <div className="text-gray-500 text-sm">{item.departmentId?.name}</div>
                </div>
            </div>
        );
    };

    // Функция для удаления выбранного сотрудника
    const removeSelectedUser = (userToRemove) => {
        setSelectedSubusers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userToRemove._id),
        );
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Добавить новые смены</h2>
                            <button
                                onClick={() => props.setOpen(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes />
                            </button>
                        </div>
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
                                    className="w-full rounded-lg border-2 px-3 py-2"
                                    placeholder="Выберите сотрудников"
                                    multiple // Для множественного выбора
                                    dropdown // Для отображения выпадающего списка при клике на иконку
                                />
                            </div>

                            {/* Горизонтальный список выбранных сотрудников */}
                            {selectedSubusers.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2">
                                        Выбранные сотрудники:
                                    </label>
                                    <div className="flex flex-row flex-wrap gap-4">
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
                                                <span className="text-gray-800 mr-2">
                                                    {user.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedUser(user)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Начало смены:</label>
                                <Calendar
                                    value={start}
                                    onChange={(e) => setStart(e.value)}
                                    showTime
                                    locale="ru"
                                    hourFormat="24"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Выберите дату и время начала"
                                    showIcon
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Конец смены:</label>
                                <Calendar
                                    value={end}
                                    onChange={(e) => setEnd(e.value)}
                                    showTime
                                    locale="ru"
                                    hourFormat="24"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Выберите дату и время окончания"
                                    showIcon
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
                                    isLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-600'
                                } transition duration-200`}
                            >
                                {isLoading ? 'Добавление...' : 'Добавить'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
