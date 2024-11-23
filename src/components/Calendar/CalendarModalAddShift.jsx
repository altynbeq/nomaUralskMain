import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AutoComplete } from 'primereact/autocomplete';

const CalendarModalAddShift = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(props.open);
    const [selectedSubuser, setSelectedSubuser] = useState(null);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubuser || !start || !end) return;
        try {
            const response = await fetch(
                'https://nomalytica-back.onrender.com/api/shifts/create-shift',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subUserId: selectedSubuser._id, // Используем ID выбранного сотрудника
                        startTime: new Date(start).toISOString(), // Преобразуем в ISO формат
                        endTime: new Date(end).toISOString(),
                    }),
                },
            );

            const newShift = await response.json();
            props.setCurrentShifts([
                ...props.currentShifts,
                {
                    title: setSelectedSubuser.name,
                    start: new Date(start),
                    end: new Date(end),
                },
            ]);

            props.setOpen(false);
        } catch (error) {
            console.error('Error adding shift:', error);
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

    return (
        <>
            {isModalOpen && (
                <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[300]">
                        <div className="flex justify-between">
                            <h2
                                style={{ alignItems: 'center' }}
                                className="text-lg font-bold flex mr-5 pr-10 mb-4"
                            >
                                Добавить новую смену
                            </h2>
                            <button
                                onClick={() => props.setOpen(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes className="mb-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-8 flex gap-4">
                                <label className="block text-gray-700">Сотрудник:</label>
                                <AutoComplete
                                    value={selectedSubuser}
                                    suggestions={filteredUsers}
                                    completeMethod={searchUsers}
                                    onChange={(e) => setSelectedSubuser(e.value)}
                                    field="name"
                                    className="w-full"
                                    placeholder="Выберите сотрудника"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Начало смены:</label>
                                <input
                                    type="datetime-local"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Конец смены:</label>
                                <input
                                    type="datetime-local"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex bg-blue-500 text-white py-2 px-4 rounded ml-auto"
                            >
                                Добавить
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CalendarModalAddShift;
