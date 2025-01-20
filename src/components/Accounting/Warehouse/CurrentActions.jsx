import React, { useState } from 'react';
import {
    FaClipboardList,
    FaTruck,
    FaBoxOpen,
    FaAngleDown,
    FaAngleUp,
    FaExclamationTriangle,
} from 'react-icons/fa';

const mockCurrentActions = [
    {
        id: 1,
        type: 'revision',
        warehouse: 'Main Warehouse',
        category: 'Electronics',
        startDate: '2024-12-01',
        endDate: '2024-12-10',
    },
    {
        id: 2,
        type: 'movement',
        warehouse: 'Secondary Warehouse',
        category: 'Office Supplies',
        startDate: '2024-12-05',
        endDate: '2024-12-05',
    },
    {
        id: 3,
        type: 'arrival',
        warehouse: 'Main Warehouse',
        category: 'Furniture',
        startDate: '2024-12-08',
        endDate: '2024-12-08',
    },
];

// Mock items for each action type
const mockRevisionItems = [
    { id: 1, name: 'Laptop', systemQty: 50, physicalQty: 48 },
    { id: 2, name: 'Monitor', systemQty: 30, physicalQty: 30 },
];

const mockMovementItems = [
    { id: 1, name: 'Pens', quantity: 100, transferQuantity: 10 },
    { id: 2, name: 'Notebooks', quantity: 50, transferQuantity: 5 },
];

const mockArrivalItems = [
    { id: 1, name: 'Office Chair', quantity: 20, supplier: 'Furniture Co' },
    { id: 2, name: 'Desk Lamp', quantity: 10, supplier: 'Lighting Inc' },
];

const getActionIcon = (type) => {
    switch (type) {
        case 'revision':
            return <FaClipboardList size={24} />;
        case 'movement':
            return <FaTruck size={24} />;
        case 'arrival':
            return <FaBoxOpen size={24} />;
        default:
            return <FaClipboardList size={24} />;
    }
};

const CardTitle = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const getActionTitle = (type) => {
    switch (type) {
        case 'revision':
            return 'Ревизия инвентаря';
        case 'movement':
            return 'Перемещение товаров';
        case 'arrival':
            return 'Прием товара';
        default:
            return 'Действие';
    }
};

const CurrentActions = () => {
    const [selectedAction, setSelectedAction] = useState(null);
    const [revisionItems, setRevisionItems] = useState(mockRevisionItems.map((i) => ({ ...i })));
    const [movementItems, setMovementItems] = useState(mockMovementItems.map((i) => ({ ...i })));
    const [arrivalItems] = useState(mockArrivalItems.map((i) => ({ ...i })));
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleBoxClick = (action) => {
        setSelectedAction(action);
    };

    const updateTransferQuantity = (id, newQty) => {
        setMovementItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, transferQuantity: newQty } : item)),
        );
    };

    const renderSelectedItems = () => {
        if (!selectedAction) return null;

        if (selectedAction.type === 'revision') {
            // Revision Items List
            return (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Проверяемые товары</h3>
                    <div className="bg-gray-100 rounded-xl p-2 mb-4">
                        <div className="grid grid-cols-3 gap-2 mb-2 font-semibold text-gray-700">
                            <div>Наименование товара</div>
                            <div>Система (шт.)</div>
                            <div>Фактическое (шт.)</div>
                        </div>
                        {revisionItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-3 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">{item.systemQty}</div>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.physicalQty}
                                        onChange={(e) =>
                                            setRevisionItems((prev) =>
                                                prev.map((itm) =>
                                                    itm.id === item.id
                                                        ? {
                                                              ...itm,
                                                              physicalQty: parseInt(
                                                                  e.target.value,
                                                                  10,
                                                              ),
                                                          }
                                                        : itm,
                                                ),
                                            )
                                        }
                                        className="w-16 p-1 border rounded"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (selectedAction.type === 'movement') {
            // Movement Items List
            return (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Выбранные товары для перемещения</h3>
                    <div className="bg-gray-100 rounded-xl p-2 mb-4">
                        <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
                            <div>Наименование товара</div>
                            <div>Количество для перемещения</div>
                            <div>Текущее количество на исходном складе</div>
                            <div>Оставшееся количество на исходном складе</div>
                            <div>Количество на целевом складе</div>
                        </div>
                        {movementItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-5 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div>
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.quantity}
                                        value={item.transferQuantity}
                                        onChange={(e) =>
                                            updateTransferQuantity(
                                                item.id,
                                                parseInt(e.target.value, 10),
                                            )
                                        }
                                        className="w-16 p-1 border rounded"
                                    />
                                </div>
                                <div className="text-gray-600">{item.quantity}</div>
                                <div className="text-blue-600">
                                    {item.quantity - item.transferQuantity}
                                </div>
                                <div className="text-green-600">{item.transferQuantity}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (selectedAction.type === 'arrival') {
            // Arrival Items List
            return (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Полученные товары</h3>
                    <div className="bg-gray-100 rounded-xl p-2 mb-4">
                        <div className="grid grid-cols-3 gap-2 mb-2 font-semibold text-gray-700">
                            <div>Наименование товара</div>
                            <div>Количество</div>
                            <div>Поставщик</div>
                        </div>
                        {arrivalItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-3 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">{item.quantity}</div>
                                <div className="text-gray-600">{item.supplier}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };
    const pendingCount = 5;
    return (
        <div className="p-6 bg-white min-w-[100%] subtle-border">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <CardTitle>Текущие действия</CardTitle>
                    {pendingCount > 0 && (
                        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                            <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">{pendingCount} действия</span>
                        </div>
                    )}
                </div>
                <div
                    className="mr-4 cursor-pointer text-2xl"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </div>
            </div>
            {!isCollapsed && (
                <div className="grid grid-cols-3 gap-6">
                    {mockCurrentActions.map((action) => (
                        <div
                            key={action.id}
                            onClick={() => handleBoxClick(action)}
                            className={`flex flex-col p-6 rounded-lg bg-white border cursor-pointer transition-colors ${
                                selectedAction && selectedAction.id === action.id
                                    ? 'border-blue-700'
                                    : 'border-gray-200 hover:border-blue-700'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-blue-700">{getActionIcon(action.type)}</div>
                                <h3 className="font-medium text-blue-700">
                                    {getActionTitle(action.type)}
                                </h3>
                            </div>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <span className="font-semibold">Склад:</span> {action.warehouse}
                                </p>
                                <p>
                                    <span className="font-semibold">Категория:</span>{' '}
                                    {action.category}
                                </p>
                                <p>
                                    <span className="font-semibold">Даты:</span> {action.startDate}{' '}
                                    - {action.endDate}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isCollapsed && renderSelectedItems()}
        </div>
    );
};

export default CurrentActions;
