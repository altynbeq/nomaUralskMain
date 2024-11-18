import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';

const ScheduleWithEdit = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(props.open);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [employees, setEmployees] = useState([
        { id: 1, name: 'John Smith', startTime: '09:00', endTime: '17:00' },
        { id: 2, name: 'Sarah Johnson', startTime: '14:00', endTime: '22:00' },
        { id: 3, name: 'Mike Brown', startTime: '23:00', endTime: '07:00' },
    ]);

    useEffect(() => {
        setIsModalOpen(props.open);
    }, [props.open]);

    const handleEdit = (employeeId) => {
        setEditingId(employeeId);
    };

    const formatTimeValue = (value, max) => {
        let numValue = parseInt(value) || 0;
        numValue = Math.min(Math.max(0, numValue), max);
        return numValue.toString().padStart(2, '0');
    };

    const handleSave = (employeeId, newStartTime, newEndTime) => {
        setEmployees(
            employees.map((emp) =>
                emp.id === employeeId
                    ? { ...emp, startTime: newStartTime, endTime: newEndTime }
                    : emp,
            ),
        );
        setEditingId(null);
    };

    const handleDelete = (employeeId) => {
        setDeletingId(employeeId);
    };

    const confirmDelete = () => {
        setEmployees(employees.filter((emp) => emp.id !== deletingId));
        setDeletingId(null);
    };

    const TimeInput = ({ value, onChange }) => {
        const [hours, minutes] = value.split(':');

        const handleHoursChange = (e) => {
            const newHours = formatTimeValue(e.target.value, 23);
            onChange(`${newHours}:${minutes}`);
        };

        const handleMinutesChange = (e) => {
            const newMinutes = formatTimeValue(e.target.value, 59);
            onChange(`${hours}:${newMinutes}`);
        };

        return (
            <div className="flex items-center gap-1">
                <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={handleHoursChange}
                    className="w-14 border rounded px-2 py-1 text-sm"
                    placeholder="HH"
                />
                <span>:</span>
                <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="w-14 border rounded px-2 py-1 text-sm"
                    placeholder="MM"
                />
            </div>
        );
    };

    const EmployeeEditForm = ({ employee, onSave, onCancel }) => {
        const [startTime, setStartTime] = useState(employee.startTime);
        const [endTime, setEndTime] = useState(employee.endTime);

        return (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg ">
                <div className="flex-1">
                    <h3 className="font-medium">{employee.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Start:</label>
                            <TimeInput value={startTime} onChange={setStartTime} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">End:</label>
                            <TimeInput value={endTime} onChange={setEndTime} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onSave(startTime, endTime)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const getEmployeeName = (id) => {
        const employee = employees.find((emp) => emp.id === id);
        return employee ? employee.name : '';
    };

    return (
        <div className="p-4">
            {isModalOpen && (
                <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold  mr-10">Schedule for 12 October</h2>
                            <button
                                onClick={() => props.setOpen(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            {employees.map((employee) =>
                                editingId === employee.id ? (
                                    <EmployeeEditForm
                                        key={employee.id}
                                        employee={employee}
                                        onSave={(newStartTime, newEndTime) =>
                                            handleSave(employee.id, newStartTime, newEndTime)
                                        }
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <div
                                        key={employee.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium mr-4">
                                                    {employee.name}
                                                </h3>
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <span className="text-sm mr-2">
                                                        {employee.startTime} - {employee.endTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(employee.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deletingId !== null && (
                <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-bold">Confirm Deletion</h2>
                        <p>
                            Are you sure you want to remove {getEmployeeName(deletingId)} from this
                            day&apos;s schedule? This action cannot be undone.
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="mr-2 p-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="p-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleWithEdit;
