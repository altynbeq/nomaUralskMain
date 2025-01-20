import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { EditProductModal } from '../../EditProductModal';
import { AddCategoryModal } from './AddCategoryModal';
import { useCompanyStore, useAuthStore } from '../../../store';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

export function Products({ title, filterExceedMinStock }) {
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const warehouses = useCompanyStore((state) => state.warehouses);

    const [products, setProducts] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({ page: 1, rows: 20 });
    const [loading, setLoading] = useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: lazyParams.page,
                limit: lazyParams.rows,
                search: productSearch || '',
            });
            if (selectedWarehouse && selectedWarehouse._id) {
                params.append('warehouseId', selectedWarehouse._id);
            }
            if (filterExceedMinStock) {
                params.append('filterExceedMinStock', true);
            }
            const response = await axiosInstance.get(
                `/products/company/${clientId}?${params.toString()}`,
            );
            setProducts(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        } finally {
            setLoading(false);
        }
    }, [clientId, filterExceedMinStock, lazyParams, productSearch, selectedWarehouse]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handlePageChange = (event) => {
        setLazyParams({
            ...lazyParams,
            page: event.page + 1,
            rows: event.rows,
        });
    };

    const handleFilterToggle = () => {
        setLazyParams({ page: 1, rows: 20 });
        setSelectedWarehouse(null);
        setProductSearch('');
        setShowFilters(!showFilters);
    };

    // const handleOutsideClick = (event) => {
    //     if (filterRef.current && !filterRef.current.contains(event.target)) {
    //         setShowFilters(false);
    //     }
    // };

    // useEffect(() => {
    //     if (showFilters) {
    //         document.addEventListener('mousedown', handleOutsideClick);
    //     } else {
    //         document.removeEventListener('mousedown', handleOutsideClick);
    //     }
    //     return () => {
    //         document.removeEventListener('mousedown', handleOutsideClick);
    //     };
    // }, [showFilters]);

    const CardTitle = ({ children }) => (
        <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
    );

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditModalIsVisible(true);
    };

    // Функции для вычисления общих количеств:
    const getTotalQuantity = (product) => {
        if (product.warehouses && product.warehouses.length > 0) {
            return product.warehouses.reduce((sum, wh) => sum + wh.quantity, 0);
        }
        return product.quantity || 0;
    };
    const getTotalMinQuantity = (product) => {
        if (product.warehouses && product.warehouses.length > 0) {
            return product.warehouses.reduce((sum, wh) => sum + wh.minQuantity, 0);
        }
        return product.minQuantity || 0;
    };

    // Фильтрация на клиенте (если включён filterExceedMinStock) – оставить только товары, у которых общий остаток меньше или равен общему миниму
    const filteredProducts = filterExceedMinStock
        ? products.filter((product) => getTotalQuantity(product) <= getTotalMinQuantity(product))
        : products;

    // Заголовок аккордеона
    const headerTemplate = (product) => {
        const totalQuantity = getTotalQuantity(product);
        const totalMinQuantity = getTotalMinQuantity(product);
        return (
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleEdit(product)}
            >
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-gray-600">
                    Остаток: {totalQuantity} / Мин: {totalMinQuantity}
                </span>
            </div>
        );
    };

    const getWarehouseById = (warehouseId) => {
        return warehouses.find((wh) => wh._id === warehouseId);
    };

    // Рендер таблицы складских данных для товара
    const renderWarehouseData = (warehouseArray) => {
        if (!warehouseArray || warehouseArray.length === 0) {
            return <div>Нет складских данных</div>;
        }
        return (
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-200 p-2 text-left">Склад</th>
                        <th className="border border-gray-200 p-2 text-center">Количество</th>
                        <th className="border border-gray-200 p-2 text-center">Мин. количество</th>
                    </tr>
                </thead>
                <tbody>
                    {warehouseArray.map((whData, index) => {
                        const whObj = getWarehouseById(whData.warehouseId);
                        return (
                            <tr key={index}>
                                <td className="border border-gray-200 p-2">
                                    {whObj ? whObj.name : whData.warehouseId}
                                </td>
                                <td className="border border-gray-200 p-2 text-center">
                                    {whData.quantity}
                                </td>
                                <td className="border border-gray-200 p-2 text-center">
                                    {whData.minQuantity}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="mx-6 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 rounded-2xl subtle-border">
            <div className="flex flex-col justify-between mb-4">
                <div className="flex items-center justify-between flex-col md:flex-row mb-5">
                    <div className="flex text-[1rem] font-semibold">
                        <CardTitle>{title}</CardTitle>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        {!filterExceedMinStock && (
                            <Button
                                onClick={() => setShowAddCategoryModal(true)}
                                label="Добавить категорию"
                                className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            />
                        )}
                        {/* <Button
                            className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            label="Редактировать"
                            onClick={() => {
                                if (!selectedProducts || selectedProducts.length === 0) {
                                    toast.error('Пожалуйста, выберите товар для редактирования.');
                                    return;
                                }
                                setEditModalIsVisible(true);
                            }}
                        /> */}
                        <EditProductModal
                            items={selectedProduct ? [selectedProduct] : []}
                            isOpen={editModalIsVisible}
                            onClose={() => {
                                setEditModalIsVisible(false);
                                setSelectedProduct(null);
                                fetchProducts();
                            }}
                            warehouses={warehouses}
                        />
                        <AddCategoryModal
                            visible={showAddCategoryModal}
                            onClose={setShowAddCategoryModal}
                        />
                        <Button
                            label="Фильтр"
                            icon={<FaFilter />}
                            className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            onClick={handleFilterToggle}
                        />
                    </div>
                </div>

                {showFilters && (
                    <div
                        ref={filterRef}
                        className="flex flex-col md:flex-row gap-2 md:gap-6 items-center p-4 border border-gray-300 rounded-lg"
                    >
                        <Dropdown
                            className="border-2 rounded-md"
                            value={selectedWarehouse}
                            onChange={(e) => {
                                setSelectedWarehouse(e.value);
                                setLazyParams({ ...lazyParams, page: 1 });
                            }}
                            options={warehouses}
                            optionLabel="name"
                            placeholder="Склад"
                            showClear
                        />
                        <InputText
                            className="border-2 rounded-md p-2"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Поиск товара"
                        />
                        <Button
                            icon={<FaTimes />}
                            className="p-button-danger"
                            onClick={handleFilterToggle}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <>
                    <Accordion multiple activeIndex={[]} className="mb-4">
                        {filteredProducts.map((product) => (
                            <AccordionTab key={product._id} header={headerTemplate(product)}>
                                <div className="p-3">
                                    <div className="mb-2">
                                        <strong>Цена:</strong> {product.price}
                                    </div>
                                    {product.description && (
                                        <div className="mb-2">
                                            <strong>Описание:</strong> {product.description}
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="mb-2">
                                            <strong>Категория:</strong> {product.category.name}
                                        </div>
                                    )}
                                    <div>
                                        <strong>Складские данные:</strong>
                                        {renderWarehouseData(product.warehouses)}
                                    </div>
                                </div>
                            </AccordionTab>
                        ))}
                    </Accordion>

                    {/* Пагинация */}
                    <Paginator
                        first={(lazyParams.page - 1) * lazyParams.rows}
                        rows={lazyParams.rows}
                        totalRecords={totalRecords}
                        onPageChange={handlePageChange}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Страница {currentPage} из {totalPages}"
                        className="p-mt-2"
                    />
                </>
            )}
        </div>
    );
}

export default Products;
