import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { axiosInstance } from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export const MoreEditProductModal = ({ isOpen, onClose, product }) => {
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const [productData, setProductData] = useState(product || {});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setProductData(product || {});
    }, [product]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(
                `/companies/products/${clientId}/${product._id}`,
                productData,
            );
            if (response.status === 200) {
                toast.success('Вы успешно обновили товар');
            }
        } catch (error) {
            toast.error('Ошибка при обновлении товара');
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    const onChange = (e, field) => {
        const value = e.target ? e.target.value : e.value;
        setProductData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderFooter = () => (
        <div className="flex items-center justify-between gap-6">
            <Button
                label="Отмена"
                onClick={onClose}
                className="border-2 rounded-md p-2 flex-1 bg-black text-white"
            />
            <Button
                label="Сохранить"
                onClick={handleSave}
                loading={isLoading}
                className="border-2 rounded-md p-2 flex-1 bg-green-500 text-white"
            />
        </div>
    );

    return (
        <Dialog
            header="Редактирование товара"
            visible={isOpen}
            style={{ width: '30vw' }}
            onHide={onClose}
            footer={renderFooter()}
        >
            <div className="p-fluid">
                {/* Название товара */}
                <div className="field">
                    <label htmlFor="productName">Название товара</label>
                    <InputText
                        placeholder="Название товара"
                        id="productName"
                        className="border-2 rounded-md p-2"
                        value={productData.name || ''}
                        onChange={(e) => onChange(e, 'name')}
                    />
                </div>

                {/* Остаток и минимальный остаток */}
                <div className="field grid">
                    <div className="col">
                        <label htmlFor="currentStock">Остаток</label>
                        <InputNumber
                            id="currentStock"
                            className="border-2 rounded-md p-2"
                            value={productData.currentStock || 0}
                            onValueChange={(e) => onChange(e, 'currentStock')}
                            mode="decimal"
                            showButtons
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="minStock">Мин. Остаток</label>
                        <InputNumber
                            className="border-2 rounded-md p-2"
                            id="minStock"
                            value={productData.minStock || 0}
                            onValueChange={(e) => onChange(e, 'minStock')}
                            mode="decimal"
                            showButtons
                        />
                    </div>
                </div>

                {/* Количество */}
                <div className="field">
                    <label htmlFor="quantity">Количество</label>
                    <InputNumber
                        className="border-2 rounded-md p-2"
                        id="quantity"
                        value={productData.quantity || 0}
                        onValueChange={(e) => onChange(e, 'quantity')}
                        mode="decimal"
                        showButtons
                    />
                </div>
            </div>
        </Dialog>
    );
};
