import React from 'react';
import { SubusersList } from '../components/Accounting/Workers/SubusersList';
import { StoreAccordion } from '../components/Accounting/Workers/StoreAccordion';
import { useCompanyStructureStore } from '../store/companyStructureStore';

const AccountingWorkers = () => {
    const stores = useCompanyStructureStore((state) => state.stores);
    const departments = useCompanyStructureStore((state) => state.departments);
    const subUsers = useCompanyStructureStore((state) => state.subUsers);
    return (
        <div className="w-[100%] items-center justify-center mt-10 md:mt-0">
            <div className="max-w-[100%]">
                <StoreAccordion stores={stores || []} departments={departments || []} />
            </div>
            <div className="w-[100%] mt-10 flex items-center justify-center">
                <SubusersList subUsers={subUsers} departments={departments} stores={stores} />
            </div>
        </div>
    );
};

export default AccountingWorkers;
