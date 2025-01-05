import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // For the close icon

const ExpensesOverview = ({ expenses }) => {
    const [expandedExpenseId, setExpandedExpenseId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Handle the case where no expenses are passed
    if (!expenses || expenses.length === 0) {
        return <p>No expenses data available.</p>;
    }

    // Group expenses by month using `startDate`
    const expensesGroupedByMonth = expenses.reduce((acc, expense) => {
        const month = new Date(expense.startDate).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(expense);
        return acc;
    }, {});

    const handleDetailView = (expenseId) => {
        setExpandedExpenseId((prevId) => (prevId === expenseId ? null : expenseId));
    };

    // Calculate stats for each month
    const statsByMonth = Object.keys(expensesGroupedByMonth).map((month) => {
        const monthExpenses = expensesGroupedByMonth[month];
        const totalSpent = monthExpenses.reduce((sum, e) => sum + (e.spent || 0), 0);
        const totalBudget = monthExpenses.reduce((sum, e) => sum + (e.total || 0), 0);
        return {
            month,
            expenses: monthExpenses,
            stats: {
                totalSpent,
                totalBudget,
            },
        };
    });

    const currentMonth = new Date().toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="p-6 subtle-border">
            <h1 className="text-xl font-bold mb-6">Monthly Expenses History</h1>
            <div className="flex flex-wrap gap-6 justify-center">
                {statsByMonth.map(({ month, stats }) => (
                    <div
                        key={month}
                        className="relative subtle-border flex flex-col items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-transform cursor-pointer"
                        onClick={() => setSelectedMonth(month)}
                    >
                        <span className="text-sm font-semibold">{month}</span>
                        <div className="text-xs mt-1 text-center">
                            <p>Spent: ${stats.totalSpent?.toLocaleString() || '0'}</p>
                            <p>Budget: ${stats.totalBudget?.toLocaleString() || '0'}</p>
                        </div>
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
                            {selectedMonth} Expenses
                        </h2>
                        <ul className="space-y-3">
                            {expensesGroupedByMonth[selectedMonth].map((expense) => (
                                <li
                                    key={expense.id}
                                    className="bg-gray-50 p-4 rounded-lg shadow flex flex-col relative"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="block text-gray-800 font-semibold">
                                                {expense.name}
                                            </span>
                                            <span className="block text-sm text-gray-500">
                                                Spent: $
                                                {Number(expense.spent)?.toLocaleString() || '0'}
                                            </span>
                                            <span className="block text-sm text-gray-500">
                                                Budget: $
                                                {Number(expense.total)?.toLocaleString() || '0'}
                                            </span>
                                            <span className="block text-xs text-gray-400">
                                                {new Date(expense.startDate).toLocaleDateString()} -{' '}
                                                {new Date(expense.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            className="text-gray-400 hover:text-gray-600"
                                            onClick={() => handleDetailView(expense.id)}
                                        >
                                            {expandedExpenseId === expense.id ? '▲' : '▼'}
                                        </button>
                                    </div>

                                    {expandedExpenseId === expense.id && (
                                        <div className="mt-3 bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                                            <h4 className="font-semibold text-gray-700 mb-2">
                                                Expense Details
                                            </h4>
                                            <p>
                                                This expense has a budget of $
                                                {expense.total?.toLocaleString()} and spent $
                                                {expense.spent?.toLocaleString()}.
                                            </p>
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

export default ExpensesOverview;
