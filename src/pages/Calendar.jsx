import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CalendarModal from '../components/Calendar/CalendarModal';
import CalendarModalAddShift from '../components/Calendar/CalendarModalAddShift';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useStateContext } from '../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';

const events = [
    { title: 'Петров', start: new Date(2024, 9, 1, 9, 0), end: new Date(2024, 9, 1, 17, 0) },
    { title: 'Сидоров', start: new Date(2024, 9, 2, 10, 0), end: new Date(2024, 9, 2, 18, 0) },

    // October 4th (Friday) - 10 workers scheduled
    { title: 'Иванов', start: new Date(2024, 9, 4, 7, 0), end: new Date(2024, 9, 4, 15, 0) },
    { title: 'Смирнов', start: new Date(2024, 9, 4, 8, 0), end: new Date(2024, 9, 4, 16, 0) },
    { title: 'Кузнецов', start: new Date(2024, 9, 4, 9, 0), end: new Date(2024, 9, 4, 17, 0) },
    { title: 'Попов', start: new Date(2024, 9, 4, 10, 0), end: new Date(2024, 9, 4, 18, 0) },
    { title: 'Васильев', start: new Date(2024, 9, 4, 11, 0), end: new Date(2024, 9, 4, 19, 0) },
    { title: 'Новиков', start: new Date(2024, 9, 4, 12, 0), end: new Date(2024, 9, 4, 20, 0) },
    { title: 'Морозов', start: new Date(2024, 9, 4, 13, 0), end: new Date(2024, 9, 4, 21, 0) },
    { title: 'Алексеев', start: new Date(2024, 9, 4, 14, 0), end: new Date(2024, 9, 4, 22, 0) },
    { title: 'Федоров', start: new Date(2024, 9, 4, 15, 0), end: new Date(2024, 9, 4, 23, 0) },
    { title: 'Михайлов', start: new Date(2024, 9, 4, 16, 0), end: new Date(2024, 9, 5, 0, 0) },

    // Other weekdays with random workers
    { title: 'Сергеев', start: new Date(2024, 9, 7, 7, 0), end: new Date(2024, 9, 7, 15, 0) },
    { title: 'Зайцев', start: new Date(2024, 9, 7, 10, 0), end: new Date(2024, 9, 7, 18, 0) },

    { title: 'Крылов', start: new Date(2024, 9, 9, 9, 0), end: new Date(2024, 9, 9, 17, 0) },
    { title: 'Борисов', start: new Date(2024, 9, 9, 13, 0), end: new Date(2024, 9, 9, 21, 0) },
    { title: 'Киселёв', start: new Date(2024, 9, 9, 11, 0), end: new Date(2024, 9, 9, 19, 0) },

    { title: 'Григорьев', start: new Date(2024, 9, 11, 8, 0), end: new Date(2024, 9, 11, 16, 0) },
    { title: 'Павлов', start: new Date(2024, 9, 11, 9, 30), end: new Date(2024, 9, 11, 17, 30) },
    { title: 'Степанов', start: new Date(2024, 9, 11, 13, 0), end: new Date(2024, 9, 11, 21, 0) },

    { title: 'Савельев', start: new Date(2024, 9, 14, 11, 0), end: new Date(2024, 9, 14, 19, 0) },
    { title: 'Орлов', start: new Date(2024, 9, 14, 8, 30), end: new Date(2024, 9, 14, 16, 30) },

    { title: 'Романов', start: new Date(2024, 9, 16, 10, 0), end: new Date(2024, 9, 16, 18, 0) },
    { title: 'Громов', start: new Date(2024, 9, 16, 7, 30), end: new Date(2024, 9, 16, 15, 30) },
    { title: 'Смоляков', start: new Date(2024, 9, 16, 12, 0), end: new Date(2024, 9, 16, 20, 0) },

    { title: 'Лебедев', start: new Date(2024, 9, 18, 9, 0), end: new Date(2024, 9, 18, 17, 0) },
    { title: 'Тихомиров', start: new Date(2024, 9, 18, 14, 0), end: new Date(2024, 9, 18, 22, 0) },

    { title: 'Филатов', start: new Date(2024, 9, 21, 8, 0), end: new Date(2024, 9, 21, 16, 0) },
    { title: 'Беляев', start: new Date(2024, 9, 21, 9, 30), end: new Date(2024, 9, 21, 17, 30) },

    { title: 'Пономарев', start: new Date(2024, 9, 23, 10, 0), end: new Date(2024, 9, 23, 18, 0) },
    { title: 'Макаров', start: new Date(2024, 9, 23, 12, 0), end: new Date(2024, 9, 23, 20, 0) },

    { title: 'Шевченко', start: new Date(2024, 9, 25, 11, 0), end: new Date(2024, 9, 25, 19, 0) },
    { title: 'Волков', start: new Date(2024, 9, 25, 8, 0), end: new Date(2024, 9, 25, 16, 0) },

    { title: 'Ершов', start: new Date(2024, 9, 28, 10, 0), end: new Date(2024, 9, 28, 18, 0) },
    { title: 'Копылов', start: new Date(2024, 9, 28, 7, 30), end: new Date(2024, 9, 28, 15, 30) },
    { title: 'Суханов', start: new Date(2024, 9, 28, 13, 0), end: new Date(2024, 9, 28, 21, 0) },
];

const Scheduler = () => {
    const { access } = useStateContext();
    const [modal, setModal] = useState(false);
    const [currentShifts, setCurrentShifts] = useState(events);
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
            fetchStructure(id);
        }
    }, [access.DataManagement]);

    useEffect(() => {
        if (selectedStore) {
            fetchSubusers(selectedStore._id);
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

    const handleStoreChange = async (e) => {
        setSelectedStore(subuserStores.find((i) => i.storeName === e));
    };

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
                onChange={(e) => handleStoreChange(e.value)}
                options={subuserStores.map((i) => i.storeName)}
                optionLabel="name"
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
