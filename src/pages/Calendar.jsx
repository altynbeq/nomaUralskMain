import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleWithEdit } from '../components/Calendar/CalendarModal';
import { AddShift } from '../components/Calendar/AddShift';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useStateContext } from '../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';
import AlertModal from '../components/AlertModal';
import { isValidDepartmentId } from '../methods/isValidDepartmentId';
import { EmployeeCalendar } from '../components/Accounting/Workers/EmployeeCalendar';

const Calendar = () => {
    const { access } = useStateContext();
    const [modal, setModal] = useState(false);
    const [currentShifts, setCurrentShifts] = useState([]);
    const [modalAddShift, setModalAddShift] = useState(false);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [subusers, setSubusers] = useState([]);
    const [selectedShiftId, setSelectedShiftId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    function openModal() {
        setModal(true);
    }
    function openModalAddShift() {
        if (selectedStore) {
            setModalAddShift(true);
        } else {
            setAlertOpen(true);
        }
    }

    useEffect(() => {
        const id = localStorage.getItem('_id');
        const departmentId = localStorage.getItem('departmentId');
        if (isValidDepartmentId(departmentId)) {
            if (id && access.DataManagement) {
                fetchStructure(id);
            }
        } else {
            fetchUserStructure(id);
        }
    }, [access.DataManagement]);

    useEffect(() => {
        if (selectedStore) {
            fetchSubusers(selectedStore._id);
            fetchShiftsByStore(selectedStore._id);
        } else {
            setCurrentShifts([]);
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
            setStores(data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        }
    };

    const fetchUserStructure = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/structure/get-structure-by-userId/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setStores(data.stores);
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchSubusers = async () => {
        let companyId;
        const departmentId = localStorage.getItem('departmentId');
        if (isValidDepartmentId(departmentId)) {
            companyId = localStorage.getItem('companyId');
        } else {
            companyId = localStorage.getItem('_id');
        }
        const url = `https://nomalytica-back.onrender.com/api/subusers/subusers-by-company/${companyId}`;
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
                    selectedStore={selectedStore}
                    open={modal}
                    setOpen={setModal}
                    shiftId={selectedShiftId}
                    fetchShifts={() => fetchShiftsByStore(selectedStore._id)}
                />
                <AddShift
                    selectedStore={selectedStore}
                    subusers={subusers}
                    open={modalAddShift}
                    setOpen={setModalAddShift}
                    currentShifts={currentShifts}
                    setCurrentShifts={setCurrentShifts}
                    fetchShifts={() => fetchShiftsByStore(selectedStore._id)}
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
            <div className="flex ml-5 mt-10 w-[90%] md:ml-0 md:w-[100%] subtle-border">
                <EmployeeCalendar />
            </div>
        </div>
    );
};

export default Calendar;
