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
    const warehouses = useCompanyStore((state) => state.warehouses) || [];
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sourceWarehouse, setSourceWarehouse] = useState(null);
    const [destinationWarehouse, setDestinationWarehouse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Debounce для оптимизации поиска
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Загружаем товары
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

    // Списки складов (не показываем склад назначения в списке исходных, и наоборот)
    const filteredSourceWarehouses = useMemo(
        () => warehouses.filter((wh) => wh._id !== destinationWarehouse?._id),
        [warehouses, destinationWarehouse],
    );

    const filteredDestinationWarehouses = useMemo(
        () => warehouses.filter((wh) => wh._id !== sourceWarehouse?._id),
        [warehouses, sourceWarehouse],
    );

    // Отфильтрованные товары для исходного склада
    const filteredItems = useMemo(() => {
        return products.filter(
            (item) =>
                item.warehouse === sourceWarehouse?.name &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [products, sourceWarehouse, searchTerm]);

    // Функция для определения, сколько товара сейчас на целевом складе
    const getTargetWarehouseStock = (item) => {
        // Ищем такой же товар (по _id или по name — в реальном проекте лучше по _id) в списке продуктов,
        // но уже для целевого склада
        const foundItem = products.find(
            (p) => p.name === item.name && p.warehouse === destinationWarehouse?.name,
        );
        return foundItem ? foundItem.currentStock : 0;
    };

    // Добавляем или убираем товар из выбранных
    const handleItemSelect = (item) => {
        // Если в исходном складе товара < minStock, уведомляем об этом
        if (item.currentStock < item.minStock) {
            toast.warn(
                `Внимание: товар "${item.name}" в исходном складе уже меньше, чем minStock (${item.minStock}).`,
            );
        }
        setSelectedItems((prev) => {
            const exists = prev.find((i) => i._id === item._id);
            if (exists) {
                // Если товар уже выбран — убираем из списка
                return prev.filter((i) => i._id !== item._id);
            }
            // Иначе добавляем в список (с полем transferQuantity = 1 по умолчанию)
            return [
                ...prev,
                {
                    ...item,
                    transferQuantity: 1, // можно поставить 0 или другое стартовое значение
                },
            ];
        });
    };

    // При изменении количества
    const updateTransferQuantity = (itemId, newQuantity) => {
        setSelectedItems((prev) =>
            prev.map((item) => {
                if (item._id === itemId) {
                    const qty = Number(newQuantity) || 0;

                    // Проверяем, не уходим ли в минус
                    if (qty > item.currentStock) {
                        toast.error('Нельзя переместить больше, чем есть на складе.');
                        return { ...item };
                    }

                    // Сколько останется после перемещения
                    const remainder = item.currentStock - qty;

                    // Если останется меньше, чем minStock, уведомляем
                    if (remainder < item.minStock) {
                        toast.warn(
                            `Внимание: при перемещении ${qty} ед. "${item.name}" остаток (${remainder}) меньше minStock (${item.minStock}).`,
                        );
                    }

                    // Возвращаем обновлённый товар
                    return { ...item, transferQuantity: qty };
                }
                return item;
            }),
        );
    };

    // Кнопка "Переместить товары"
    const handleTransfer = async () => {
        try {
            const response = await axiosInstance.post('companies/move-items', {
                sourceWarehouseId: sourceWarehouse._id,
                destinationWarehouseId: destinationWarehouse._id,
                items: selectedItems.map((item) => ({
                    name: item.name,
                    transferQuantity: item.transferQuantity,
                    currentStock: item.currentStock,
                })),
                companyId: clientId,
            });
            toast.success(response.data.message);
            // Обновить состояние (например, перезагрузить список товаров)
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.error || 'Ошибка при перемещении товаров. Попробуйте снова.',
            );
        }
    };

    // Небольшой под-компонент для заголовка
    const CardTitle = ({ className = '', children }) => (
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
    );

    // Пример: количество «подвешенных» перемещений
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
                                placeholder="Выберите исходный склад"
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
                                placeholder="Выберите целевой склад"
                                className="w-full border-2 border-blue-500 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}

            {!isCollapsed && sourceWarehouse && destinationWarehouse && (
                <div>
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

                    {/* Список товаров на исходном складе */}
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
                                    <span>Кол: {item.currentStock}</span>
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
                                    const targetStock = getTargetWarehouseStock(item);
                                    const remainder =
                                        item.currentStock - (item.transferQuantity || 0);
                                    const newTarget = targetStock + (item.transferQuantity || 0);

                                    return (
                                        <div
                                            key={item._id}
                                            className="grid grid-cols-6 gap-2 items-center bg-white rounded-xl p-2 mb-2 shadow-sm"
                                        >
                                            {/* Наименование */}
                                            <div className="font-medium">{item.name}</div>

                                            {/* minStock */}
                                            <div className="text-red-600">{item.minStock}</div>

                                            {/* Количество для переноса */}
                                            <div>
                                                <InputNumber
                                                    mode="decimal"
                                                    useGrouping={false}
                                                    min={0}
                                                    max={item.currentStock}
                                                    value={item.transferQuantity}
                                                    onChange={(e) => {
                                                        updateTransferQuantity(
                                                            item._id,
                                                            parseInt(e.value || 0),
                                                        );
                                                    }}
                                                    className="border rounded inline-flex"
                                                />
                                            </div>

                                            {/* Текущее количество (currentStock) */}
                                            <div className="text-gray-600">{item.currentStock}</div>

                                            {/* Останется (остаток на исходном) */}
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

                    {/* Кнопка перемещения */}
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
