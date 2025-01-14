import React, { useState } from 'react';
import { MoreEditProductModal } from '../components/MoreEditProductModal';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useCompanyStore } from '../store/companyStore';

export const EditProductModal = ({ isOpen, onClose, items }) => {
    const categories = useCompanyStore((state) => state.categories);
    const [isMoreEditModalOpen, setIsMoreEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openMoreEditModal = (product) => {
        setSelectedProduct(product);
        setIsMoreEditModalOpen(true);
    };

    const closeMoreEditModal = () => {
        setSelectedProduct(null);
        setIsMoreEditModalOpen(false);
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
                    <div key={item.id} className="flex items-center gap-4">
                        <span className="flex-1 rounded-md border-2 p-2">{item.name}</span>
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-text"
                            onClick={() => openMoreEditModal(item)}
                        />
                    </div>
                ))}
            </div>

            {/* Модальное окно редактирования отдельного товара */}
            {selectedProduct && (
                <MoreEditProductModal
                    product={selectedProduct}
                    isOpen={isMoreEditModalOpen}
                    onClose={closeMoreEditModal}
                    categories={categories}
                />
            )}
        </Dialog>
    );
};
