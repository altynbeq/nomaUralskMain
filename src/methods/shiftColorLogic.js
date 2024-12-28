// shiftColorLogic.js

export const hasAnyLate = (shifts) => {
    // Если хотя бы в одной смене есть lateMinutes > 0, значит есть опоздания
    return shifts.some((s) => s.lateMinutes > 0);
};

export const hasAnyNoStartEnd = (shifts) => {
    // Если хотя бы в одной смене нет и scanTime, и endScanTime
    return shifts.some((s) => !s.scanTime && !s.endScanTime);
};

export const areAllShiftsFullyWorked = (shifts) => {
    // Все смены должны:
    //   1) Иметь и scanTime, и endScanTime (не null)
    //   2) Отработанные минуты >= запланированных минут
    return shifts.every((s) => {
        const workedTotal = (s.workedTime?.hours ?? 0) * 60 + (s.workedTime?.minutes ?? 0);
        const durationTotal = (s.shiftDuration?.hours ?? 0) * 60 + (s.shiftDuration?.minutes ?? 0);

        return s.scanTime && s.endScanTime && workedTotal >= durationTotal;
    });
};

export const getDayColorType = (shifts) => {
    if (shifts.length === 0) {
        // Нет смен вообще — можно вернуть что-то нейтральное
        return 'noShifts';
    }

    const late = hasAnyLate(shifts);
    const noStartEnd = hasAnyNoStartEnd(shifts);
    const allFull = areAllShiftsFullyWorked(shifts);

    if (late && noStartEnd) {
        return 'split-late-nostart';
    } else if (late) {
        return 'late';
    } else if (noStartEnd) {
        return 'noStartEnd';
    } else if (!late && !allFull) {
        return 'split-no-late-incomplete';
    } else if (allFull) {
        return 'fullWorked';
    } else {
        return 'split-other';
    }
};

export const getDayColorClasses = (colorType) => {
    switch (colorType) {
        case 'split-late-nostart':
            // Левый красный (#ef4444), правый primary (#3b82f6)
            return {
                style: {
                    background: 'linear-gradient(to right, #ef4444 50%, #3b82f6 50%)',
                },
                className: 'text-white',
                tooltip: 'Опоздание и отсутствие отметки ухода',
            };
        case 'late':
            // Цвет = secondary (например, #a855f7)
            return {
                style: {},
                className: 'bg-red-500 text-white', // Замените на нужный цвет
                tooltip: 'Опоздал',
            };
        case 'noStartEnd':
            // Цвет = primaryLight (например, #3b82f6)
            return {
                style: {},
                className: 'bg-blue-500 text-white',
                tooltip: 'Смена без отметок прихода и ухода',
            };
        case 'fullWorked':
            // Цвет = success (например, #22c55e)
            return {
                style: {},
                className: 'bg-green-500 text-white',
                tooltip: 'Отработана полностью',
            };

        case 'split-no-late-incomplete': // Новый тип
            return {
                style: {
                    background: 'linear-gradient(to right, #22c55e 50%, #ef4444 50%)', // Зеленый и красный
                },
                className: 'text-white',
                tooltip: 'Не опоздал и не отработал всю смену',
            };
        case 'split-other':
            // Левый green (#22c55e), правый blue-500 (#3b82f6)
            return {
                style: {
                    background: 'linear-gradient(to right, #22c55e 50%, #3b82f6 50%)',
                },
                className: 'text-white',
                tooltip: 'Отработана частично',
            };
        case 'noShifts':
        default:
            // Нет смен — серый цвет
            return {
                style: {},
                className: 'bg-gray-300 text-black',
                tooltip: 'Нет смены',
            };
    }
};
