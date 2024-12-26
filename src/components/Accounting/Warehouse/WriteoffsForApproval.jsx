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

function handleRowClick(submission) {
    console.log('Row clicked:', submission);
}

const initialSubmissions = [
    {
        id: 1,
        warehouseName: 'Склад 1',
        submissionNumber: 'WO-2024-001',
        requestedBy: 'Иван Иванов',
        date: '2024-12-20',
        status: 'pending',
        items: [{ id: 1, name: 'Item A', quantity: 10, reason: 'Broken' }],
    },
    {
        id: 2,
        warehouseName: 'Склад 2',
        submissionNumber: 'WO-2024-002',
        requestedBy: 'Петр Петров',
        date: '2024-12-19',
        status: 'approved',
        items: [{ id: 2, name: 'Item B', quantity: 5, reason: 'Expired' }],
    },
    {
        id: 3,
        warehouseName: 'Склад 3',
        submissionNumber: 'WO-2024-003',
        requestedBy: 'Ольга Смирнова',
        date: '2024-12-18',
        status: 'rejected',
        items: [{ id: 3, name: 'Item C', quantity: 2, reason: 'Damaged' }],
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
                {children}
            </div>
        </div>
    );
};

const WriteoffsForApproval = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);
    const itemsPerPage = 10;

    // Sample data with pagination
    const [submissions] = useState(() => {
        const list = [...initialSubmissions];
        for (let i = 4; i <= 25; i++) {
            list.push({
                id: i,
                warehouseName: `Склад ${i}`,
                submissionNumber: `WO-2024-${String(i).padStart(3, '0')}`,
                requestedBy: 'Test User',
                date: '2024-12-20',
                status: 'pending',
                items: [{ id: i, name: 'Test Item', quantity: 1, reason: 'Test reason' }],
            });
        }
        return list;
    });

    const filteredSubmissions = submissions.filter((submission) => {
        const matchesSearch =
            submission.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.submissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !startDate || submission.date === startDate;
        return matchesSearch && matchesDate;
    });

    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const currentSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const pendingCount = filteredSubmissions.filter((s) => s.status === 'pending').length;

    const openModalWithSubmission = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    return (
        <Card className="w-full bg-white subtle-border ">
            <CardHeader className="border-b flex flex-row justify-between border-gray-200">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CardTitle>Заявки на списание</CardTitle>
                            {pendingCount > 0 && (
                                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                    <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                    <span className="text-sm text-yellow-800">
                                        {pendingCount} ожидают подтверждения
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {!isCollapsed && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px] relative">
                                <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Поиск по номеру, складу или сотруднику..."
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
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="mr-4 cursor-pointer text-2xl"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </div>
            </CardHeader>
            {!isCollapsed && (
                <CardContent className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Номер заявки
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Склад
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Запросил
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
                                {currentSubmissions.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            handleRowClick(submission);
                                            openModalWithSubmission(submission);
                                        }}
                                    >
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {submission.submissionNumber}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                            {submission.warehouseName}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {submission.requestedBy}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {new Date(submission.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            <Badge className="font-normal">
                                                {getStatusBadge(submission.status)}
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
                            {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} из{' '}
                            {filteredSubmissions.length} заявок
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
                                            {shouldShowEllipsis && (
                                                <span className="px-2">...</span>
                                            )}
                                            <Button
                                                variant={
                                                    currentPage === page ? 'default' : 'outline'
                                                }
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

                    {/* Custom Modal for details */}
                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        {selectedSubmission && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Подробности заявки
                                </h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium text-gray-900">Склад:</span>{' '}
                                        {selectedSubmission.warehouseName}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Номер:</span>{' '}
                                        {selectedSubmission.submissionNumber}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Статус:</span>{' '}
                                        {getStatusBadge(selectedSubmission.status)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                        Товары
                                    </h4>
                                    <div className="overflow-x-auto border rounded-md">
                                        <table className="w-full text-sm text-gray-700">
                                            <thead>
                                                <tr className="border-b bg-gray-50">
                                                    <th className="px-4 py-2 text-left font-medium text-gray-900">
                                                        Наименование
                                                    </th>
                                                    <th className="px-4 py-2 text-left font-medium text-gray-900">
                                                        Количество
                                                    </th>
                                                    <th className="px-4 py-2 text-left font-medium text-gray-900">
                                                        Причина
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedSubmission.items.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-2">{item.name}</td>
                                                        <td className="px-4 py-2">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-2">{item.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            // Implement deny logic
                                            console.log('Denied');
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Отклонить
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            // Implement approve logic
                                            console.log('Approved');
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Подтвердить
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </CardContent>
            )}
        </Card>
    );
};

export default WriteoffsForApproval;
