// src/components/CheckInCheckOutModal.jsx

import { memo, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
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

        const updateShiftScan = async () => {
            setIsLoading(true);
            try {
                const payload =
                    type === 'checkIn'
                        ? {
                              subUserId:
                                  typeof shift.subUserId === 'string'
                                      ? shift.subUserId
                                      : shift.subUserId._id,
                              startTime: shift.startTime,
                              endTime: shift.endTime,
                              selectedStore: shift.selectedStore._id,
                              scanTime: date,
                              endScanTime: shift.endScanTime,
                          }
                        : {
                              subUserId:
                                  typeof shift.subUserId === 'string'
                                      ? shift.subUserId
                                      : shift.subUserId._id,
                              endScanTime: date,
                              startTime: shift.startTime,
                              endTime: shift.endTime,
                              selectedStore: shift.selectedStore._id,
                              scanTime: shift.scanTime,
                          };

                await axiosInstance.put(`/shifts/update-shift/${shift._id}`, payload);

                clearCheckInCheckoutProps();
                toast.success(`Вы успешно обновили ${type === 'checkIn' ? 'приход' : 'уход'}`);
            } catch (error) {
                console.error('Ошибка при обновлении смены:', error);
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
