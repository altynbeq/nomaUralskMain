import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CalendarModal from '../components/Calendar/CalendarModal';
import CalendarModalAddShift from '../components/Calendar/CalendarModalAddShift';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useStateContext } from '../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';

const Scheduler = () => {
    const { access } = useStateContext();
    const [modal, setModal] = useState(false);
    const [currentShifts, setCurrentShifts] = useState();
    const [modalAddShift, setModalAddShift] = useState(false);
    const [subuserStores, setSubuserStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [subusers, setSubusers] = useState([]);

    function openModal() {
        setModal(true);
    }
    function openModalAddShift() {
        setModalAddShift(true);
    }

    useEffect(() => {
        const id = localStorage.getItem('_id');
        if (id && access.DataManagement) {
            fetchSubuserStores(id);
        }
    }, [access.DataManagement]);

    useEffect(() => {
        if (selectedStore) {
            fetchSubusers(selectedStore._id);
            fetchShifts(selectedStore._id);
        }
    }, [selectedStore]);

    const fetchSubuserStores = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/subUsers/subuser-stores/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setSubuserStores(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchSubusers = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/subUsers/subusers/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setSubusers(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchShifts = async (storeId) => {
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
            }));
            setCurrentShifts(shifts);
        } catch (error) {
            console.error('Failed to fetch shifts:', error);
        }
    };

    // a custom render function
    function renderEventContent(eventInfo) {
        const startTime = eventInfo.event.start;
        const endTime = eventInfo.event.end;

        // Format the times as desired (e.g., "HH:mm")
        const startTimeFormatted = startTime
            ? startTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';
        const endTimeFormatted = endTime
            ? endTime.toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' })
            : '';

        return (
            <div className="bg-blue-500 cursor-pointer rounded-lg p-2 w-full" onClick={openModal}>
                <span className="md:scale-10 lg:scale-100 text-white text-xs sm:text-xs-sm md:text-xs lg:text-xs">
                    {startTimeFormatted} - {endTimeFormatted}{' '}
                </span>{' '}
                <strong className="text-white text-xs sm:text-xs-sm md:text-xs lg:text-xs">
                    {eventInfo.event.title}
                </strong>
                <br />
            </div>
        );
    }

    return (
        <div className="m-2 mb-0 p-2 pb-0  bg-white rounded-3xl">
            <Header category="Учёт" title="Смены" />
            <CalendarModal open={modal} setOpen={setModal} />
            <CalendarModalAddShift
                subusers={subusers}
                open={modalAddShift}
                setOpen={setModalAddShift}
                currentShifts={currentShifts}
                setCurrentShifts={setCurrentShifts}
            />
            <Dropdown
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.value)}
                options={subuserStores}
                optionLabel="storeName"
                placeholder="Выберите магазин"
                className="mb-5"
            />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={currentShifts}
                eventContent={renderEventContent}
                locale={ruLocale}
                firstDay={1}
                fixedWeekCount={false}
                headerToolbar={{
                    left: 'dayGridMonth,dayGridWeek,dayGridDay',
                    center: 'title',
                    right: 'customButton prev,next,today', // Add the custom button here
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

export default Scheduler;
