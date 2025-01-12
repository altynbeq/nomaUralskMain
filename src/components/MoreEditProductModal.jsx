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
                `/companies/${clientId}/${product._id}`,
                productData,
            );
            if (response.status === 200) {
                toast.success('Вы успешно обновили товар');
                // Дополнительно можно обновить список товаров, если необходимо
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
                    <label htmlFor="productName text-xs">Название товара</label>
                    <InputText
                        placeholder="Название товара"
                        id="productName"
                        className="border-2 rounded-md p-2"
                        value={productData.name || ''}
                        onChange={(e) => onChange(e, 'name')}
                    />
                </div>

                {/* Цена, Остаток, Мин. Остаток */}
                <div className="field grid mt-5">
                    <div className="col">
                        <label htmlFor="price text-xs">Цена</label>
                        <InputNumber
                            id="price"
                            className="border-2 rounded-md p-2"
                            value={productData.price || 0}
                            onValueChange={(e) => onChange(e, 'price')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                    <div className="col mt-5">
                        <label htmlFor="currentStock text-xs">Остаток</label>
                        <InputNumber
                            id="currentStock"
                            className="border-2 rounded-md p-2"
                            value={productData.currentStock || 0}
                            onValueChange={(e) => onChange(e, 'currentStock')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                    <div className="col mt-5">
                        <label htmlFor="minStock text-xs">Мин. Остаток</label>
                        <InputNumber
                            className="border-2 rounded-md p-2"
                            id="minStock"
                            value={productData.minStock || 0}
                            onValueChange={(e) => onChange(e, 'minStock')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                </div>

                {/* Количество */}
                <div className="field mt-5">
                    <label htmlFor="quantity text-xs">Количество</label>
                    <InputNumber
                        mode="decimal"
                        min={0}
                        useGrouping={false}
                        className="border-2 rounded-md p-2"
                        id="quantity"
                        value={productData.quantity || 0}
                        onValueChange={(e) => onChange(e, 'quantity')}
                    />
                </div>
            </div>
        </Dialog>
    );
};
