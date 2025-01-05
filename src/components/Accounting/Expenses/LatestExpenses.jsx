import React, { useState } from 'react';
import {
    FaCheck,
    FaTimes,
    FaAngleDown,
    FaAngleUp,
    FaClock,
    FaChevronRight,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaChevronLeft,
    FaPlus,
    FaTimesCircle,
} from 'react-icons/fa';

// Mock helper functions/data
function getStatusBadge(status) {
    switch (status) {
        case 'pending':
            return 'Ожидание';
        case 'approved':
            return 'Подтверждено';
        case 'rejected':
            return 'Отклонено';
        default:
            return 'Неизвестно';
    }
}

function handleRowClick(transaction) {
    console.log('Row clicked:', transaction);
}

const initialTransactions = [
    {
        id: 1,
        transactionId: 'TX-2024-001',
        amount: 500,
        date: '2024-12-20',
        status: 'pending',
        description: 'Payment for warehouse 1',
    },
    {
        id: 2,
        transactionId: 'TX-2024-002',
        amount: 1000,
        date: '2024-12-19',
        status: 'approved',
        description: 'Payment for warehouse 2',
    },
    {
        id: 3,
        transactionId: 'TX-2024-003',
        amount: 300,
        date: '2024-12-18',
        status: 'rejected',
        description: 'Payment for warehouse 3',
    },
];

// Custom Components

const Card = ({ className = '', children }) => (
    <div className={`rounded-lg border border-gray-200 bg-white shadow ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const CardContent = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ variant = 'default', size = 'md', className = '', children, ...props }) => {
    let baseClasses =
        'inline-flex items-center justify-center rounded-md border border-transparent font-medium transition-colors focus:outline-none';
    let variantClasses = '';
    switch (variant) {
        case 'outline':
            variantClasses = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
            break;
        case 'default':
        default:
            variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
            break;
    }
    let sizeClasses = '';
    switch (size) {
        case 'sm':
            sizeClasses = 'px-2 py-1 text-sm';
            break;
        default:
            sizeClasses = 'px-4 py-2';
            break;
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ className = '', ...props }) => (
    <input
        className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-700 focus:ring-blue-700 focus:outline-none ${className}`}
        {...props}
    />
);

const Badge = ({ className = '', children }) => (
    <span
        className={`inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-800 ${className}`}
    >
        {children}
    </span>
);

// Custom Modal component
const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="relative z-50 bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
                <div className="absolute top-3 right-3 cursor-pointer" onClick={onClose}>
                    <FaTimesCircle className="text-gray-500 h-6 w-6" />
                </div>
                {children}
            </div>
        </div>
    );
};

const LatestExpenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [newTransaction, setNewTransaction] = useState({
        transactionId: '',
        amount: '',
        date: '',
        status: 'pending',
        description: '',
    });

    const itemsPerPage = 10;
    const [transactions, setTransactions] = useState(initialTransactions);

    const openModalWithTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleAddTransaction = () => {
        const newTransactionData = {
            ...newTransaction,
            id: transactions.length + 1,
            date: new Date().toLocaleDateString(),
        };
        setTransactions((prev) => [...prev, newTransactionData]);
        setAddTransactionModalOpen(false);
        setNewTransaction({
            transactionId: '',
            amount: '',
            date: '',
            status: 'pending',
            description: '',
        });
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !startDate || transaction.date === startDate;
        return matchesSearch && matchesDate;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <Card className="w-full bg-white subtle-border ">
            <CardHeader className="border-b flex flex-row justify-between border-gray-200">
                <div>
                    <div className="flex items-center justify-between">
                        <CardTitle>Последние транзакции</CardTitle>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px] relative">
                            <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Поиск по номеру транзакции или описанию..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="date"
                                    className="pl-10"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2 whitespace-nowrap"
                            >
                                <FaFilter className="w-4 h-4" />
                                Фильтры
                            </Button>

                            {/* New Transaction Button */}
                            <Button
                                variant="default"
                                onClick={() => setAddTransactionModalOpen(true)}
                                className="flex items-center gap-2 ml-auto"
                            >
                                <FaPlus className="w-4 h-4" />
                                Новая транзакция
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Номер транзакции
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Сумма
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Дата
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Статус
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Подробности
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openModalWithTransaction(transaction)}
                                >
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {transaction.transactionId}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                        {transaction.amount}₽
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        <Badge className="font-normal">
                                            {getStatusBadge(transaction.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-blue-700">
                                        <div className="flex items-center">
                                            Просмотреть
                                            <FaChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Показано {(currentPage - 1) * itemsPerPage + 1} -{' '}
                        {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} из{' '}
                        {filteredTransactions.length} транзакций
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center"
                        >
                            <FaChevronLeft className="w-4 h-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                const distance = Math.abs(page - currentPage);
                                return (
                                    distance === 0 ||
                                    distance === 1 ||
                                    page === 1 ||
                                    page === totalPages
                                );
                            })
                            .map((page, index, array) => {
                                const prevPage = array[index - 1];
                                const shouldShowEllipsis = prevPage && page - prevPage > 1;
                                return (
                                    <React.Fragment key={page}>
                                        {shouldShowEllipsis && <span className="px-2">...</span>}
                                        <Button
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className="w-8"
                                        >
                                            {page}
                                        </Button>
                                    </React.Fragment>
                                );
                            })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center"
                        >
                            <FaChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* Add New Transaction Modal */}
            <Modal open={addTransactionModalOpen} onClose={() => setAddTransactionModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Добавить новую транзакцию
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div>
                            <label className="block text-gray-900">Номер транзакции</label>
                            <Input
                                value={newTransaction.transactionId}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        transactionId: e.target.value,
                                    })
                                }
                                placeholder="TX-2024-..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-900">Сумма</label>
                            <Input
                                type="number"
                                value={newTransaction.amount}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-900">Описание</label>
                            <Input
                                value={newTransaction.description}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Описание транзакции"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setAddTransactionModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleAddTransaction}>Добавить</Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default LatestExpenses;
