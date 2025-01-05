// CalendarModal.jsx

import { useCallback } from 'react';
import { formatOnlyTimeDate, formatOnlyDate } from '../methods/dataFormatter';
import { dailyData } from '../data/dailyData';
import { Dialog } from 'primereact/dialog';

export const CalendarModal = ({ isOpen, onClose, selectedDay, selectedShifts }) => {
    const calculateProgress = () => {
        if (!dailyData || dailyData.length === 0)
            return { actual: 5000, plan: 600000, percent: 30 };

        // Предполагаем, что dailyData содержит информацию о дне
        const dayData = dailyData.find((item) => item.date === formatOnlyDate(selectedDay));

        if (!dayData) return { actual: 5000, plan: 600000, percent: 30 };

        const planAmount = parseFloat(dayData.plan.replace(/[^\d]/g, ''));
        const actualAmount = parseFloat(dayData.actual.replace(/[^\d]/g, ''));
        const percent = ((actualAmount / planAmount) * 100).toFixed(2);

        return {
            actual: actualAmount,
            plan: planAmount,
            percent,
        };
    };

    const { actual, plan, percent } = calculateProgress();

    const getDurationText = (shift) => {
        const durationText =
            shift.shiftDuration.hours > 0
                ? `${shift.shiftDuration.hours} ч ${shift.shiftDuration.minutes > 0 ? `${shift.shiftDuration.minutes} мин` : ''}`
                : `${shift.shiftDuration.minutes} мин`;

        return durationText;
    };

    const calculateLateMinutes = useCallback((startTime, scanTime) => {
        if (!startTime || !scanTime) return 0;
        const start = new Date(startTime);
        const scan = new Date(scanTime);
        const diffMs = scan - start;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes > 0 ? diffMinutes : 0;
    }, []);

    const getLateMinutes = (shift) => {
        const lateMinutes =
            shift.startTime && shift.scanTime
                ? calculateLateMinutes(shift.startTime, shift.scanTime)
                : 0;
        return lateMinutes;
    };

    const getLateText = (shift) => {
        return shift.lateMinutes ? `Опоздал на ${shift.lateMinutes} мин` : 'Не опоздал';
    };

    const getWorkedTimeText = (shift) => {
        const workedTimeText =
            shift.workedTime.hours > 0
                ? `${shift.workedTime.hours} ч ${shift.workedTime.minutes > 0 ? `${shift.workedTime.minutes} мин` : ''}`
                : `${shift.workedTime.minutes} мин`;
        return workedTimeText;
    };

    return (
        <Dialog
            visible={isOpen}
            header={
                selectedShifts && selectedShifts.length > 0
                    ? `Смены на ${formatOnlyDate(selectedShifts[0]?.startTime)}`
                    : 'Смена отсутствует'
            }
            onHide={() => onClose()}
            className="bg-white rounded-lg p-6 w-full sm:w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/3 shadow-lg relative"
        >
            {selectedShifts && selectedShifts.length > 0 ? (
                <div className="mt-4 text-sm md:text-base flex flex-col gap-4">
                    {selectedShifts.map((shift, index) => (
                        <div key={shift._id} className="border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold text-lg">Смена {index + 1}:</p>
                                <p className="text-gray-600 border-2 rounded-lg p-1 inline-flex text-center items-center justify-center">
                                    {formatOnlyTimeDate(shift.startTime)} -{' '}
                                    {formatOnlyTimeDate(shift.endTime)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold text-lg">Магазин:</p>
                                <p className="text-gray-600">
                                    {shift?.selectedStore?.storeName || 'N/A'}
                                </p>
                            </div>

                            <div className="flex gap-4 mb-2">
                                <p>
                                    <span className="font-bold text-lg">Длительность:</span>{' '}
                                    {getDurationText(shift)}
                                </p>
                            </div>
                            <div className="flex flex-col mb-2">
                                {shift.scanTime && (
                                    <p>
                                        <span className="font-bold text-lg">
                                            Фактический приход:
                                        </span>{' '}
                                        {formatOnlyTimeDate(shift.scanTime)}
                                    </p>
                                )}
                                {shift.endScanTime && (
                                    <p>
                                        <span className="font-bold text-lg">Фактический уход:</span>{' '}
                                        {formatOnlyTimeDate(shift.endScanTime)}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                {shift.scanTime && (
                                    <p
                                        className={
                                            getLateMinutes(shift) > 0
                                                ? 'text-red-500 font-bold text-lg'
                                                : 'text-green-500 font-bold text-lg'
                                        }
                                    >
                                        {getLateText(shift)}
                                    </p>
                                )}
                                {shift.scanTime && shift.endScanTime && (
                                    <p className="text-blue-500 font-bold text-lg">
                                        Отработано: {getWorkedTimeText(shift)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-4 text-center">
                    На выбранный день смен не назначено.
                </p>
            )}
        </Dialog>
    );
};
