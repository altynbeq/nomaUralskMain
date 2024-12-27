import React, { memo } from 'react';
import { Loader } from '../../Loader';
import { FaCheck } from 'react-icons/fa';

export const CalendarTable = memo(
    ({
        currentSubusers,
        daysArray,
        year,
        month,
        getShiftsForDay,
        getDayColor,
        isLoading,
        onDayClick,
        selectedDays,
        bulkMode,
    }) => {
        // CalendarTable.js (фрагмент)
        const getCellStyle = (dayColor) => {
            let style = {};
            let finalClass = '';

            switch (dayColor.type) {
                case 'split-late-nostart':
                    // Левый красный (#ef4444), правый primary (допустим #3b82f6)
                    style = {
                        background: 'linear-gradient(to right, #ef4444 50%, #3b82f6 50%)',
                    };
                    break;

                case 'late':
                    // full color = secondary (укажите ваш secondary, допустим #a855f7)
                    finalClass = 'bg-red-500';
                    break;

                case 'noStartEnd':
                    // full color = primaryLight
                    finalClass = 'bg-blue-500';
                    break;

                case 'fullWorked':
                    // success
                    finalClass = 'bg-green-500';
                    break;

                case 'split-other':
                    // left = success (green), right = primaryLight (blue-500)
                    style = {
                        background: 'linear-gradient(to right, #22c55e 50%, #3b82f6 50%)',
                    };
                    break;

                case 'noShifts':
                    // Нет смен
                    finalClass = 'bg-gray-200';
                    break;

                default:
                    finalClass = 'bg-gray-200';
                    break;
            }

            return { style, finalClass };
        };

        const getTitleText = (dayColor) => {
            switch (dayColor.type) {
                case 'split-red-blue':
                    return 'Опоздание и отсутствие отметки ухода';
                case 'split':
                    return 'Опоздание или неполная смена';
                case 'split-green-red':
                    return 'Отработана частично и с опозданием';
                case 'gray':
                    return 'Нет смены';
                case 'blue':
                    return 'Смена без отметок прихода и ухода';
                case 'green':
                    return 'Отработана полностью';
                default:
                    return '';
            }
        };

        const isDaySelected = (employeeId, day) => {
            return selectedDays.some(
                (selected) => selected.employee._id === employeeId && selected.day === day,
            );
        };

        const isDaySelectable = (shifts) => {
            if (bulkMode === 'add') {
                return shifts.length === 0;
            } else if (bulkMode === 'edit') {
                return shifts.length > 0;
            }
            return true;
        };

        const handleDayClick = (employee, day, shifts) => {
            if (isDaySelectable(shifts)) {
                onDayClick(employee, day, shifts);
            }
        };

        const getWeekDayName = (year, month, day) => {
            const date = new Date(year, month, day);
            return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date);
        };

        return (
            <div className="relative overflow-x-auto w-full max-w-full mt-10">
                {isLoading && (
                    <div className="absolute py-8 inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader />
                    </div>
                )}
                <table
                    className={`table-auto w-full max-w-full border-collapse ${isLoading ? 'opacity-50' : ''}`}
                >
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
                            {daysArray.map((day) => (
                                <th key={day} className="py-1 text-center text-xs text-gray-500">
                                    {getWeekDayName(year, month, day)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubusers.map((employee) => (
                            <tr key={employee._id}>
                                <td className="px-4 py-2 inline-flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <p className="text-sm">{employee?.name}</p>
                                        <p className="text-sm">{employee?.departmentId?.name}</p>
                                    </div>
                                </td>
                                {daysArray.map((day) => {
                                    const shifts = getShiftsForDay(employee.shifts, day);
                                    const dayColor = getDayColor(shifts);
                                    const { style, finalClass } = getCellStyle(dayColor);
                                    const titleText = getTitleText(dayColor);
                                    const isSelected = isDaySelected(employee._id, day);
                                    const isSelectable = isDaySelectable(shifts);

                                    return (
                                        <td
                                            key={day}
                                            className={`py-1 text-center relative cursor-pointer ${
                                                !isSelectable ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => handleDayClick(employee, day, shifts)}
                                        >
                                            {isSelectable && (
                                                <div
                                                    className={`w-6 h-6 flex items-center justify-center rounded-full hover:opacity-75 ${finalClass}`}
                                                    style={style}
                                                    title={titleText}
                                                ></div>
                                            )}
                                            {isSelected && isSelectable && (
                                                <FaCheck
                                                    className="text-center absolute top-1/2 left-[41%] transform -translate-x-1/2 -translate-y-1/2 text-black text-xs"
                                                    title="Выбранный день"
                                                />
                                            )}
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
