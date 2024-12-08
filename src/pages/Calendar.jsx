import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Header } from '../components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleWithEdit } from '../components/Calendar/CalendarModal';
import { AddShift } from '../components/Calendar/AddShift';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Dropdown } from 'primereact/dropdown';
import AlertModal from '../components/AlertModal';
import { EmployeeCalendar } from '../components/Accounting/Workers/EmployeeCalendar';
import { useCompanyStructureStore } from '../store/companyStructureStore';

const Calendar = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    const subUsers = useCompanyStructureStore((state) => state.subUsers);
    const departments = useCompanyStructureStore((state) => state.departments);
    const [modal, setModal] = useState(false);
    const [currentShifts, setCurrentShifts] = useState([]);
    const [modalAddShift, setModalAddShift] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [selectedShiftId, setSelectedShiftId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const openModalAddShift = useCallback(() => {
        if (selectedStore) {
            setModalAddShift(true);
        } else {
            setAlertOpen(true);
        }
    }, [selectedStore]);

    useEffect(() => {
        if (selectedStore) {
            // fetchShiftsByStore(selectedStore._id);
        } else {
            setCurrentShifts([]);
        }
    }, [selectedStore]);

    const getShiftsFromSubUsers = (subUsers) => {
        return subUsers.flatMap((subUser) =>
            subUser.shifts.map((shift) => ({
                title: subUser.name,
                start: new Date(shift.startTime),
                end: new Date(shift.endTime),
                extendedProps: {
                    shiftId: shift._id || '',
                    subUserId: shift.subUserId || '',
                    selectedStoreId: shift.selectedStore?._id || '',
                },
            })),
        );
    };

    const handleEventClick = useCallback(
        (info) => {
            const shiftId = info.event.extendedProps.shiftId;
            const selectedStoreId = info.event.extendedProps.selectedStoreId;
            setSelectedShiftId(shiftId);
            setSelectedStoreId(selectedStoreId);
            setModal(true);
        },
        [setModal, setSelectedShiftId],
    );

    const renderEventContent = useCallback((eventInfo) => {
        const startTime = eventInfo.event.start;
        const endTime = eventInfo.event.end;
        const startTimeFormatted = startTime
            ? startTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';
        const endTimeFormatted = endTime
            ? endTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';
        return (
            <div
                className="bg-blue-500 cursor-pointer rounded-lg px-2 w-full flex flex-col"
                onClick={() => setModal(true)}
            >
                <p className="text-white text-xs inline-flex">
                    {startTimeFormatted} - {endTimeFormatted}
                </p>
                <p className="text-white inline-flex text-xs">{eventInfo.event.title}</p>
            </div>
        );
    }, []);

    const filteredEvents = useMemo(() => {
        const allEvents = getShiftsFromSubUsers(subUsers);
        if (selectedStore) {
            return allEvents.filter(
                (event) => event.extendedProps.selectedStoreId === selectedStore._id,
            );
        }
        return allEvents;
    }, [subUsers, selectedStore]);

    return (
        <div className="w-[100%] align-center justify-center">
            <div className="m-2 mt-20 md:mt-0 mb-0 p-2 pb-0 bg-white rounded-3xl">
                <div className="flex justify-between max-h-[40px] mb-16 mt-5">
                    {' '}
                    <Header category="Учёт" title="Смены" />
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.value)}
                        options={stores}
                        optionLabel="storeName"
                        placeholder="Выберите магазин"
                        className="border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                        showClear
                    />
                </div>
                <AlertModal
                    open={alertOpen}
                    message="Пожалуйста, выберите магазин перед добавлением смены."
                    onClose={() => setAlertOpen(false)}
                />
                <ScheduleWithEdit
                    selectedStoreId={selectedStore ? selectedStore._id : selectedStoreId}
                    open={modal}
                    setOpen={setModal}
                    shiftId={selectedShiftId}
                />
                <AddShift
                    selectedStore={selectedStore}
                    subusers={subUsers}
                    open={modalAddShift}
                    setOpen={setModalAddShift}
                    currentShifts={currentShifts}
                    setCurrentShifts={setCurrentShifts}
                />

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={filteredEvents}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    locale={ruLocale}
                    firstDay={1}
                    fixedWeekCount={false}
                    headerToolbar={{
                        left: 'dayGridMonth,dayGridWeek,dayGridDay',
                        center: 'title',
                        right: 'customButton prev,next,today',
                    }}
                    customButtons={{
                        customButton: {
                            text: 'Добавить',
                            click: openModalAddShift,
                        },
                    }}
                />
            </div>
            <div className="flex ml-5 mt-10 w-[90%] md:ml-0 md:w-[100%] subtle-border">
                <EmployeeCalendar stores={stores} departments={departments} subUsers={subUsers} />
            </div>
        </div>
    );
};

export default Calendar;
