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
            const warehouseParam = sourceWarehouse?._id
                ? `&warehouseId=${sourceWarehouse._id}`
                : '';
            const url = `/products/company/${clientId}?search=${debouncedSearchTerm}${warehouseParam}`;
            const { data } = await axiosInstance.get(url);
            setProducts(data.data);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId, debouncedSearchTerm, sourceWarehouse?._id]);

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

    const filteredItems = useMemo(() => {
        return products.filter(
            (item) =>
                item.warehouse?.id === sourceWarehouse?.id &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [products, sourceWarehouse, searchTerm]);

    const getTargetWarehouseStock = (item) => {
        if (!destinationWarehouse) return 0;
        const foundItem = products.find(
            (p) => p.id === item.id && p.warehouse?._id === destinationWarehouse?._id,
        );
        return foundItem ? foundItem.quantity : 0;
    };

    const handleItemSelect = (item) => {
        setSelectedItems((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.filter((i) => i.id !== item.id);
            }
            return [
                ...prev,
                {
                    ...item,
                    transferQuantity: 1,
                },
            ];
        });
    };

    const updateTransferQuantity = (itemId, newQuantity) => {
        setSelectedItems((prev) =>
            prev.map((item) => {
                if (item.id === itemId) {
                    const qty = Number(newQuantity) || 0;

                    if (qty > item.quantity) {
                        return item;
                    }

                    const remainder = item.quantity - qty;
                    if (remainder < item.minQuantity) {
                        toast.warn(
                            `Внимание: после переноса ${qty} ед. "${item.name}", остаток (${remainder}) будет меньше minQuantity (${item.minQuantity}).`,
                        );
                    }

                    return { ...item, transferQuantity: qty };
                }
                return item;
            }),
        );
    };

    const handleTransfer = async () => {
        if (!sourceWarehouse || !destinationWarehouse) {
            toast.error('Нужно выбрать исходный и целевой склады.');
            return;
        }
        try {
            const items = selectedItems.map((item) => ({
                productId: item.id,
                quantityToTransfer: item.transferQuantity,
            }));

            const response = await axiosInstance.post('products/transfer', {
                sourceWarehouseId: sourceWarehouse._id,
                destinationWarehouseId: destinationWarehouse._id,
                items,
                companyId: clientId,
            });
            toast.success(response.data.message || 'Товары успешно перемещены!');
            fetchProducts();
            setSelectedItems([]);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.error || 'Ошибка при перемещении товаров. Попробуйте снова.',
            );
        }
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

            {/* Если панель открыта */}
            {!isCollapsed && (
                <>
                    {/* Выбор складов */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            {/* Исходный склад */}
                            <div className="flex-1 min-h-[72px] mr-5">
                                <label className="block mb-2 font-medium">Исходный склад</label>
                                <Dropdown
                                    value={sourceWarehouse}
                                    options={filteredSourceWarehouses}
                                    onChange={(e) => {
                                        setSourceWarehouse(e.value);
                                        setSelectedItems([]);
                                    }}
                                    optionLabel="name"
                                    placeholder="Выберите склад-источник"
                                    className="w-full border-2 border-blue-500 rounded-md"
                                />
                            </div>

                            <div className="flex items-center min-h-[72px] mb-[-30px]">
                                <FaExchangeAlt className="text-blue-500" />
                            </div>

                            {/* Целевой склад */}
                            <div className="flex-1 min-h-[72px] ml-5">
                                <label className="block mb-2 font-medium">Целевой склад</label>
                                <Dropdown
                                    value={destinationWarehouse}
                                    options={filteredDestinationWarehouses}
                                    onChange={(e) => {
                                        setDestinationWarehouse(e.value);
                                        setSelectedItems([]);
                                    }}
                                    optionLabel="name"
                                    placeholder="Выберите склад-получатель"
                                    className="w-full border-2 border-blue-500 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Если выбраны оба склада */}
                    {sourceWarehouse && destinationWarehouse && (
                        <>
                            {/* Поиск товаров */}
                            <h3 className="text-lg font-semibold mb-2">Выберите товары</h3>
                            <div className="relative mb-4">
                                <InputText
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Поиск товара"
                                    className="pl-2 border-blue-500 border-2 rounded-md min-h-[44px]"
                                />
                            </div>

                            {/* Список товаров исходного склада */}
                            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto mb-4">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-2 border rounded-xl cursor-pointer ${
                                            selectedItems.some((si) => si.id === item.id)
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

                            {/* Секция выбранных товаров */}
                            {selectedItems.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Выбранные товары</h3>
                                    <div className="bg-gray-100 rounded-xl p-2 mb-4">
                                        {/* Шапка */}
                                        <div className="grid grid-cols-6 gap-2 mb-2 font-semibold text-gray-700">
                                            <div>Товар</div>
                                            <div>Минимальный остаток</div>
                                            <div>Перенос</div>
                                            <div>Исходный остаток</div>
                                            <div>Останется</div>
                                            <div>На целевом складе (будет)</div>
                                        </div>

                                        {selectedItems.map((item) => {
                                            // Текущее количество на целевом складе
                                            const targetStock = getTargetWarehouseStock(item);
                                            // Сколько останется на исходном (не допускаем отрицательных)
                                            const remainder =
                                                item.quantity - (item.transferQuantity || 0);
                                            const newTarget =
                                                targetStock + (item.transferQuantity || 0);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                                                >
                                                    {/* Название */}
                                                    <div className="font-medium">{item.name}</div>

                                                    {/* minQuantity */}
                                                    <div className="text-red-600">
                                                        {item.minQuantity}
                                                    </div>

                                                    {/* Инпут для переноса */}
                                                    <div>
                                                        <InputNumber
                                                            mode="decimal"
                                                            useGrouping={false}
                                                            min={0}
                                                            max={item.quantity}
                                                            value={item.transferQuantity}
                                                            onChange={(e) => {
                                                                updateTransferQuantity(
                                                                    item.id,
                                                                    parseInt(e.value || 0, 10),
                                                                );
                                                            }}
                                                            className="w-full text-center border rounded"
                                                            style={{ width: '100%' }} // Убедитесь, что ширина инпута равномерная
                                                        />
                                                    </div>

                                                    {/* Исходный остаток */}
                                                    <div className="text-gray-600">
                                                        {item.quantity}
                                                    </div>

                                                    {/* Останется */}
                                                    <div className="text-blue-600 font-semibold">
                                                        {remainder < 0 ? 0 : remainder}
                                                    </div>

                                                    {/* Будет на целевом складе */}
                                                    <div className="text-green-600 font-semibold">
                                                        {newTarget}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Кнопка "Переместить товары" */}
                            <div className="text-center mt-4">
                                <button
                                    onClick={handleTransfer}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition duration-300"
                                    disabled={selectedItems.length === 0}
                                >
                                    Переместить товары{' '}
                                    <FaTruckLoading className="inline-block ml-2" />
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MoveItemsSklad;
