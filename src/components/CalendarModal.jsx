import { formatOnlyTimeDate, formatOnlyDate } from '../methods/dataFormatter';
import { dailyData } from '../data/dailyData';

export const CalendarModal = ({ isOpen, onClose, selectedDay, selectedShift }) => {
    if (!isOpen) return null;

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

    return (
        <div className="fixed z-10 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full sm:w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/3 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 rounded-md"
                >
                    ✕
                </button>
                <h2 className="text-lg font-semibold text-center text-black">
                    {selectedShift
                        ? `Смена на ${formatOnlyDate(selectedShift.startTime)}`
                        : 'Смена отсутствует'}
                </h2>

                {selectedShift ? (
                    <div className="mt-4 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-black">Магазин:</p>
                            <p className="text-gray-600">
                                {selectedShift?.selectedStore?.storeName || 'N/A'}
                            </p>
                        </div>

                        {/* <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-black">План:</p>
                                <p className="text-gray-600">{plan.toLocaleString()} тг</p>
                            </div>

                            <div className="relative w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 bg-green-500 h-5"
                                    style={{ width: `${percent}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-sm font-semibold">
                                        {actual.toLocaleString()} тг ({percent}%)
                                    </p>
                                </div>
                            </div>
                        </div> */}

                        <div className="mt-6 flex items-center gap-2">
                            <p className="font-semibold text-black">Смена:</p>
                            <p className="text-gray-600 border-2 rounded-lg p-1 inline-flex text-center items-center justify-center">
                                {formatOnlyTimeDate(selectedShift.startTime)} -{' '}
                                {formatOnlyTimeDate(selectedShift.endTime)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4 text-center">
                        На выбранный день смен не назначено.
                    </p>
                )}
            </div>
        </div>
    );
};
