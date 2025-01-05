import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // For the close icon

const BudgetOverview = ({ budgets }) => {
    const [expandedBudgetId, setExpandedBudgetId] = useState(null);

    const budgetsGroupedByMonth = budgets.reduce((acc, budget) => {
        const month = new Date(budget.startDate).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(budget);
        return acc;
    }, {});

    const [selectedMonth, setSelectedMonth] = useState(null);

    const handleTransactionView = (budgetId) => {
        setExpandedBudgetId((prevId) => (prevId === budgetId ? null : budgetId));
    };

    const statsByMonth = Object.keys(budgetsGroupedByMonth).map((month) => {
        const monthBudgets = budgetsGroupedByMonth[month];
        const total = monthBudgets.reduce((sum, b) => sum + b.total, 0);
        const spent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);
        const remaining = total - spent;
        const overspending = spent > total;
        return { month, budgets: monthBudgets, stats: { total, spent, remaining, overspending } };
    });

    // Dummy transactions data for each budget
    const getDummyTransactions = (budgetId) => {
        const transactions = {
            1: [
                { date: '2025-01-06', amount: 1500, description: 'Google Ads Campaign' },
                { date: '2025-01-12', amount: 2000, description: 'Facebook Ads' },
                { date: '2025-01-20', amount: 1000, description: 'SEO Services' },
            ],
            2: [
                { date: '2025-01-17', amount: 1500, description: 'Office Supplies' },
                { date: '2025-01-25', amount: 1300, description: 'Staff Salaries' },
            ],
            3: [
                { date: '2025-02-03', amount: 1000, description: 'Prototype Development' },
                { date: '2025-02-10', amount: 500, description: 'Software Licenses' },
            ],
            4: [
                { date: '2025-03-05', amount: 1000, description: 'Research Materials' },
                { date: '2025-03-12', amount: 1500, description: 'Prototype Testing' },
            ],
        };
        return transactions[budgetId] || [];
    };

    const currentMonth = new Date().toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="p-6 subtle-border">
            <h1 className="text-xl font-bold mb-6">Monthly Budget Overview</h1>
            <div className="flex flex-wrap gap-6 justify-center">
                {statsByMonth.map(({ month, stats }) => (
                    <div
                        key={month}
                        className="relative subtle-border flex flex-col items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-transform cursor-pointer"
                        onClick={() => setSelectedMonth(month)}
                    >
                        <span className="text-sm font-semibold">{month}</span>
                        <div className="text-xs mt-1 text-center">
                            <p>Total: ${stats.total.toLocaleString()}</p>
                            <p>Spent: ${stats.spent.toLocaleString()}</p>
                        </div>
                        {stats.overspending && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                                Overspent!
                            </div>
                        )}
                        {month === currentMonth && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded-full">
                                Current
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedMonth && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setSelectedMonth(null)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            onClick={() => setSelectedMonth(null)}
                        >
                            <FaTimes size={18} />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-700">
                            {selectedMonth} Overview
                        </h2>
                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Total Progress
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className={`h-4 rounded-full ${
                                            statsByMonth.find((s) => s.month === selectedMonth)
                                                .stats.overspending
                                                ? 'bg-red-500'
                                                : 'bg-blue-500'
                                        }`}
                                        style={{
                                            width: `${
                                                (statsByMonth.find((s) => s.month === selectedMonth)
                                                    .stats.spent /
                                                    statsByMonth.find(
                                                        (s) => s.month === selectedMonth,
                                                    ).stats.total) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-gray-500">
                                    <span>
                                        Allocated: $
                                        {statsByMonth
                                            .find((s) => s.month === selectedMonth)
                                            .stats.total.toLocaleString()}
                                    </span>
                                    <span>
                                        Spent: $
                                        {statsByMonth
                                            .find((s) => s.month === selectedMonth)
                                            .stats.spent.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            {statsByMonth.find((s) => s.month === selectedMonth).stats
                                .overspending && (
                                <div className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    Overspending Detected!
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Budgets</h3>
                        <ul className="space-y-3">
                            {budgetsGroupedByMonth[selectedMonth].map((budget) => (
                                <li
                                    key={budget.id}
                                    className="bg-gray-50 p-4 rounded-lg shadow flex flex-col relative"
                                >
                                    {/* Overspent label on individual budget */}
                                    {budget.spent > budget.total && (
                                        <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                                            Overspent!
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="block text-gray-800 font-semibold">
                                                {budget.name}
                                            </span>
                                            <span className="block text-sm text-gray-500">
                                                ${budget.spent.toLocaleString()} / $
                                                {budget.total.toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            className="text-gray-400 hover:text-gray-600"
                                            onClick={() => handleTransactionView(budget.id)}
                                        >
                                            {expandedBudgetId === budget.id ? '▲' : '▼'}
                                        </button>
                                    </div>

                                    {/* Expandable transaction history */}
                                    {expandedBudgetId === budget.id && (
                                        <div className="mt-3 bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                                            <h4 className="font-semibold text-gray-700 mb-2">
                                                Transaction History
                                            </h4>
                                            <ul className="space-y-2">
                                                {getDummyTransactions(budget.id).map(
                                                    (transaction, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex justify-between text-sm"
                                                        >
                                                            <span>{transaction.date}</span>
                                                            <span>{transaction.description}</span>
                                                            <span className="font-semibold">
                                                                $
                                                                {transaction.amount.toLocaleString()}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetOverview;
