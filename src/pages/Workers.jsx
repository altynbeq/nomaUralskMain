import React, { useEffect, useState } from 'react';
import { WorkerStats } from '../components/Workers';
import WorkersList from '../components/demo/WorkersList';
import { WorkersShiftsStats } from '../components/Workers';

// const Workers = () => {
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);
//     return (
//         <div className="mt-12 w-[100%] flex flex-col gap-3  justify-center ">
//             <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
//                 <WorkersShiftsStats />
//             </div>
//             <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
//                 <WorkersList />
//             </div>
//             <div className="flex w-[100%] flex-wrap  gap-5 justify-center   ">
//                 <WorkerStats mainTitle="Показатели флористов" />
//             </div>
//         </div>
//     );
// };

// Internal Tabs Component

const InternalTabs = () => {
    // State to manage active tab
    const [activeTab, setActiveTab] = useState('general');

    // Configuration for internal tabs
    const tabs = [
        {
            id: 'general',
            label: 'Общая',
        },
        {
            id: 'shifts',
            label: 'Смены',
        },
        {
            id: 'sales',
            label: 'Продажи',
        },
        {
            id: 'finance',
            label: 'Финансы',
        },
    ];

    const tabContents = {
        general: (
            <div className=" flex flex-col gap-3 w-[100%]  justify-center ">
                <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
                    <WorkersList />
                </div>
                <div className="flex w-[100%] flex-wrap  gap-5 justify-center   ">
                    <WorkerStats mainTitle="Показатели флористов" />
                </div>
            </div>
        ),
        shifts: (
            <div className=" flex flex-col gap-3 max-w-screen justify-center ">
                <div className="flex max-w-screen flex-wrap  gap-5 justify-center">
                    <WorkersShiftsStats />
                </div>
                <div className="flex max-w-screen flex-wrap  gap-5 justify-center">
                    <WorkersList />
                </div>
                <div className="flex max-w-screen flex-wrap  gap-5 justify-center   ">
                    <WorkerStats mainTitle="Показатели флористов" />
                </div>
            </div>
        ),
        sales: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Продажи</h2>
                <p className="text-gray-700">Здесь будет отображаться информация о продажах.</p>
            </div>
        ),
        finance: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Финансы</h2>
                <p className="text-gray-700">Здесь будет отображаться информация о продажах.</p>
            </div>
        ),
    };

    return (
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
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
                            ${activeTab === tab.id ? 'first:rounded-tl-2xl last:rounded-tr-2xl' : ''}
                        `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-6">{tabContents[activeTab]}</div>
        </div>
    );
};

// Page Component that includes the Tabs Component
const Workers = () => {
    return (
        <div className="min-h-screen flex justify-center align-center bg-gray-100 p-6 w-[100%]">
            <div className="w-[95%]">
                <InternalTabs />
            </div>
        </div>
    );
};

export default Workers;
