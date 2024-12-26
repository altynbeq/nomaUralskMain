import React, { useState } from 'react';
import {
    FaSearch,
    FaExchangeAlt,
    FaTruckLoading,
    FaExclamationTriangle,
    FaAngleDown,
    FaAngleUp,
} from 'react-icons/fa';

const MoveItemsSklad = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [sourceWarehouse, setSourceWarehouse] = useState('');
    const [destinationWarehouse, setDestinationWarehouse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Mock warehouse list (replace with actual warehouse data)
    const warehouses = [
        'Main Warehouse',
        'North Storage',
        'South Distribution',
        'East Logistics',
        'West Inventory',
    ];

    // // Mock inventory items (replace with actual inventory data)
    const [inventoryItems, setInventoryItems] = useState([
        { id: 1, name: 'Laptop', quantity: 50, warehouse: 'Main Warehouse' },
        { id: 2, name: 'Monitor', quantity: 30, warehouse: 'Main Warehouse' },
        { id: 3, name: 'Keyboard', quantity: 100, warehouse: 'North Storage' },
        { id: 4, name: 'Mouse', quantity: 75, warehouse: 'North Storage' },
    ]);
    const handleItemSelect = (item) => {
        const existingItemIndex = selectedItems.findIndex((i) => i.id === item.id);

        if (existingItemIndex > -1) {
            // If item already selected, remove it
            const newSelectedItems = [...selectedItems];
            newSelectedItems.splice(existingItemIndex, 1);
            setSelectedItems(newSelectedItems);
        } else {
            // Add new item with transfer quantity
            setSelectedItems([
                ...selectedItems,
                {
                    ...item,
                    transferQuantity: 1,
                },
            ]);
        }
    };
    const updateTransferQuantity = (itemId, newQuantity) => {
        setSelectedItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, transferQuantity: Math.min(newQuantity, item.quantity) }
                    : item,
            ),
        );
    };
    const handleTransfer = () => {
        if (!sourceWarehouse || !destinationWarehouse || selectedItems.length === 0) {
            alert('Please select source warehouse, destination warehouse, and items to transfer.');
            return;
        }

        // Update inventory (this would typically be a backend API call)
        const updatedInventory = inventoryItems.map((item) => {
            const selectedItem = selectedItems.find((si) => si.id === item.id);
            if (selectedItem) {
                return {
                    ...item,
                    quantity: item.quantity - selectedItem.transferQuantity,
                };
            }
            return item;
        });

        setInventoryItems(updatedInventory);
        setSelectedItems([]);
        setSourceWarehouse('');
        setDestinationWarehouse('');
        alert('Items transferred successfully!');
    };
    const CardTitle = ({ className = '', children }) => (
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
    );
    // // Filter items based on search term and source warehouse
    const filteredItems = inventoryItems.filter(
        (item) =>
            item.warehouse === sourceWarehouse &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const pendingCount = 7;
    return (
        <div className="bg-white min-w-[100%] p-6 rounded-2xl subtle-border shadow-md max-w-2xl mx-auto">
            <div className="flex flex-row justify-between">
                <div className="flex mb-4 flex-row gap-2">
                    <CardTitle>Перемещение товаров на складе</CardTitle>
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

            {/* Warehouse Selection */}
            {!isCollapsed && (
                <div className="mb-4">
                    <div className="flex justify-between">
                        <div className="w-5/12">
                            <label className="block mb-2 font-medium">Исходный склад</label>
                            <select
                                value={sourceWarehouse}
                                onChange={(e) => setSourceWarehouse(e.target.value)}
                                className="w-full p-2 border rounded-xl"
                            >
                                <option value="">Выберите исходный склад</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse} value={warehouse}>
                                        {warehouse}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center self-end">
                            <FaExchangeAlt className="text-blue-500 mx-2" />
                        </div>

                        <div className="w-5/12">
                            <label className="block mb-2 font-medium">Целевой склад</label>
                            <select
                                value={destinationWarehouse}
                                onChange={(e) => setDestinationWarehouse(e.target.value)}
                                className="w-full p-2 border rounded-xl"
                            >
                                <option value="">Выберите целевой склад</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse} value={warehouse}>
                                        {warehouse}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Pick Items Section */}
            {!isCollapsed && sourceWarehouse && destinationWarehouse && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Выберите товары</h3>

                    {/* Search Input */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Поиск товаров..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-xl"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                    </div>

                    {/* Item Selection Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto mb-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className={`p-2 border rounded-xl cursor-pointer ${
                                    selectedItems.some((si) => si.id === item.id)
                                        ? 'bg-blue-100 border-blue-300'
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleItemSelect(item)}
                            >
                                <div className="flex justify-between">
                                    <span>{item.name}</span>
                                    <span>Кол: {item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Items List */}
                    {selectedItems.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Selected Items</h3>
                            <div className="bg-gray-100 rounded-xl p-2 mb-4">
                                <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
                                    <div>Наименование товара</div>
                                    <div>Количество для перемещения</div>
                                    <div>Текущее количество на исходном складе</div>
                                    <div>Оставшееся количество на исходном складе</div>
                                    <div>Количество на целевом складе</div>
                                </div>
                                {selectedItems.map((item) => (
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
                                                        parseInt(e.target.value),
                                                    )
                                                }
                                                className="w-16 p-1 border rounded"
                                            />
                                        </div>
                                        <div className="text-gray-600">{item.quantity}</div>
                                        <div className="text-blue-600">
                                            {item.quantity - item.transferQuantity}
                                        </div>
                                        <div className="text-green-600">
                                            {/* Assuming destination warehouse starts with 0 */}
                                            {item.transferQuantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transfer Button */}
                    <div className="text-center mt-4">
                        <button
                            onClick={handleTransfer}
                            className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition duration-300"
                            disabled={selectedItems.length === 0}
                        >
                            Переместить товары <FaTruckLoading className="inline-block ml-2" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoveItemsSklad;
