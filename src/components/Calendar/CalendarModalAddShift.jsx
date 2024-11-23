import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AutoComplete } from 'primereact/autocomplete';

const CalendarModalAddShift = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(props.open);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !start || !end) return;

        const newShift = {
            title,
            start: new Date(start),
            end: new Date(end),
        };
        const newShifts = [...props.currentShifts, newShift];
        props.setCurrentShifts(newShifts);
        setTitle('');
        setStart('');
        setEnd('');
        props.setOpen(false);
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
                            <div className="mb-4">
                                <label className="block text-gray-700">Сотрудник:</label>
                                <AutoComplete
                                    value={title}
                                    suggestions={filteredUsers.map((user) => user.name)}
                                    completeMethod={searchUsers}
                                    onChange={(e) => setTitle(e.value)}
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
