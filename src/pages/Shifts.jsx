import React from 'react';
import { EmployeesCalendar } from '../components/Accounting/Workers/EmployeesCalendar';

const Calendar = () => {
    return (
        <div className="w-[100%] pr-5 md:pr-0 pt-10 md:pt-0 md:mt-0 align-center justify-center">
            <EmployeesCalendar />
        </div>
    );
};

export default Calendar;
