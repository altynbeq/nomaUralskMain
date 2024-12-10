import React from 'react';
import { Header } from '../components';
import { EmployeeCalendar } from '../components/Accounting/Workers/EmployeeCalendar';
import { useCompanyStructureStore } from '../store/companyStructureStore';

const Calendar = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    const subUsers = useCompanyStructureStore((state) => state.subUsers);
    const departments = useCompanyStructureStore((state) => state.departments);

    return (
        <div className="w-[100%] align-center justify-center">
            {/* <div className=" mt-20 md:mt-0 mb-0 p-4 pb-0 bg-white rounded-3xl subtle-border m-5"> */}
            {/* <Header category="Учёт" title="Смены" /> */}
            <EmployeeCalendar stores={stores} departments={departments} subUsers={subUsers} />
            {/* </div> */}
        </div>
    );
};

export default Calendar;
