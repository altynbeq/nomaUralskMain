import { memo, useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

export const CheckInCheckOutModal = memo(
    ({ visible, type, time, clearCheckInCheckoutProps, shift }) => {
        const [date, setDate] = useState(null);
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            setDate(time);
        }, [time]);

        const updateShiftScan = async (shift) => {
            setIsLoading(true);
            try {
                await axiosInstance.put(
                    `/shifts/update-shift/${shift._id}`,
                    type === 'checkIn'
                        ? {
                              subUserId: shift.subUserId,
                              startTime: shift.startTime,
                              endTime: shift.endTime,
                              selectedStore: shift.selectedStore._id,
                              scanTime: date,
                              endScanTime: shift.endScanTime,
                          }
                        : {
                              subUserId: shift.subUserId,
                              endScanTime: date,
                              startTime: shift.startTime,
                              endTime: shift.endTime,
                              selectedStore: shift.selectedStore._id,
                              scanTime: shift.scanTime,
                          },
                );
                toast.success(`Вы успешно изменили ${type === 'checkIn' ? 'приход' : 'уход'}`);
                clearCheckInCheckoutProps();
            } catch {
                toast.error(`Не удалось изменить ${type === 'checkIn' ? 'приход' : 'уход'}`);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <Dialog
                onHide={() => clearCheckInCheckoutProps()}
                header={`Изменение ${type === 'checkIn' ? 'прихода' : 'ухода'}`}
                visible={visible}
            >
                <Calendar
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    showIcon
                    showTime
                    locale="ru"
                    hourFormat="24"
                    placeholder={`Время ${type === 'checkIn' ? 'прихода' : 'ухода'}`}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <div className="flex justify-center">
                    <Button
                        onClick={() => updateShiftScan(shift, type)}
                        disabled={isLoading}
                        className="w-full text-white bg-blue-400 rounded-lg border p-1 mt-4"
                        label="Изменить"
                    />
                </div>
            </Dialog>
        );
    },
);

CheckInCheckOutModal.displayName = 'CheckInCheckOutModal';
