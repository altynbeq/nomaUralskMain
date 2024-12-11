// components/EmployeeCalendar/CalendarTable.jsx
import React, { memo } from 'react';

export const CalendarTable = memo(
    ({
        currentSubusers,
        daysArray,
        year,
        month,
        getShiftsForDay,
        getDayColor,
        setSelectedDayShiftsModal,
        getDepartmentName,
    }) => {
        return (
            <div className="overflow-x-auto w-full max-w-full">
                <table className="table-auto w-full max-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 text-left">Сотрудник</th>
                            {daysArray.map((day) => (
                                <th key={day} className="px-2 py-1 text-center text-sm">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-2 py-1 text-left"></th>
                            {daysArray.map((day) => {
                                const date = new Date(year, month, day);
                                const weekDay = new Intl.DateTimeFormat('ru-RU', {
                                    weekday: 'short',
                                }).format(date);
                                return (
                                    <th
                                        key={day}
                                        className="py-1 text-center text-xs text-gray-500"
                                    >
                                        {weekDay}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubusers.map((employee) => (
                            <tr key={employee._id}>
                                <td className="px-4 py-2 inline-flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="flex flex-col">
                                        <p className="text-sm">{employee.name}</p>
                                        <p className="text-sm">
                                            ({getDepartmentName(employee.departmentId)})
                                        </p>
                                    </div>
                                </td>
                                {daysArray.map((day) => {
                                    const shifts = getShiftsForDay(employee.shifts, day);
                                    const dayClass = getDayColor(shifts);

                                    let style = {};
                                    if (dayClass === 'late-only') {
                                        style = {
                                            background:
                                                'linear-gradient(to right, red 50%, #3b82f6 50%)',
                                        };
                                    } else if (dayClass === 'early-only') {
                                        style = {
                                            background:
                                                'linear-gradient(to right, #3b82f6 50%, red 50%)',
                                        };
                                    }

                                    const finalClass =
                                        dayClass === 'late-only' || dayClass === 'early-only'
                                            ? ''
                                            : dayClass;

                                    return (
                                        <td
                                            key={day}
                                            className="py-1 text-center relative cursor-pointer"
                                            onClick={() => setSelectedDayShiftsModal(shifts)}
                                        >
                                            <div
                                                className={`w-4 h-4 flex items-center rounded-full hover:bg-blue-500 ${finalClass}`}
                                                style={style}
                                            ></div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    },
);

CalendarTable.displayName = 'CalendarTable';
