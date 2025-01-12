import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    FaExchangeAlt,
    FaTruckLoading,
    FaExclamationTriangle,
    FaAngleDown,
    FaAngleUp,
} from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useCompanyStore, useAuthStore } from '../../../store/index';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useDebounce } from '../../../methods/hooks/useDebounce';

const MoveItemsSklad = () => {
    const warehouses = useCompanyStore((state) => state.warehouses);
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sourceWarehouse, setSourceWarehouse] = useState(null);
    const [destinationWarehouse, setDestinationWarehouse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchProducts = useCallback(async () => {
        if (!debouncedSearchTerm) return;
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(
                `/companies/products/${clientId}?&search=${debouncedSearchTerm}`,
            );
            setProducts(data.products);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId, debouncedSearchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearchTerm, fetchProducts]);

    const filteredSourceWarehouses = useMemo(
        () => warehouses.filter((wh) => wh._id !== destinationWarehouse?._id),
        [warehouses, destinationWarehouse],
    );

    const filteredDestinationWarehouses = useMemo(
        () => warehouses.filter((wh) => wh._id !== sourceWarehouse?._id),
        [warehouses, sourceWarehouse],
    );

    const filteredItems = useMemo(
        () =>
            products.filter(
                (item) =>
                    item.warehouse === sourceWarehouse?.name &&
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [products, sourceWarehouse, searchTerm],
    );

    const handleItemSelect = (item) => {
        setSelectedItems((prev) => {
            const exists = prev.find((i) => i._id === item._id);
            if (exists) {
                return prev.filter((i) => i._id !== item._id);
            }
            return [...prev, { ...item, transferQuantity: 1 }];
        });
    };

    const updateTransferQuantity = (itemId, newQuantity, minStock) => {
        if (minStock < newQuantity) {
            return toast.error('Вы превысили минимальный порог количества товара');
        }
        setSelectedItems((prev) =>
            prev.map((item) =>
                item._id === itemId
                    ? { ...item, transferQuantity: Math.min(newQuantity, item.quantity) }
                    : item,
            ),
        );
    };

    const handleTransfer = () => {
        if (!sourceWarehouse || !destinationWarehouse || !selectedItems.length) {
            toast.error(
                'Пожалуйста, выберите исходный склад, целевой склад и товары для перемещения.',
            );
            return;
        }

        setProducts((prevProducts) =>
            prevProducts.map((prod) => {
                const selectedItem = selectedItems.find((si) => si._id === prod._id);
                if (selectedItem) {
                    return { ...prod, quantity: prod.quantity - selectedItem.transferQuantity };
                }
                return prod;
            }),
        );
        setSelectedItems([]);
        setSourceWarehouse(null);
        setDestinationWarehouse(null);
    };

    const CardTitle = ({ className = '', children }) => (
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
    );

    const pendingCount = 7;

    return (
        <div className="bg-white min-w-full p-6 rounded-2xl subtle-border shadow-md max-w-2xl mx-auto">
            <div className="flex flex-row justify-between">
                <div className="flex mb-4 flex-row gap-2">
                    <CardTitle>Перемещение товаров на складе</CardTitle>
                    {pendingCount > 0 && (
                        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                            <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">{pendingCount} действия</span>
                        </div>
                    )}
                </div>
                <div
                    className="mr-4 cursor-pointer text-2xl"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </div>
            </div>

            {!isCollapsed && (
                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 min-h-[72px] mr-5">
                            <label className="block mb-2 font-medium">Исходный склад</label>
                            <Dropdown
                                value={sourceWarehouse}
                                options={filteredSourceWarehouses}
                                onChange={(e) => setSourceWarehouse(e.value)}
                                optionLabel="name"
                                placeholder="Выберите исходный склад"
                                className="w-full border-2 border-blue-500 rounded-md"
                            />
                        </div>
                        <div className="flex items-center min-h-[72px] mb-[-30px]">
                            <FaExchangeAlt className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-h-[72px] ml-5">
                            <label className="block mb-2 font-medium">Целевой склад</label>
                            <Dropdown
                                value={destinationWarehouse}
                                options={filteredDestinationWarehouses}
                                onChange={(e) => setDestinationWarehouse(e.value)}
                                optionLabel="name"
                                placeholder="Выберите целевой склад"
                                className="w-full border-2 border-blue-500 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}

            {!isCollapsed && sourceWarehouse && destinationWarehouse && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Выберите товары</h3>

                    <div className="relative mb-4">
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск товара"
                            className="pl-2 border-blue-500 border-2 rounded-md min-h-[44px]"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto mb-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item._id}
                                className={`p-2 border rounded-xl cursor-pointer ${
                                    selectedItems.some((si) => si._id === item._id)
                                        ? 'bg-blue-100 border-blue-300'
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleItemSelect(item)}
                            >
                                <div className="flex justify-between">
                                    <span>{item.name}</span>
                                    <span>Кол: {item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Выбранные товары</h3>
                            <div className="bg-gray-100 rounded-xl p-2 mb-4">
                                <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
                                    <div>Наименование товара</div>
                                    <div>Количество для перемещения</div>
                                    <div>Текущее количество</div>
                                    <div>Оставшееся</div>
                                    <div>На целевом складе</div>
                                </div>
                                {selectedItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="grid grid-cols-5 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                                    >
                                        <div className="font-medium">{item.name}</div>
                                        <div>
                                            <InputNumber
                                                mode="decimal"
                                                useGrouping={false}
                                                min={1}
                                                max={item.quantity}
                                                // value={item.transferQuantity}
                                                onChange={(e) =>
                                                    updateTransferQuantity(
                                                        item._id,
                                                        parseInt(e.value || 1),
                                                        item.minStock,
                                                    )
                                                }
                                                className="p-1 border rounded"
                                            />
                                        </div>
                                        <div className="text-gray-600">{item.quantity}</div>
                                        <div className="text-blue-600">
                                            {Math.max(0, item.quantity - item.transferQuantity)}
                                        </div>
                                        <div className="text-green-600">
                                            {item.transferQuantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <button
                            onClick={handleTransfer}
                            className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition duration-300"
                            disabled={selectedItems.length === 0}
                        >
                            Переместить товары <FaTruckLoading className="inline-block ml-2" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoveItemsSklad;
