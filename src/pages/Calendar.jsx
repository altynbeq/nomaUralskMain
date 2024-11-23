import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleWithEdit } from '../components/Calendar/CalendarModal';
import CalendarModalAddShift from '../components/Calendar/CalendarModalAddShift';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useStateContext } from '../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';

const Calendar = () => {
    const { access } = useStateContext();
    const [modal, setModal] = useState(false);
    const [currentShifts, setCurrentShifts] = useState([]);
    const [modalAddShift, setModalAddShift] = useState(false);
    const [subuserStores, setSubuserStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [subusers, setSubusers] = useState([]);
    const [selectedShiftId, setSelectedShiftId] = useState(null);

    function openModal() {
        setModal(true);
    }
    function openModalAddShift() {
        setModalAddShift(true);
    }

    useEffect(() => {
        const id = localStorage.getItem('_id');
        if (id && access.DataManagement) {
            fetchStructure(id);
        }
    }, [access.DataManagement]);

    useEffect(() => {
        if (selectedStore) {
            fetchSubusers(selectedStore._id);
            fetchShiftsByStore(selectedStore._id);
        } else {
            fetchAllShifts();
        }
    }, [selectedStore]);

    const fetchStructure = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/subUsers/subuser-stores/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setSubuserStores(data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        }
    };

    const fetchSubusers = async (storeId) => {
        const url = `https://nomalytica-back.onrender.com/api/subUsers/subusers/${storeId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setSubusers(data);
        } catch (error) {
            console.error('Failed to fetch subusers:', error);
        }
    };

    const fetchAllShifts = async () => {
        const url = `https://nomalytica-back.onrender.com/api/shifts/all`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            const shifts = data.map((shift) => ({
                title: shift.subUserId.name,
                start: new Date(shift.startTime),
                end: new Date(shift.endTime),
                extendedProps: {
                    shiftId: shift._id,
                    subUserId: shift.subUserId._id,
                },
            }));
            setCurrentShifts(shifts);
        } catch (error) {
            console.error('Failed to fetch all shifts:', error);
        }
    };

    const fetchShiftsByStore = async (storeId) => {
        const url = `https://nomalytica-back.onrender.com/api/shifts/store/${storeId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            const shifts = data.map((shift) => ({
                title: shift.subUserId.name,
                start: new Date(shift.startTime),
                end: new Date(shift.endTime),
                extendedProps: {
                    shiftId: shift._id,
                    subUserId: shift.subUserId._id,
                },
            }));
            setCurrentShifts(shifts);
        } catch (error) {
            console.error('Failed to fetch shifts by store:', error);
        }
    };

    function renderEventContent(eventInfo) {
        const startTime = eventInfo.event.start;
        const endTime = eventInfo.event.end;

        const startTimeFormatted = startTime
            ? startTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';
        const endTimeFormatted = endTime
            ? endTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';

        return (
            <div className="bg-blue-500 cursor-pointer rounded-lg p-2 w-full" onClick={openModal}>
                <span className="text-white text-xs">
                    {startTimeFormatted} - {endTimeFormatted}
                </span>
                <strong className="text-white text-xs">{eventInfo.event.title}</strong>
            </div>
        );
    }

    const handleEventClick = (info) => {
        const shiftId = info.event.extendedProps.shiftId;
        setSelectedShiftId(shiftId);
        setModal(true);
    };

    return (
        <div className="m-2 mb-0 p-2 pb-0 bg-white rounded-3xl">
            <Header category="Учёт" title="Смены" />
            <ScheduleWithEdit
                open={modal}
                setOpen={setModal}
                shiftId={selectedShiftId}
                fetchShifts={
                    selectedStore ? () => fetchShiftsByStore(selectedStore._id) : fetchAllShifts
                }
            />
            <CalendarModalAddShift
                subusers={subusers}
                open={modalAddShift}
                setOpen={setModalAddShift}
                currentShifts={currentShifts}
                setCurrentShifts={setCurrentShifts}
                fetchShifts={
                    selectedStore ? () => fetchShiftsByStore(selectedStore._id) : fetchAllShifts
                }
            />
            <Dropdown
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.value)}
                options={subuserStores}
                optionLabel="storeName"
                placeholder="Выберите магазин"
                className="mb-5 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300 min-w-[220px]"
                showClear
            />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={currentShifts}
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
    );
};

export default Calendar;
