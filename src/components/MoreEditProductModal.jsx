import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { axiosInstance } from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const MoreEditProductModal = ({ isOpen, onClose, product, categories }) => {
    const [productData, setProductData] = useState(product || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setProductData(product || null);
    }, [product]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const { warehouse, ...updatedProductData } = productData;
            const response = await axiosInstance.put(`/products/${product._id}`, {
                ...updatedProductData,
                // Передаем id категории, если категория выбрана
                category: updatedProductData?.category ? updatedProductData.category._id : null,
                warehouseId: product.warehouses[0].warehouseId,
            });
            toast.success(response.data.message || 'Вы успешно обновили товар');
        } catch (error) {
            console.error(error);
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

    // Обработка изменения выбранной категории. Найдем объект категории по его _id.
    const onCategoryChange = (e) => {
        const selectedId = e.value;
        const selectedCategory = categories.find((cat) => cat._id === selectedId) || null;
        onChange({ value: selectedCategory }, 'category');
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
                        value={productData?.name || ''}
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
                            value={productData?.price}
                            onValueChange={(e) => onChange(e, 'price')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                    <div className="col mt-5">
                        <label htmlFor="currentStock text-xs">Остаток</label>
                        <InputNumber
                            id="quantity"
                            className="border-2 rounded-md p-2"
                            value={productData?.quantity}
                            onValueChange={(e) => onChange(e, 'quantity')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                    <div className="col mt-5">
                        <label htmlFor="minStock text-xs">Мин. Остаток</label>
                        <InputNumber
                            className="border-2 rounded-md p-2"
                            id="minQuantity"
                            value={productData?.minQuantity}
                            onValueChange={(e) => onChange(e, 'minQuantity')}
                            mode="decimal"
                            min={0}
                            useGrouping={false}
                        />
                    </div>
                </div>
                <div className="field mt-5">
                    <Dropdown
                        value={productData?.category ? productData.category._id : null}
                        onChange={onCategoryChange}
                        options={categories || []}
                        optionLabel="name"
                        optionValue="_id"
                        placeholder="Выберите категорию"
                        showClear
                        className="w-full border-2 rounded-md"
                    />
                </div>
            </div>
        </Dialog>
    );
};
