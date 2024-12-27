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
    } else if (allFull) {
        return 'fullWorked';
    } else {
        return 'split-other';
    }
};
