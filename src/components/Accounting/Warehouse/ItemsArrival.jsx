import React, { useState, useEffect } from 'react';
import {
    FaPlus,
    FaFileUpload,
    FaRegWindowClose,
    FaExclamationTriangle,
    FaAngleDown,
    FaAngleUp,
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
                <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                            <FaRegWindowClose className="w-5 h-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const WarehouseInventory = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [newItem, setNewItem] = useState({
        itemName: '',
        amount: '',
        priceBought: '',
        priceForSale: '',
        warehouse: '',
    });

    // Sample warehouse list - replace with your actual warehouses
    const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddItem = () => {
        setItems((prev) => [...prev, { ...newItem, id: Date.now() }]);
        setNewItem({
            itemName: '',
            amount: '',
            priceBought: '',
            priceForSale: '',
            warehouse: '',
        });
        setIsModalOpen(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setItems((prev) => [
            ...prev,
            ...jsonData.map((item) => ({
                ...item,
                id: Date.now() + Math.random(),
            })),
        ]);
    };
    const CardTitle = ({ className = '', children }) => (
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
    );
    const pendingCount = 10;
    return (
        <div className="p-6 bg-white min-w-[100%] subtle-border rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex mb-4 flex-row gap-2">
                        <CardTitle>Прием товара на склад</CardTitle>
                        {pendingCount > 0 && (
                            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                <span className="text-sm text-yellow-800">
                                    {pendingCount} действия
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="space-x-4 flex flex-row">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-2xl hover:bg-blue-800"
                        >
                            <FaPlus className="w-5 h-5 mr-2" />
                            Add Item
                        </button>
                        <label className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 cursor-pointer">
                            <FaFileUpload className="w-5 h-5 mr-2" />
                            Import Excel
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                        <div
                            className="mr-4 cursor-pointer text-2xl"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                        </div>
                    </div>
                </div>
            </div>
            {!isCollapsed && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Item Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Price Bought
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Price for Sale
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Warehouse
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.itemName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.priceBought}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.priceForSale}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.warehouse}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!isCollapsed && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add New Item"
                >
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="itemName">Item Name</label>
                            <input
                                type="text"
                                id="itemName"
                                name="itemName"
                                value={newItem.itemName}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={newItem.amount}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="priceBought">Price Bought</label>
                            <input
                                type="number"
                                id="priceBought"
                                name="priceBought"
                                value={newItem.priceBought}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="priceForSale">Price for Sale</label>
                            <input
                                type="number"
                                id="priceForSale"
                                name="priceForSale"
                                value={newItem.priceForSale}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="warehouse">Warehouse</label>
                            <select
                                id="warehouse"
                                name="warehouse"
                                value={newItem.warehouse}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2"
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse} value={warehouse}>
                                        {warehouse}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border rounded-2xl"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddItem}
                            className="px-4 py-2 bg-blue-700 text-white rounded-2xl hover:bg-blue-800"
                        >
                            Add Item
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default WarehouseInventory;
