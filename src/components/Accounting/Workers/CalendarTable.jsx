import React, { memo } from 'react';
import { Loader } from '../../Loader';
import { FaCheck } from 'react-icons/fa'; // Импортируем иконку FaCheck

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
        selectedDays, // Принимаем selectedDays как пропс
    }) => {
        const handleDayClick = (employee, day, shifts) => {
            onDayClick(employee, day, shifts);
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
                                    {/* <div className="w-6 h-6 bg-gray-200 rounded-full"></div> */}
                                    <div className="flex flex-col">
                                        <p className="text-sm">{employee?.name}</p>
                                        <p className="text-sm">{employee?.departmentId?.name}</p>
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
                                                'linear-gradient(to right, #ef4444 50%, #3b82f6 50%)',
                                        };
                                    } else if (dayColor.type === 'split') {
                                        style = {
                                            background:
                                                'linear-gradient(to right, #ef4444 50%, green 50%)',
                                        };
                                    } else if (dayColor.type === 'split-green-red') {
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

                                    // Проверяем, выбран ли этот день для данного сотрудника в bulkMode
                                    const isSelected = selectedDays.some(
                                        (selected) =>
                                            selected.employeeId === employee._id &&
                                            selected.day === day,
                                    );

                                    return (
                                        <td
                                            key={day}
                                            className="py-1 text-center relative cursor-pointer"
                                            onClick={() => handleDayClick(employee, day, shifts)}
                                        >
                                            <div
                                                className={`w-6 h-6 flex items-center justify-center rounded-full hover:opacity-75 ${finalClass}`}
                                                style={style}
                                                title={titleText}
                                            ></div>
                                            {isSelected && (
                                                <FaCheck
                                                    className="text-center absolute top-1/2 left-[42%] transform -translate-x-1/2 -translate-y-1/2 text-black text-md"
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
