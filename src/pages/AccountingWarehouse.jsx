import React, { useState } from 'react';
import ListOfExpenses from '../components/Accounting/Warehouse/ListOfExpenses';
import CollapsibleTable from '../components/Accounting/Warehouse/CollapsibleTable';
import { AddWarehouse } from '../components/Accounting/Warehouse/AddWarehouse';
import { Loader } from '../components/Loader';
import SkladBoxStats from '../components/Sklad/SkladBoxStats';
import MoveItemsSklad from '../components/Accounting/Warehouse/MoveItemsSklad';

const InternalTabs = () => {
    const [activeTab, setActiveTab] = useState('sklad');
    const isLoading = false;

    const tabs = [
        { id: 'sklad', label: 'Склад' },
        { id: 'items', label: 'Товары' },
        { id: 'actions', label: 'Действия' },
    ];

    const tabContents = {
        sklad: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mb-10 p-2">
                    <SkladBoxStats />
                    <ListOfExpenses title="Товар близок к мин остатку" />
                    <CollapsibleTable title="Не подтвержденные списания" />
                </div>
            </div>
        ),
        items: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mb-10 p-2">
                    <ListOfExpenses />
                    <CollapsibleTable />
                </div>
            </div>
        ),
        actions: (
            <div className="flex flex-col gap-3 justify-center">
                <div className="flex flex-row mb-10 p-2">
                    {/* <AddWarehouse /> */}
                    <MoveItemsSklad />
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

    // return (
    //     <div className="flex flex-col mt-10">
    //         <AddWarehouse />
    //         <ListOfExpenses />
    //         <CollapsibleTable />
    //     </div>
    // );
};

const AccountingWarehouse = () => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs />
            </div>
        </div>
    );
};

export default AccountingWarehouse;
