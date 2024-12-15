import { useState, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../api/axiosInstance';
import { formatOnlyDate } from '../../methods/dataFormatter';

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
    today: 'Сегодня',
    clear: 'Очистить',
});

export const AddSingleShift = ({ visible, stores, employee, onHide, selectedDateForNewShift }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const getSelectedDateTime = useMemo(() => {
        if (!selectedDateForNewShift) return null;
        const { day, month, year } = selectedDateForNewShift;
        return DateTime.local(year, month, day).setZone('UTC+5', { keepLocalTime: true });
    }, [selectedDateForNewShift]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let currentDate = DateTime.fromJSDate(new Date()).startOf('day');
        if (
            !currentDate ||
            !startTime ||
            !endTime ||
            !selectedStore ||
            !selectedDateForNewShift ||
            !employee
        ) {
            toast.error('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const shiftStartTime = DateTime.fromJSDate(startTime);
        const shiftEndTime = DateTime.fromJSDate(endTime);

        // Если конец смены раньше или равен началу — значит следующий день
        let adjustedEnd = shiftEndTime;
        if (adjustedEnd <= shiftStartTime) {
            adjustedEnd = adjustedEnd.plus({ days: 1 });
        }

        const shiftStartLocal = getSelectedDateTime
            .set({
                hour: shiftStartTime.hour,
                minute: shiftStartTime.minute,
                second: 0,
                millisecond: 0,
            })
            .setZone('UTC+5', { keepLocalTime: true });

        const shiftEndLocal = getSelectedDateTime
            .set({
                hour: adjustedEnd.hour,
                minute: adjustedEnd.minute,
                second: 0,
                millisecond: 0,
            })
            .setZone('UTC+5', { keepLocalTime: true });

        // Конвертируем локальное время магазина в UTC
        const shiftStartUtc = shiftStartLocal.toUTC();
        const shiftEndUtc = shiftEndLocal.toUTC();

        const shifts = [
            {
                subUserId: employee._id,
                startTime: shiftStartUtc.toISO(),
                endTime: shiftEndUtc.toISO(),
                selectedStore: selectedStore._id,
            },
        ];

        if (shifts.length === 0) {
            toast.error('Не удалось сгенерировать смены.');
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('/shifts', { shifts });
            onHide();
            toast.success('Все смены успешно добавлены');
        } catch (error) {
            console.error('Error adding/updating shifts:', error);
            toast.error(error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            visible={visible}
            header={`Добавить смену на ${formatOnlyDate(getSelectedDateTime)}`}
            onHide={() => onHide()}
        >
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div>
                        <Dropdown
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.value)}
                            options={stores}
                            optionLabel="storeName"
                            placeholder="Выберите магазин"
                            className="w-full border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                            showClear
                        />
                    </div>
                    {/* Выбор времени начала смены */}
                    <div>
                        <label className="block text-gray-700 mb-2">Время начала смены:</label>
                        <Calendar
                            value={startTime}
                            onChange={(e) => setStartTime(e.value)}
                            timeOnly
                            hourFormat="24"
                            showIcon
                            locale="ru"
                            placeholder="Выберите время начала"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Время окончания смены:</label>
                        <Calendar
                            value={endTime}
                            onChange={(e) => setEndTime(e.value)}
                            timeOnly
                            hourFormat="24"
                            showIcon
                            locale="ru"
                            placeholder="Выберите время окончания"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        } transition duration-200`}
                    >
                        {isLoading ? 'Проверка...' : 'Добавить'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};
