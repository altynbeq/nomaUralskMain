export const CalendarModal = ({ isOpen, onClose, selectedDay, dailyData }) => {
    if (!isOpen) return null;

    const dayData = dailyData.find((item) => item.date === selectedDay);

    const calculateLateMinutes = () => {
        if (!dayData) return 0;

        const [workHoursStart] = dayData.workHours.split(' - ');
        const [startHours, startMinutes] = workHoursStart.split(':');
        const [cameAtHours, cameAtMinutes] = dayData.cameAt.split(':');

        const workHoursStartDate = new Date(2024, 10, 14, startHours, startMinutes);
        const cameAtDate = new Date(2024, 10, 14, cameAtHours, cameAtMinutes);

        const diffInMs = cameAtDate.getTime() - workHoursStartDate.getTime();
        return diffInMs > 0 ? Math.floor(diffInMs / 1000 / 60) : 0;
    };

    const getProgressWidth = () => {
        if (!dayData) return '0%';

        const planAmount = parseFloat(dayData.plan.replace(/[^\d]/g, ''));
        const actualAmount = parseFloat(dayData.actual.replace(/[^\d]/g, ''));
        return `${((actualAmount / planAmount) * 100).toFixed(2)}%`;
    };

    const timeSpanClasses =
        'border-2 pl-1 ml-2 pr-1 rounded-md ' +
        'sm:border sm:pl- sm:pr-2 ' +
        'md:border-2 md:pl-3 md:pr-3 ' +
        'lg:border-2 lg:pl-4 lg:pr-4 ' +
        'xl:border-2 xl:pl-5 xl:pr-5 ' +
        '2xl:border-2 2xl:pl-6 2xl:pr-6';

    return (
        <div className="fixed z-10 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full sm:w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/3 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 pt-4 pr-4 text-gray-500 hover:text-gray-700 rounded-md"
                >
                    ✕
                </button>
<<<<<<< Updated upstream
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

                        <div className="mt-4">
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
                        </div>

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
=======
                <h2 className="text-lg font-semibold text-center text-black">Store Name</h2>

                <div className="mt-4 text-sm md:text-base">
                    <p className="font-semibold text-black pb-2">Plan</p>
                    <p className="text-gray-600">
                        {dayData?.actual || '600 000 тг'}/600 000{' '}
                        {dayData?.actual
                            ? `${(
                                  (parseFloat(dayData.actual.replace(/[^\d]/g, '')) / 600000) *
                                  100
                              ).toFixed(2)}%`
                            : ''}
                    </p>

                    {dayData && (
                        <>
                            <div className="w-full bg-gray-200 h-2 rounded-full my-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: getProgressWidth() }}
                                />
                            </div>
                            <p className="font-semibold mt-4 text-black py-4">Smena</p>
                            <div className="flex flex-col gap-2 text-gray-600 border-b border-gray-300 pb-4">
                                <p>
                                    Work hours:
                                    <span className={timeSpanClasses}>{dayData.workHours}</span>
                                </p>
                                <div className="flex flex-col sm:flex-row justify-stretch  gap-4 sm:items-center">
                                    <div className="flex sm:flex-row sm:items-center">
                                        <p className="mr-2">Came at:</p>
                                        <span className={timeSpanClasses}>{dayData.cameAt}</span>
                                    </div>
                                    <div className="flex sm:flex-row sm:items-center mt-2 sm:mt-0">
                                        <p className="mr-2">Left at:</p>
                                        <span className={timeSpanClasses}>{dayData.leftAt}</span>
                                    </div>
                                    {dayData.wasLate && (
                                        <p className="text-red-500 text-sm mt-1 text-center sm:text-left">
                                            Late for {calculateLateMinutes()} min
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {!dayData && (
                        <>
                            <p className="font-semibold mt-2 text-black">Smena</p>
                            <p className="text-gray-600">
                                Work hours:{' '}
                                <span className="border-2 pl-1 pr-1 rounded-md">12:00 - 20:00</span>{' '}
                            </p>
                        </>
                    )}
                </div>
>>>>>>> Stashed changes
            </div>
        </div>
    );
};
