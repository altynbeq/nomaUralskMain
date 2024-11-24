import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { formatDate } from '../../methods/dataFormatter';

export const ScheduleWithEdit = ({ open, setOpen, shiftId, fetchShifts }) => {
    const [shift, setShift] = useState(null);
    const [editing, setEditing] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if (open && shiftId) {
            fetchShiftDetails();
        }
    }, [open, shiftId]);

    const fetchShiftDetails = async () => {
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/shift/${shiftId}`,
            );
            if (!response.ok) {
                throw new Error('Failed to fetch shift details');
            }
            const data = await response.json();
            setShift(data);
            setStartTime(formatDateForInput(new Date(data.startTime)));
            setEndTime(formatDateForInput(new Date(data.endTime)));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/update-shift/${shiftId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subUserId: shift.subUserId._id,
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                    }),
                },
            );
            if (!response.ok) {
                throw new Error('Failed to update shift');
            }
            await fetchShifts();
            setEditing(false);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/delete-shift/${shiftId}`,
                {
                    method: 'DELETE',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to delete shift');
            }
            await fetchShifts();
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!shift) {
        return null;
    }

    return (
        <>
            {open && (
                <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[300]">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-bold flex mr-5 pr-10 mb-4">Детали смены</h2>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setEditing(false);
                                }}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes className="mb-4" />
                            </button>
                        </div>
                        {editing ? (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Начало смены:</label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="border rounded w-full py-2 px-3"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Конец смены:</label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="border rounded w-full py-2 px-3"
                                        required
                                    />
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="flex bg-green-500 text-white py-2 px-4 rounded ml-auto"
                                >
                                    Сохранить
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p>
                                        <strong>Сотрудник:</strong> {shift.subUserId.name}
                                    </p>
                                    <p>
                                        <strong>Начало смены:</strong> {formatDate(shift.startTime)}
                                    </p>
                                    <p>
                                        <strong>Конец смены:</strong> {formatDate(shift.endTime)}
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleEdit}
                                        className="flex bg-blue-500 text-white py-2 px-4 rounded"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex bg-red-500 text-white py-2 px-4 rounded"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
