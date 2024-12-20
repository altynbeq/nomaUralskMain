import React, { useState } from 'react';
import {
    FaSearch,
    FaFilter,
    FaRegCalendarAlt,
    FaBox,
    FaClipboardList,
    FaHeadSideVirus,
    FaRegWindowClose,
    FaChevronLeft,
    FaChevronRight,
    FaExchangeAlt,
} from 'react-icons/fa';

const getActionIcon = (type) => {
    switch (type) {
        case 'arrival':
            return <FaBox className="h-5 w-5 text-blue-700" />;
        case 'movement':
            return <FaExchangeAlt className="h-5 w-5 text-blue-700" />;
        case 'revision':
            return <FaClipboardList className="h-5 w-5 text-blue-700" />;
        default:
            return <FaHeadSideVirus className="h-5 w-5 text-blue-700" />;
    }
};

// Dialog components remain the same
const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
            <div className="relative z-50 bg-white rounded-lg shadow-xl">{children}</div>
        </div>
    );
};

const DialogContent = ({ children, className = '' }) => (
    <div className={`w-full max-w-lg p-6 ${className}`}>{children}</div>
);

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

const DialogTitle = ({ children }) => (
    <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

// Mock data
const mockActions = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    type: ['arrival', 'movement', 'revision'][index % 3],
    date: `2024-12-${19 - (index % 19)}`,
    items: ['Laptop', 'Monitor', 'Keyboard', 'Mouse'][index % 4],
    warehouse: ['Main Warehouse', 'Secondary Warehouse', 'Storage Unit'][index % 3],
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Secondary Warehouse',
    quantity: (index + 1) * 5,
    operator: ['John Doe', 'Jane Smith', 'Mike Johnson'][index % 3],
    notes: 'Regular operation completed',
}));

const ITEMS_PER_PAGE = 10;

const HistoryList = ({ actions, onActionClick }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(actions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedActions = actions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="border rounded-lg">
            <div className="divide-y">
                {displayedActions.map((action) => (
                    <div
                        key={action.id}
                        onClick={() => onActionClick(action)}
                        className="py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {getActionIcon(action.type)}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-blue-700 capitalize text-sm">
                                    {action.type === 'movement'
                                        ? `Item Transfer: ${action.fromWarehouse} → ${action.toWarehouse}`
                                        : `${action.type}: ${action.warehouse}`}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="truncate">{action.items}</span>
                                    <span>•</span>
                                    <span>{action.quantity} товары</span>
                                    <span>•</span>
                                    <span>{action.date}</span>
                                    <span>•</span>
                                    <span>{action.operator}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="border-t px-4 py-3 flex items-center justify-between bg-gray-50 rounded-b-lg">
                <span className="text-sm text-gray-600">
                    Показано {startIndex + 1} to{' '}
                    {Math.min(startIndex + ITEMS_PER_PAGE, actions.length)} of {actions.length}{' '}
                    позиций
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                        <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                        Страница {currentPage} из {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                        <FaChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const LatestActionsWarehouse = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAction, setSelectedAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleActionClick = (action) => {
        setSelectedAction(action);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-4xl min-w-[100%] subtle-border mx-auto p-4 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">История действий</h2>

            {/* Search and Filter Bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Поиск действий..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <FaRegCalendarAlt className="h-5 w-5 text-gray-600" />
                    <span>Дата</span>
                </button>

                <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <FaFilter className="h-5 w-5 text-gray-600" />
                    <span>Фильтр</span>
                </button>
            </div>

            {/* History List Component */}
            <HistoryList actions={mockActions} onActionClick={handleActionClick} />

            {/* Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    {selectedAction && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <DialogTitle>
                                        <div className="flex items-center gap-2">
                                            {getActionIcon(selectedAction.type)}
                                            <span className="capitalize">
                                                {selectedAction.type} Детали
                                            </span>
                                        </div>
                                    </DialogTitle>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <FaRegWindowClose className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Товары</h4>
                                    <p>{selectedAction.items}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Локация</h4>
                                    {selectedAction.type === 'movement' ? (
                                        <p>
                                            From {selectedAction.fromWarehouse} to{' '}
                                            {selectedAction.toWarehouse}
                                        </p>
                                    ) : (
                                        <p>{selectedAction.warehouse}</p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Количество</h4>
                                    <p>{selectedAction.quantity} Торвары</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Оператор</h4>
                                    <p>{selectedAction.operator}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Заметки</h4>
                                    <p>{selectedAction.notes}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Дата</h4>
                                    <p>{selectedAction.date}</p>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LatestActionsWarehouse;
