import React from 'react';
import { EmployeeCalendar } from '../components/Accounting/Workers/EmployeeCalendar';
import { useCompanyStructureStore } from '../store/companyStructureStore';

const Calendar = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    const subUsers = useCompanyStructureStore((state) => state.subUsers);
    const departments = useCompanyStructureStore((state) => state.departments);

    return (
        <div className="w-[100%] align-center justify-center">
            <EmployeeCalendar stores={stores} departments={departments} subUsers={subUsers} />
        </div>
    );
};

export default Calendar;
