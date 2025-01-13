import React, { useState } from 'react';
import { MoreEditProductModal } from '../components/MoreEditProductModal';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useCompanyStore, useAuthStore } from '../store/index';
import { axiosInstance } from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const EditProductModal = ({ isOpen, onClose, items, warehouses }) => {
    const user = useAuthStore((state) => state.user);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [fromWarehouse, setFromWarehouse] = useState(null);
    const [toWarehouse, setToWarehouse] = useState(null);
    const [transferDate, setTransferDate] = useState(null);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const categories = useCompanyStore((state) => state.categories);
    // Состояние для управления открытием MoreEditProductModal
    const [isMoreEditModalOpen, setIsMoreEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const openMoreEditModal = (product) => {
        setSelectedProduct(product);
        setIsMoreEditModalOpen(true);
    };

    const closeMoreEditModal = () => {
        setSelectedProduct(null);
        setIsMoreEditModalOpen(false);
    };

    const handleTransferClick = () => {
        setIsTransferModalOpen(true);
    };

    const handleTransferModalClose = () => {
        setIsTransferModalOpen(false);
    };

    const handleCategoryEditClick = () => {
        setShowCategoriesDropdown(true);
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
                    // Добавьте логику переноса здесь
                }}
            />
        </div>
    );

    const handleChangeCategory = async () => {
        const companyId = user?.companyId ? user?.companyId : user?.id;
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(`companies/products/category/${companyId}`, {
                items,
                category: selectedCategory,
            });
            if (response.status === 200) {
                toast.success('Вы успешно обновили категорию товаров');
                setSelectedCategory(null);
                setShowCategoriesDropdown(false);
            }
        } catch {
            toast.error('Не удалось обновить категорию');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            header="Редактирование товаров"
            visible={isOpen}
            onHide={onClose}
            style={{ width: '30vw' }}
        >
            <div className="flex flex-col gap-4">
                {/* Список товаров */}
                {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                        <span className="flex-1 rounded-md border-2 p-2">{item.name}</span>
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-text"
                            onClick={() => openMoreEditModal(item)}
                        />
                    </div>
                ))}

                <Button
                    label="Поменять категорию"
                    className="mt-10 p-button-primary w-full bg-blue-500 p-2 text-white rounded-md"
                    onClick={handleCategoryEditClick}
                />

                {showCategoriesDropdown && (
                    <div className="flex">
                        <Dropdown
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.value)}
                            options={categories || []}
                            placeholder="Выберите категорию"
                            showClear
                            className="w-full border-blue-500 border-2 rounded-lg"
                        />
                        <Button
                            disabled={!selectedCategory || isLoading}
                            onClick={handleChangeCategory}
                            className="ml-5"
                            icon={
                                <i
                                    className="pi pi-arrow-right-arrow-left
"
                                    style={{ fontSize: '1rem' }}
                                ></i>
                            }
                        />
                    </div>
                )}

                {/* Кнопка переноса */}
                {/* <Button
                    label="Перенести"
                    className="p-button-primary w-full bg-blue-500 p-2 text-white rounded-md"
                    onClick={handleTransferClick}
                /> */}
            </div>

            {/* Модальное окно переноса */}
            <Dialog
                header="Перенос товара"
                visible={isTransferModalOpen}
                onHide={handleTransferModalClose}
                style={{ width: '40vw' }}
                footer={renderTransferFooter()}
            >
                <div className="flex flex-col gap-4">
                    {/* Поля переноса */}
                    {items.map((item) => (
                        <div key={item._id} className="flex justify-between items-center gap-4">
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

            {/* Модальное окно редактирования отдельного товара */}
            {selectedProduct && (
                <MoreEditProductModal
                    product={selectedProduct}
                    isOpen={isMoreEditModalOpen}
                    onClose={closeMoreEditModal}
                />
            )}
        </Dialog>
    );
};
