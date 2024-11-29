import React, { useState } from 'react';
import { MoreEditProductModal } from '../components/MoreEditProductModal';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

export const EditProductModal = ({ isOpen, onClose, items, warehouses }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [fromWarehouse, setFromWarehouse] = useState(null);
    const [toWarehouse, setToWarehouse] = useState(null);
    const [transferDate, setTransferDate] = useState(null);
    const [isMoreEditModalOpen, setIsMoreEditModalOpen] = useState(false);

    const moreEditModalClick = () => {
        setIsMoreEditModalOpen((prev) => !prev);
    };

    const handleTransferClick = () => {
        setIsTransferModalOpen(true);
    };

    const handleTransferModalClose = () => {
        setIsTransferModalOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:text-red-500 hover:bg-gray-300"
                >
                    ✖
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold mb-6">Редактирование</h2>

                {/* Item List */}
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="relative flex items-center">
                            <input
                                type="text"
                                value={item['НоменклатураНаименование']}
                                readOnly
                                className="border border-gray-300 rounded-md p-4 w-full pr-10"
                            />
                            <button
                                onClick={() => moreEditModalClick()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                            >
                                ✎
                            </button>
                        </div>
                    ))}
                    <MoreEditProductModal
                        onClose={moreEditModalClick}
                        isOpen={isMoreEditModalOpen}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => handleTransferClick()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Перенести
                    </button>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Сохранить
                    </button>
                </div>

                <Dialog
                    header="Перенос товара"
                    visible={isTransferModalOpen}
                    onHide={handleTransferModalClose}
                    modal
                    closable
                >
                    <div className="flex flex-col gap-8">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center gap-6">
                                <p className="text-gray-700">{item['НоменклатураНаименование']}</p>
                                <div className="flex items-center gap-4">
                                    <label
                                        htmlFor="currentStock"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Количество
                                    </label>
                                    <input
                                        type="number"
                                        id="currentStock"
                                        // value={count}
                                        // onChange={(e) => setCount(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between gap-14">
                            <Dropdown
                                optionLabel="warehouseName"
                                value={fromWarehouse}
                                options={warehouses}
                                onChange={(e) => setFromWarehouse(e.value)}
                                placeholder="Отправка с"
                                className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300 min-w-[150px]"
                            />
                            <Dropdown
                                value={toWarehouse}
                                optionLabel="warehouseName"
                                options={warehouses}
                                onChange={(e) => setToWarehouse(e.value)}
                                placeholder="Отправка в"
                                className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300 min-w-[150px]"
                            />
                        </div>

                        <Calendar
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.value)}
                            placeholder="Выберите дату"
                            className=" text-gray-700 rounded-md border-2 focus:ring-2 focus:ring-blue-300 p-2"
                        />

                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full ">
                            Перенести
                        </button>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
