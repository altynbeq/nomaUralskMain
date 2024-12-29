import { memo, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

export const CheckInCheckOutModal = memo(
    ({ visible, type, time, clearCheckInCheckoutProps, shift, onUpdate }) => {
        const [date, setDate] = useState(null);
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            if (time) {
                setDate(new Date(time));
            } else {
                const baseDate = new Date(type === 'checkIn' ? shift.startTime : shift.endTime);
                const startTimeDate = new Date(shift.startTime);
                const endTimeDate = new Date(shift.endTime);

                // Учитываем, если endTime — это следующий день после startTime
                if (type === 'checkOut' && endTimeDate < startTimeDate) {
                    endTimeDate.setDate(endTimeDate.getDate() + 1);
                }

                const hours = baseDate.getHours();
                const minutes = baseDate.getMinutes();

                const now = new Date();
                now.setFullYear(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

                // Для checkOut с переходом на следующий день увеличиваем дату на 1 день
                if (
                    type === 'checkOut' &&
                    endTimeDate > startTimeDate &&
                    endTimeDate.getDate() !== startTimeDate.getDate()
                ) {
                    now.setDate(now.getDate() + 1);
                }

                now.setHours(hours, minutes, 0, 0);
                setDate(now);
            }
        }, [time, shift, type]);

        const updateShiftScan = async () => {
            setIsLoading(true);
            try {
                const payload =
                    type === 'checkIn'
                        ? {
                              scanTime: date,
                          }
                        : {
                              endScanTime: date,
                          };

                const url =
                    type === 'checkIn'
                        ? `/shifts/update-scan-time/${shift.id}`
                        : `/shifts/update-end-scan-time/${shift.id}`;
                const response = await axiosInstance.put(url, payload);
                const updatedShift = response.data;
                if (onUpdate) {
                    onUpdate(updatedShift);
                }

                clearCheckInCheckoutProps();
                toast.success(`Вы успешно обновили ${type === 'checkIn' ? 'приход' : 'уход'}`);
            } catch (error) {
                console.error('Ошибка при обновлении смены:', error);
                toast.error(`Не удалось изменить ${type === 'checkIn' ? 'приход' : 'уход'}`);
            } finally {
                setIsLoading(false);
            }
        };

        const handleTimeChange = (e) => {
            const newTime = e.value;
            if (!newTime) return;
            const updatedDate = new Date(date);
            updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);
            setDate(updatedDate);
        };

        return (
            <Dialog
                onHide={() => clearCheckInCheckoutProps()}
                header={`Изменение ${type === 'checkIn' ? 'прихода' : 'ухода'}`}
                visible={visible}
            >
                <Calendar
                    value={date}
                    onChange={handleTimeChange}
                    showIcon
                    showTime
                    timeOnly
                    mask="99:99"
                    locale="ru"
                    hourFormat="24"
                    placeholder={`Время ${type === 'checkIn' ? 'прихода' : 'ухода'}`}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <div className="flex justify-center">
                    <Button
                        onClick={updateShiftScan}
                        disabled={isLoading || !date}
                        className="w-full text-white bg-blue-400 rounded-lg border p-1 mt-4"
                        label={`Изменить ${type === 'checkIn' ? 'приход' : 'уход'}`}
                    />
                </div>
            </Dialog>
        );
    },
);

CheckInCheckOutModal.displayName = 'CheckInCheckOutModal';
