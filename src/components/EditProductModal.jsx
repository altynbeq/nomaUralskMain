import React, { useState } from 'react';
import { MoreEditProductModal } from '../components/MoreEditProductModal';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

export const EditProductModal = ({ isOpen, onClose, items, warehouses }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [fromWarehouse, setFromWarehouse] = useState(null);
    const [toWarehouse, setToWarehouse] = useState(null);
    const [transferDate, setTransferDate] = useState(null);
    const [isMoreEditModalOpen, setIsMoreEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const moreEditModalClick = (item) => {
        setSelectedProduct(item);
        setIsMoreEditModalOpen((prev) => !prev);
    };

    const handleTransferClick = () => {
        setIsTransferModalOpen(true);
    };

    const handleTransferModalClose = () => {
        setIsTransferModalOpen(false);
    };

    const renderTransferFooter = () => (
        <div className="flex justify-between">
            <Button
                label="Отмена"
                onClick={handleTransferModalClose}
                className="p-button-secondary"
            />
            <Button
                label="Перенести"
                className="p-button-success"
                onClick={() => {
                    // Add transfer logic here
                }}
            />
        </div>
    );

    return (
        <Dialog
            header="Редактирование товаров"
            visible={isOpen}
            onHide={onClose}
            style={{ width: '25vw' }}
        >
            <div className="flex flex-col gap-4">
                {/* Item List */}
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <span className="flex-1 rounded-md border-2 p-2">{item.name}</span>
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-text"
                            onClick={() => moreEditModalClick(item)}
                        />
                        <MoreEditProductModal
                            product={selectedProduct}
                            onClose={() => setIsMoreEditModalOpen(false)}
                            isOpen={isMoreEditModalOpen}
                        />
                    </div>
                ))}

                {/* Transfer Button */}
                <Button
                    label="Перенести"
                    className="p-button-primary w-full bg-blue-500 p-2 text-white rounded-md"
                    onClick={handleTransferClick}
                />
            </div>

            {/* Transfer Dialog */}
            <Dialog
                header="Перенос товара"
                visible={isTransferModalOpen}
                onHide={handleTransferModalClose}
                style={{ width: '40vw' }}
                footer={renderTransferFooter()}
            >
                <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center gap-4">
                            <span>{item.name}</span>
                            <InputNumber
                                placeholder="Количество"
                                mode="decimal"
                                showButtons
                                className="flex-1"
                            />
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <Dropdown
                            value={fromWarehouse}
                            optionLabel="warehouseName"
                            options={warehouses}
                            onChange={(e) => setFromWarehouse(e.value)}
                            placeholder="Отправка с"
                            className="flex-1"
                        />
                        <Dropdown
                            value={toWarehouse}
                            optionLabel="warehouseName"
                            options={warehouses}
                            onChange={(e) => setToWarehouse(e.value)}
                            placeholder="Отправка в"
                            className="flex-1"
                        />
                    </div>

                    <Calendar
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.value)}
                        placeholder="Выберите дату"
                        className="w-full"
                    />
                </div>
            </Dialog>
        </Dialog>
    );
};
