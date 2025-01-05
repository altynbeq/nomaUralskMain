import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles =
        'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />
                <div className="relative z-50 w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

const BudgetManagement = () => {
    const [budgets, setBudgets] = useState([
        {
            id: 1,
            name: 'Marketing Q1',
            total: 100000,
            spent: 68000,
            remaining: 32000,
            department: 'Marketing',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            isDraft: false,
        },
        {
            id: 2,
            name: 'R&D Projects',
            total: 150000,
            spent: 45000,
            remaining: 105000,
            department: 'Research',
            startDate: '2025-01-01',
            endDate: '2025-06-30',
            isDraft: false,
        },
        {
            id: 3,
            name: 'Operations Q1',
            total: 75000,
            spent: 30000,
            remaining: 45000,
            department: 'Operations',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            isDraft: false,
        },
    ]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState({
        name: '',
        total: '',
        department: '',
        dateRange: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBudget((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateBudget = (isDraft) => {
        if (!newBudget.name || !newBudget.total || !newBudget.department || !newBudget.dateRange) {
            alert('Please fill in all fields.');
            return;
        }

        const [startDate, endDate] = newBudget.dateRange;

        const newEntry = {
            id: budgets.length + 1,
            name: newBudget.name,
            total: parseFloat(newBudget.total),
            spent: 0,
            remaining: parseFloat(newBudget.total),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            department: newBudget.department,
            isDraft,
        };

        setBudgets((prev) => [...prev, newEntry]);
        setNewBudget({
            name: '',
            total: '',
            department: '',
            dateRange: null,
        });
        setIsCreateModalOpen(false);
    };

    const handleConfirmBudget = (id) => {
        setBudgets((prev) =>
            prev.map((budget) => (budget.id === id ? { ...budget, isDraft: false } : budget)),
        );
    };

    const [isModified, setIsModified] = useState(false);

    const handleFieldChange = (field, value) => {
        setIsModified(true);
        setSelectedBudget((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleConfirmBudgetChange = () => {
        // Handle budget confirmation logic here
        setIsDetailsModalOpen(false);
        setIsModified(false); // Reset modification state
    };

    return (
        <div className="p-6 subtle-border">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Budget Management</h1>
                <Button className="flex flex-row" onClick={() => setIsCreateModalOpen(true)}>
                    <AiOutlinePlus className="w-4 h-4 mr-2" />
                    New Budget
                </Button>
            </div>

            {/* Budget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...budgets.filter((b) => b.isDraft), ...budgets.filter((b) => !b.isDraft)].map(
                    (budget) => (
                        <div
                            key={budget.id}
                            className={`bg-white subtle-border rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                                budget.isDraft ? 'border-l-4 border-yellow-500' : ''
                            }`}
                            onClick={() => {
                                setSelectedBudget(budget);
                                setIsDetailsModalOpen(true);
                            }}
                        >
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                {budget.name}
                                {budget.isDraft && (
                                    <span className="ml-2 text-yellow-500 text-sm">(Draft)</span>
                                )}
                            </h3>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-blue-600"
                                    style={{
                                        width: `${(budget.spent / budget.total) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total: ${budget.total.toLocaleString()}</span>
                                <span>Spent: ${budget.spent.toLocaleString()}</span>
                                <span>Remaining: ${budget.remaining.toLocaleString()}</span>
                            </div>
                        </div>
                    ),
                )}
            </div>

            {/* Create Budget Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <h2 className="text-xl font-semibold mb-4">Create New Budget</h2>
                <div className="space-y-4">
                    {/* Budget Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Budget Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={newBudget.name}
                            onChange={handleInputChange}
                            placeholder="Enter budget name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Amount and Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="total"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Total Amount
                            </label>
                            <input
                                id="total"
                                name="total"
                                value={newBudget.total}
                                onChange={handleInputChange}
                                placeholder="Enter amount"
                                type="number"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="department"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={newBudget.department}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>
                                    Select Department
                                </option>
                                <option value="Marketing">Marketing</option>
                                <option value="Research">Research</option>
                                <option value="Operations">Operations</option>
                                <option value="HR">HR</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label
                            htmlFor="dateRange"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Select Start and End Date
                        </label>
                        <Calendar
                            id="dateRange"
                            value={newBudget.dateRange}
                            onChange={(e) =>
                                setNewBudget((prev) => ({ ...prev, dateRange: e.value }))
                            }
                            selectionMode="range"
                            placeholder="Select date range"
                            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            inputClassName="w-full px-4 py-2"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleCreateBudget(false)}>Create</Button>
                        <Button onClick={() => handleCreateBudget(true)} variant="secondary">
                            Save as Draft
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Budget Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                {selectedBudget && (
                    <div>
                        <h2 className="text-xl font-semibold">Edit Budget</h2>

                        {/* Budget Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Budget Name
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                value={selectedBudget.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                            />
                        </div>

                        {/* Total and Department in one row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Total */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Total
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedBudget.total}
                                    onChange={(e) => handleFieldChange('total', e.target.value)}
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <select
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedBudget.department}
                                    onChange={(e) =>
                                        handleFieldChange('department', e.target.value)
                                    }
                                >
                                    <option value="Marketing">Marketing</option>
                                    <option value="Research">Research</option>
                                    <option value="Operations">Operations</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        {/* Spent and Remaining in one row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Spent */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Spent
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedBudget.spent}
                                    onChange={(e) => handleFieldChange('spent', e.target.value)}
                                />
                            </div>

                            {/* Remaining */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Remaining
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedBudget.remaining}
                                    onChange={(e) => handleFieldChange('remaining', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Calendar for Start and End Date */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Date Range
                            </label>
                            <Calendar
                                value={
                                    selectedBudget.startDate
                                        ? [
                                              new Date(selectedBudget.startDate),
                                              new Date(selectedBudget.endDate),
                                          ]
                                        : null
                                }
                                onChange={(e) => {
                                    if (e.value && e.value.length === 2) {
                                        handleFieldChange(
                                            'startDate',
                                            e.value[0].toISOString().split('T')[0],
                                        );
                                        handleFieldChange(
                                            'endDate',
                                            e.value[1].toISOString().split('T')[0],
                                        );
                                    }
                                }}
                                selectionMode="range"
                                placeholder="Select date range"
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        {/* Buttons in one row */}
                        <div className="flex justify-end space-x-4 mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDetailsModalOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={handleConfirmBudgetChange}
                                disabled={!isModified} // Disable the button if no changes are made
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BudgetManagement;
