import React, { memo } from 'react';
import { Loader } from '../../Loader';

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
        loading, // Добавляем проп loading
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
                    <tbody className="relative">
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
                                    const dayColor = getDayColor(shifts);

                                    let style = {};
                                    let finalClass = '';

                                    if (dayColor.type === 'split-red-blue') {
                                        style = {
                                            background:
                                                'linear-gradient(to right, #ef4444 50%, #3b82f6 50%)', // bg-red-500 и bg-blue-500
                                        };
                                    } else if (dayColor.type === 'split') {
                                        style = {
                                            background:
                                                'linear-gradient(to right, #ef4444 50%, green 50%)',
                                        };
                                    } else {
                                        switch (dayColor.type) {
                                            case 'gray':
                                                finalClass = 'bg-gray-200';
                                                break;
                                            case 'blue':
                                                finalClass = 'bg-blue-500';
                                                break;
                                            case 'green':
                                                finalClass = 'bg-green-500';
                                                break;
                                            default:
                                                finalClass = '';
                                        }
                                    }

                                    let titleText = '';
                                    switch (dayColor.type) {
                                        case 'split-red-blue':
                                            titleText = 'Опоздание и отсутствие отметки ухода';
                                            break;
                                        case 'split':
                                            titleText = 'Опоздание или неполная смена';
                                            break;
                                        case 'gray':
                                            titleText = 'Нет смены';
                                            break;
                                        case 'blue':
                                            titleText = 'Смена без отметок прихода и ухода';
                                            break;
                                        case 'green':
                                            titleText = 'Отработана полностью';
                                            break;
                                        default:
                                            titleText = '';
                                    }

                                    return (
                                        <td
                                            key={day}
                                            className="py-1 text-center relative cursor-pointer"
                                            onClick={() => setSelectedDayShiftsModal(shifts)}
                                        >
                                            <div
                                                className={`w-6 h-6 flex items-center justify-center rounded-full hover:opacity-75 ${finalClass}`}
                                                style={style}
                                                title={titleText}
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
