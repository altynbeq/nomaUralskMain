import React, { useState, useEffect } from 'react';
import { Loader } from '../components/Loader';
import { useAuthStore } from '../store/authStore';
import BudgetManagement from '../components/Accounting/Expenses/BudgetManagement';
import BudgetOverview from '../components/Accounting/Expenses/BudgetOverview';
import LatestExpenses from '../components/Accounting/Expenses/LatestExpenses';
import ExpensesOverview from '../components/Accounting/Expenses/ExpensesOverview';

const InternalTabs = () => {
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const [isLoading, setIsLoading] = useState(false);
    const [writeOffs, setWriteOffs] = useState([]);

    const [activeTab, setActiveTab] = useState('expenses');

    const tabs = [
        { id: 'expenses', label: 'Затраты' },
        { id: 'budget', label: 'Бюджет' },
        { id: 'history', label: 'История' },
    ];
    const sampleBudgets = [
        { id: 1, name: 'Marketing', total: 5000, spent: 4500, startDate: '2025-01-05' },
        { id: 2, name: 'Operations', total: 3000, spent: 2800, startDate: '2025-01-15' },
        { id: 3, name: 'R&D', total: 4000, spent: 4500, startDate: '2025-02-10' },
        { id: 4, name: 'HR', total: 2500, spent: 500, startDate: '2025-02-20' },
        { id: 5, name: 'Sales', total: 6000, spent: 6200, startDate: '2025-03-05' },
        { id: 6, name: 'Admin', total: 1800, spent: 1700, startDate: '2025-03-15' },
        { id: 7, name: 'Marketing', total: 5000, spent: 4900, startDate: '2025-04-08' },
        { id: 8, name: 'Logistics', total: 4000, spent: 4100, startDate: '2025-04-20' },
        { id: 9, name: 'IT', total: 4500, spent: 4300, startDate: '2025-05-12' },
        { id: 10, name: 'Operations', total: 3200, spent: 3100, startDate: '2025-05-25' },
        { id: 11, name: 'Marketing', total: 5200, spent: 5100, startDate: '2025-06-05' },
        { id: 12, name: 'HR', total: 2700, spent: 2600, startDate: '2025-06-15' },
        { id: 13, name: 'Sales', total: 7000, spent: 6800, startDate: '2025-07-10' },
        { id: 14, name: 'R&D', total: 4000, spent: 4200, startDate: '2025-07-25' },
        { id: 15, name: 'Admin', total: 1900, spent: 1800, startDate: '2025-08-05' },
        { id: 16, name: 'IT', total: 4600, spent: 4400, startDate: '2025-08-18' },
        { id: 17, name: 'Marketing', total: 5500, spent: 5300, startDate: '2025-09-10' },
        { id: 18, name: 'Operations', total: 3500, spent: 3400, startDate: '2025-09-25' },
        { id: 19, name: 'Logistics', total: 3800, spent: 3700, startDate: '2025-10-05' },
        { id: 20, name: 'Sales', total: 7500, spent: 7400, startDate: '2025-10-18' },
        { id: 21, name: 'HR', total: 2800, spent: 2600, startDate: '2025-11-05' },
        { id: 22, name: 'Marketing', total: 5800, spent: 5700, startDate: '2025-11-15' },
        { id: 23, name: 'R&D', total: 4500, spent: 4600, startDate: '2025-12-05' },
        { id: 24, name: 'IT', total: 4900, spent: 4800, startDate: '2025-12-18' },
    ];
    const dummyExpenses = [
        {
            id: 1,
            name: 'Office Supplies',
            total: 2000,
            spent: 1500,
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-31T23:59:59Z',
        },
        {
            id: 2,
            name: 'Marketing Campaigns',
            total: 5000,
            spent: 4500,
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-31T23:59:59Z',
        },
        {
            id: 3,
            name: 'Travel Expenses',
            total: 3000,
            spent: 2700,
            startDate: '2025-02-01T00:00:00Z',
            endDate: '2025-02-28T23:59:59Z',
        },
        {
            id: 4,
            name: 'Employee Training',
            total: 1500,
            spent: 1200,
            startDate: '2025-02-01T00:00:00Z',
            endDate: '2025-02-28T23:59:59Z',
        },
        {
            id: 5,
            name: 'Utilities',
            total: 1000,
            spent: 1100, // Overspent
            startDate: '2025-03-01T00:00:00Z',
            endDate: '2025-03-31T23:59:59Z',
        },
        {
            id: 6,
            name: 'Research Materials',
            total: 4000,
            spent: 3900,
            startDate: '2025-03-01T00:00:00Z',
            endDate: '2025-03-31T23:59:59Z',
        },
    ];

    const tabContents = {
        expenses: (
            <div className="flex flex-col gap-3 justify-center">
                <LatestExpenses />
                <ExpensesOverview expenses={dummyExpenses} />
            </div>
        ),
        budget: (
            <div className="flex flex-col gap-10 justify-center">
                <BudgetManagement />
                <BudgetOverview budgets={sampleBudgets} />
            </div>
        ),
        history: <div className="flex flex-col gap-3 justify-center"></div>,
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

const AccountingExpenses = () => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs />
            </div>
        </div>
    );
};

export default AccountingExpenses;
