import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';

export const MoreEditProductModal = ({ isOpen, onClose, product }) => {
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const [currentStock, setCurrentStock] = useState(product?.currentStock || 0);
    const [minStock, setMinStock] = useState(product?.minStock || 0);
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setProductData(product);
    }, [product]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = axiosInstance.put(
                `/companies/products/${clientId}/${product._id}`,
                productData,
            );
            if (response.status === 200) {
                toast.success('Вы успешно обновили товар');
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setIsLoading(false);
        }
        onClose();
    };

    const onChange = (e, field) => {
        setProductData((prev) => {
            return {
                ...prev,
                [field]: e.target.value,
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:text-red-500 hover:bg-gray-300"
                >
                    ✖
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold mb-6">Редактирование товара</h2>

                {/* Product Name */}
                <div className="mb-4">
                    <label htmlFor="productName" className="block text-gray-700 font-medium mb-2">
                        Название товара
                    </label>
                    <input
                        type="text"
                        id="productName"
                        value={productData.name}
                        onChange={(e) => onChange(e, 'name')}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>

                {/* Stock and Min Stock */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label
                            htmlFor="currentStock"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Остаток
                        </label>
                        <input
                            type="number"
                            id="currentStock"
                            value={currentStock}
                            onChange={(e) => setCurrentStock(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="minStock" className="block text-gray-700 font-medium mb-2">
                            Мин. Остаток
                        </label>
                        <input
                            type="number"
                            id="minStock"
                            value={minStock}
                            onChange={(e) => setMinStock(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                </div>

                {/* Arrival */}
                <div className="mb-4">
                    <label htmlFor="arrival" className="block text-gray-700 font-medium mb-2">
                        Количество
                    </label>
                    <input
                        type="text"
                        id="arrival"
                        value={productData.quantity}
                        onChange={(e) => onChange(e, 'quantity')}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>

                {/* Save Button */}
                <Button
                    disabled={isLoading}
                    onClick={handleSave}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center"
                >
                    Сохранить
                </Button>
            </div>
        </div>
    );
};
