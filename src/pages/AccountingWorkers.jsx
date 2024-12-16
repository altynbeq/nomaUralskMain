import React, { useState } from 'react';
import { SubusersList } from '../components/Accounting/Workers/SubusersList';
import { StoreAccordion } from '../components/Accounting/Workers/StoreAccordion';
import { useCompanyStructureStore } from '../store/companyStructureStore';
import { Loader } from '../components/Loader';

const InternalTabs = () => {
    const [activeTab, setActiveTab] = useState('stores');

    const stores = useCompanyStructureStore((state) => state.stores);
    const departments = useCompanyStructureStore((state) => state.departments);
    const subUsers = useCompanyStructureStore((state) => state.subUsers);

    // Проверка загрузки данных
    const isLoading = stores.length === 0 || departments.length === 0 || subUsers.length === 0;

    const tabs = [
        { id: 'stores', label: 'Магазины' },
        { id: 'workers', label: 'Сотрудники' },
    ];

    const tabContents = {
        stores: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mb-10 p-2">
                    <StoreAccordion stores={stores || []} departments={departments || []} />
                </div>
            </div>
        ),
        workers: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mt-10 flex items-center justify-center">
                    <SubusersList subUsers={subUsers} departments={departments} stores={stores} />
                </div>
            </div>
        ),
    };

    return (
        <div className="bg-white border-2 max-w-screen border-gray-300 rounded-2xl overflow-hidden">
            {/* Internal Tab Navigation */}
            <div className="border-b border-gray-300">
                <nav className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 py-3 px-3 text-center transition-colors duration-300
                                ${
                                    activeTab === tab.id
                                        ? 'bg-blue-800 text-white font-semibold'
                                        : 'hover:bg-gray-100 text-gray-600'
                                }
                                ${
                                    activeTab === tab.id
                                        ? 'first:rounded-tl-2xl last:rounded-tr-2xl'
                                        : ''
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Loader or Content */}
            <div className="p-2 relative min-h-[300px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                        <Loader />
                    </div>
                ) : (
                    tabContents[activeTab]
                )}
            </div>
        </div>
    );
};

const AccountingWorkers = () => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs />
            </div>
        </div>
    );
};

export default AccountingWorkers;
