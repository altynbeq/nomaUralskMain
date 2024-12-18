import React, { useState, useMemo } from 'react';
import {
    FaSearch,
    FaFilter,
    FaRegTrashAlt,
    FaChevronLeft,
    FaChevronRight,
    FaFileDownload,
} from 'react-icons/fa';

const InventoryRevision = () => {
    // Product Categories
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [revisedItems, setRevisedItems] = useState([]);

    // States for revised items filtering & pagination
    const [revisedSearchTerm, setRevisedSearchTerm] = useState('');
    const [revisedCurrentPage, setRevisedCurrentPage] = useState(1);

    // States for inventory items filtering
    const [inventorySearchTerm, setInventorySearchTerm] = useState('');

    // Mock data with categories
    const productCategories = [
        'Электроника',
        'Мебель',
        'Офисные принадлежности',
        'Инструменты',
        'Складское оборудование',
    ];

    const warehouses = [
        'Основной склад',
        'Северный склад',
        'Южный распределительный центр',
        'Восточный логистический центр',
        'Западный инвентарный склад',
    ];

    const inventoryItems = [
        {
            id: 1,
            name: 'Ноутбук',
            category: 'Электроника',
            currentQuantity: 50,
            systemQuantity: 50,
            warehouse: 'Основной склад',
        },
        {
            id: 2,
            name: 'Монитор',
            category: 'Электроника',
            currentQuantity: 30,
            systemQuantity: 35,
            warehouse: 'Основной склад',
        },
        {
            id: 3,
            name: 'Клавиатура',
            category: 'Офисные принадлежности',
            currentQuantity: 100,
            systemQuantity: 95,
            warehouse: 'Северный склад',
        },
        {
            id: 4,
            name: 'Мышь',
            category: 'Офисные принадлежности',
            currentQuantity: 75,
            systemQuantity: 80,
            warehouse: 'Северный склад',
        },
        // Add more mock items to demonstrate pagination
        ...Array.from({ length: 20 }, (_, i) => ({
            id: 5 + i,
            name: `Товар ${i + 1}`,
            category: i % 2 === 0 ? 'Электроника' : 'Офисные принадлежности',
            currentQuantity: Math.floor(Math.random() * 100),
            systemQuantity: Math.floor(Math.random() * 100),
            warehouse: i % 2 === 0 ? 'Основной склад' : 'Северный склад',
        })),
    ];

    // Filtering for main inventory
    const filteredItems = React.useMemo(() => {
        return inventoryItems.filter(
            (item) =>
                (!selectedCategory || item.category === selectedCategory) &&
                (!selectedWarehouse || item.warehouse === selectedWarehouse) &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                item.name.toLowerCase().includes(inventorySearchTerm.toLowerCase()), // also filter by inventorySearchTerm
        );
    }, [selectedCategory, selectedWarehouse, searchTerm, inventorySearchTerm]);

    // Pagination for main inventory
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    // Filtering for revised items
    const filteredRevisedItems = React.useMemo(() => {
        return revisedItems.filter((item) =>
            item.name.toLowerCase().includes(revisedSearchTerm.toLowerCase()),
        );
    }, [revisedItems, revisedSearchTerm]);

    // Pagination for revised items
    const revisedItemsPerPage = 10;
    const revisedTotalPages = Math.ceil(filteredRevisedItems.length / revisedItemsPerPage);
    const paginatedRevisedItems = filteredRevisedItems.slice(
        (revisedCurrentPage - 1) * revisedItemsPerPage,
        revisedCurrentPage * revisedItemsPerPage,
    );

    // Add item to revision list
    const addToRevision = (item) => {
        if (!revisedItems.some((ri) => ri.id === item.id)) {
            setRevisedItems((prev) => [
                ...prev,
                {
                    ...item,
                    physicalQuantity: item.currentQuantity,
                },
            ]);
        }
    };

    // Remove item from revision list
    const removeFromRevision = (itemId) => {
        setRevisedItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    // Update physical quantity in revision list
    const updateRevisionQuantity = (itemId, newQuantity) => {
        setRevisedItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, physicalQuantity: newQuantity } : item,
            ),
        );
    };

    // Pagination handlers for main inventory
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };
    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    // Pagination handlers for revised items
    const goToRevisedPreviousPage = () => {
        setRevisedCurrentPage((prev) => Math.max(1, prev - 1));
    };
    const goToRevisedNextPage = () => {
        setRevisedCurrentPage((prev) => Math.min(revisedTotalPages, prev + 1));
    };

    return (
        <div className="bg-white flex flex-col min-w-[100%] subtle-border p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Ревизия инвентаря</h2>

            {/* Category Selection */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">Выберите категорию товаров</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1); // Reset to first page when category changes
                    }}
                    className="w-full p-2 border rounded-xl"
                >
                    <option value="">Все категории</option>
                    {productCategories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Warehouse Selection */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">Выберите склад</label>
                <select
                    value={selectedWarehouse}
                    onChange={(e) => {
                        setSelectedWarehouse(e.target.value);
                        setCurrentPage(1); // Reset to first page when warehouse changes
                    }}
                    className="w-full p-2 border rounded-xl"
                >
                    <option value="">Все склады</option>
                    {warehouses.map((warehouse) => (
                        <option key={warehouse} value={warehouse}>
                            {warehouse}
                        </option>
                    ))}
                </select>
            </div>

            {/* Global Search Input */}
            {/* <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-2 pl-10 border rounded-xl"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            </div> */}

            <div className="flex flex-col">
                <div className="flex flex-col gap-4">
                    {/* Items for Revision Section */}
                    <div className="bg-gray-100 subtle-border rounded-xl p-2 mb-4">
                        <div className="flex pr-5 items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Товары для ревизии</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative w-64">
                                    <input
                                        type="text"
                                        placeholder="Поиск..."
                                        value={revisedSearchTerm}
                                        onChange={(e) => {
                                            setRevisedSearchTerm(e.target.value);
                                            setRevisedCurrentPage(1);
                                        }}
                                        className="w-full p-2 pl-10 border rounded-xl"
                                    />
                                    <FaSearch
                                        className="absolute left-3 top-2.5 text-gray-400"
                                        size={20}
                                    />
                                </div>
                                <div className="bg-white subtle-border p-2 rounded-2xl">
                                    <FaFileDownload
                                        className="text-blue-700   cursor-pointer hover:text-blue-500 transition-colors"
                                        size={24}
                                        onClick={() => {
                                            // Implement download logic
                                            alert('Download initiated');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-gray-700">
                            <div>Название</div>
                            <div>Категория</div>
                            <div>Количество</div>
                            {/* <div>Действия</div> */}
                        </div>
                        {paginatedRevisedItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-4 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm">{item.category}</div>
                                <div>
                                    <input
                                        type="number"
                                        value={item.physicalQuantity}
                                        onChange={(e) =>
                                            updateRevisionQuantity(
                                                item.id,
                                                parseInt(e.target.value, 10),
                                            )
                                        }
                                        className="w-16 p-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={() => removeFromRevision(item.id)}
                                        className="bg-red-500 flex flex-row gap-2 items-center text-sm justify-center text-center rounded-2xl text-white px-2 py-1 hover:bg-red-600"
                                    >
                                        Удалить <FaRegTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination for Revised Items */}
                        {revisedTotalPages > 1 && (
                            <div className="flex justify-center items-center mt-4">
                                <button
                                    onClick={goToRevisedPreviousPage}
                                    disabled={revisedCurrentPage === 1}
                                    className="disabled:opacity-50 mr-2"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span>
                                    {revisedCurrentPage} / {revisedTotalPages}
                                </span>
                                <button
                                    onClick={goToRevisedNextPage}
                                    disabled={revisedCurrentPage === revisedTotalPages}
                                    className="disabled:opacity-50 ml-2"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Inventory Items Section */}
                    <div className="bg-gray-100 subtle-border rounded-xl p-2 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Все товары</h3>
                            <div className="flex pr-5 items-center gap-2">
                                <div className="relative w-64">
                                    <input
                                        type="text"
                                        placeholder="Поиск..."
                                        value={inventorySearchTerm}
                                        onChange={(e) => {
                                            setInventorySearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full p-2 pl-10 border rounded-xl"
                                    />
                                    <FaSearch
                                        className="absolute left-3 top-2.5 text-gray-400"
                                        size={20}
                                    />
                                </div>
                                <div className="bg-white subtle-border p-2 rounded-2xl">
                                    <FaFilter
                                        className="text-blue-700 cursor-pointer hover:text-gray-700 transition-colors"
                                        size={24}
                                        onClick={() => {
                                            // Implement filter logic
                                            alert('Filter clicked');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
                            <div>Название</div>
                            <div>Категория</div>
                            <div>Система</div>
                            <div>Текущее</div>
                            {/* <div>Действия</div> */}
                        </div>
                        {paginatedItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-5 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm">{item.category}</div>
                                <div className="text-gray-600">{item.systemQuantity}</div>
                                <div className="text-gray-600">{item.currentQuantity}</div>
                                <div>
                                    <button
                                        onClick={() => addToRevision(item)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded-2xl text-sm hover:bg-blue-600"
                                    >
                                        + Ревизия
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination for Inventory Items */}
                        <div className="flex justify-center items-center mt-4">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="disabled:opacity-50 mr-2"
                            >
                                <FaChevronLeft />
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-50 ml-2"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {revisedItems.length > 0 && (
                        <div className="text-center mt-4">
                            <button
                                className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition duration-300"
                                onClick={() => {
                                    // Implement revision submission logic
                                    alert('Ревизия завершена');
                                }}
                            >
                                Подтвердить ревизию
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryRevision;
