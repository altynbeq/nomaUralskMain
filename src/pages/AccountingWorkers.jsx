import React from 'react';
import { SubusersList } from '../components/Accounting/Workers/SubusersList';
import { StoreAccordion } from '../components/Accounting/Workers/StoreAccordion';
import { useStateContext } from '../contexts/ContextProvider';

const AccountingWorkers = () => {
    const { companyStructure } = useStateContext();

    return (
        <div className="w-[100%] items-center justify-center mt-10 md:mt-0">
            <div className="max-w-[100%]">
                <StoreAccordion
                    stores={companyStructure?.stores || []}
                    departments={companyStructure?.departments || []}
                />
            </div>
            <div className="w-[100%] mt-10 flex items-center justify-center">
                <SubusersList />
            </div>
            {/* <EmployeeCalendar /> */}
        </div>
    );
};

export default AccountingWorkers;
