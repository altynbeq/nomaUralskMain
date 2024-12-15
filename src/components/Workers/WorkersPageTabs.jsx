// import React, { useState } from 'react';
// import Workers from '../../pages/Workers';
// import WorkerStats from '../../components/Workers'

// // Internal Tabs Component
// const InternalTabs = () => {
//     // State to manage active tab
//     const [activeTab, setActiveTab] = useState('details');

//     // Configuration for internal tabs
//     const tabs = [
//         { id: 'general', label: 'Общая' },
//         { id: 'shifts', label: 'Смены' },
//         { id: 'sales', label: 'Продажи' },
//     ];

//     const tabContents = {
//         general: (
//             <div>
//                 <h2 className="text-2xl font-bold mb-4">Общая Информация</h2>
//                 <p className="text-gray-700">Здесь будет отображаться общая информация.</p>
//             </div>
//         ),
//         shifts: (
//                 <div className="mt-12 w-[100%] flex flex-col gap-3  justify-center ">
//                     <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
//                         <WorkersShiftsStats />
//                     </div>
//                     <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
//                         <WorkersList />
//                     </div>
//                     <div className="flex w-[100%] flex-wrap  gap-5 justify-center   ">
//                         <WorkerStats mainTitle="Показатели флористов" />
//                     </div>
//                 </div>
//         ),
//         sales: (
//             <div>
//                 <h2 className="text-2xl font-bold mb-4">Продажи</h2>
//                 <p className="text-gray-700">Здесь будет отображаться информация о продажах.</p>
//             </div>
//         ),
//     };

//     return (
//         <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
//             {/* Internal Tab Navigation */}
//             <div className="border-b border-gray-300">
//                 <nav className="flex">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`
//                             flex-1 py-3 px-3 text-center transition-colors duration-300
//                             ${
//                                 activeTab === tab.id
//                                     ? 'bg-black text-white font-semibold'
//                                     : 'hover:bg-gray-100 text-gray-600'
//                             }
//                             ${activeTab === tab.id ? 'first:rounded-tl-2xl last:rounded-tr-2xl' : ''}
//                         `}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </nav>
//             </div>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-4">{tabContents[activeTab].heading}</h2>
//                 <p className="text-gray-700">{tabContents[activeTab].content}</p>
//             </div>
//         </div>
//     );
// };

// // Page Component that includes the Tabs Component
// const WorkerPageTabs = () => {
//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-4xl mx-auto">
//                 <InternalTabs />
//             </div>
//         </div>
//     );
// };

// export default WorkerPageTabs;
