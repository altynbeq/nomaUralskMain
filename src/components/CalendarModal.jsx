import { useCallback } from 'react';
import { formatOnlyTimeDate, formatOnlyDate } from '../methods/dataFormatter';
import { dailyData } from '../data/dailyData';
import { Dialog } from 'primereact/dialog';

export const CalendarModal = ({ isOpen, onClose, selectedDay, selectedShift }) => {
    const dayData = dailyData.find((item) => item.date === selectedDay);

    const calculateProgress = () => {
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
        const startTime = new Date(shift.startTime);
        let endTime = new Date(shift.endTime);

        if (endTime <= startTime) {
            endTime.setDate(endTime.getDate() + 1);
        }

        const durationMs = endTime - startTime;
        const totalMinutes = Math.floor(durationMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const durationText =
            hours > 0 ? `${hours} ч ${minutes > 0 ? `${minutes} мин` : ''}` : `${minutes} мин`;

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

    const calculateWorkedTime = useCallback((scanTime, endScanTime) => {
        if (!scanTime || !endScanTime) return { hours: 0, minutes: 0 };

        const start = new Date(scanTime);
        const end = new Date(endScanTime);

        // Если время окончания меньше времени начала (пересечение полуночи)
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const diffMs = end - start; // Разница в миллисекундах
        const totalMinutes = diffMs / (1000 * 60); // Общее время в минутах

        const roundedMinutes = Math.ceil(totalMinutes); // Используем Math.ceil для учета долей минут
        const hours = Math.floor(roundedMinutes / 60);
        const minutes = roundedMinutes % 60;

        return { hours, minutes };
    }, []);

    const getLateMinutes = (shift) => {
        const lateMinutes =
            shift.startTime && shift.scanTime
                ? calculateLateMinutes(shift.startTime, shift.scanTime)
                : 0;
        return lateMinutes;
    };

    const getLateText = (shift) => {
        const lateMinutes = getLateMinutes(shift);
        return getLateMinutes(shift) > 0 ? `Опоздал на ${lateMinutes} мин` : 'Не опоздал';
    };

    const getWorkedTimeText = (shift) => {
        const workedTime = calculateWorkedTime(shift.scanTime, shift.endScanTime);
        const workedTimeText =
            workedTime.hours > 0
                ? `${workedTime.hours} ч ${workedTime.minutes > 0 ? `${workedTime.minutes} мин` : ''}`
                : `${workedTime.minutes} мин`;
        return workedTimeText;
    };

    return (
        <Dialog
            visible={isOpen}
            header={
                selectedShift
                    ? `Смена на ${formatOnlyDate(selectedShift.startTime)}`
                    : 'Смена отсутствует'
            }
            onHide={() => onClose()}
            className="bg-white rounded-lg p-6 w-full sm:w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/3 shadow-lg relative"
        >
            {selectedShift ? (
                <div className="mt-4 text-sm md:text-base flex flex-col gap-4">
                    <div className="mt-6 flex items-center gap-2">
                        <p className="font-bold text-lg">Смена:</p>
                        <p className="text-gray-600 border-2 rounded-lg p-1 inline-flex text-center items-center justify-center">
                            {formatOnlyTimeDate(selectedShift.startTime)} -{' '}
                            {formatOnlyTimeDate(selectedShift.endTime)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">Магазин:</p>
                        <p className="text-gray-600">
                            {selectedShift?.selectedStore?.storeName || 'N/A'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <p>
                            <span className="font-bold text-lg">Длительность:</span>{' '}
                            {getDurationText(selectedShift)}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        {selectedShift.scanTime && (
                            <p>
                                <span className="font-bold text-lg">Фактический приход:</span>{' '}
                                {formatOnlyTimeDate(selectedShift.scanTime)}
                            </p>
                        )}
                        {selectedShift.endScanTime && (
                            <p>
                                <span className="font-bold text-lg">Фактический уход:</span>{' '}
                                {formatOnlyTimeDate(selectedShift.endScanTime)}
                            </p>
                        )}
                    </div>
                    <div>
                        {selectedShift.scanTime && (
                            <p
                                className={
                                    getLateMinutes(selectedShift) > 0
                                        ? 'text-red-500 font-bold text-lg'
                                        : 'text-green-500 font-bold text-lg'
                                }
                            >
                                {getLateText(selectedShift)}
                            </p>
                        )}
                        {selectedShift.scanTime && selectedShift.endScanTime && (
                            <p className="text-blue-500 font-bold text-lg">
                                Отработано: {getWorkedTimeText(selectedShift)}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mt-4 text-center">
                    На выбранный день смен не назначено.
                </p>
            )}
        </Dialog>
        // </div>
    );
};
