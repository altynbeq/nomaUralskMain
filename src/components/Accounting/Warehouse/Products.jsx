import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { EditProductModal } from '../../EditProductModal';
import { useCompanyStore, useAuthStore } from '../../../store';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { axiosInstance } from '../../../api/axiosInstance';

export function Products({ title, filterExceedMinStock }) {
    const clientId = useAuthStore((state) => state.user.companyId || state.user.id);
    const warehouses = useCompanyStore((state) => state.warehouses);

    const [products, setProducts] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    // page: текущая страница (начиная с 1), rows: количество записей на странице
    const [lazyParams, setLazyParams] = useState({ page: 1, rows: 20 });
    const [loading, setLoading] = useState(false);

    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const filterRef = useRef(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                filterExceedMinStock
                    ? `/companies/products/${clientId}?page=${lazyParams.page}&limit=${lazyParams.rows}&search=${productSearch}&exceedMinStock=true`
                    : `/companies/products/${clientId}?page=${lazyParams.page}&limit=${lazyParams.rows}&search=${productSearch}`,
            );
            setProducts(response.data.products);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        } finally {
            setLoading(false);
        }
    }, [clientId, filterExceedMinStock, lazyParams.page, lazyParams.rows, productSearch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, lazyParams, productSearch]);

    // Событие при переключении страницы или изменении количества строк
    const handlePageChange = (event) => {
        setLazyParams({
            ...lazyParams,
            // PrimeReact использует 0-based нумерацию страниц, поэтому добавляем +1
            page: event.page + 1,
            rows: event.rows,
        });
    };

    const handleFilterToggle = () => {
        setShowFilters(!showFilters);
    };

    const handleOutsideClick = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilters(false);
        }
    };

    useEffect(() => {
        if (showFilters) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showFilters]);

    const CardTitle = ({ children }) => (
        <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
    );

    const handleEditClick = () => {
        if (selectedProducts.length === 0) {
            alert('Пожалуйста, выберите товар для редактирования.');
            return;
        }
        setEditModalIsVisible(true);
    };

    return (
        <div className="mx-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[90%] rounded-2xl subtle-border">
            <div className="flex flex-col justify-between mb-4">
                <div className="flex items-center justify-between flex-col md:flex-row mb-5">
                    <div className="flex text-[1rem] font-semibold align-left">
                        <CardTitle>{title}</CardTitle>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <Button
                            className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            label="Редактировать"
                            onClick={handleEditClick}
                        />
                        <EditProductModal
                            items={selectedProducts}
                            isOpen={editModalIsVisible}
                            onClose={() => setEditModalIsVisible(false)}
                            warehouses={warehouses} // Передаём склады, если нужно
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
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.value)}
                            options={warehouses}
                            optionLabel="warehouseName"
                            placeholder="Склад"
                            showClear
                        />
                        <InputText
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

            <DataTable
                value={products}
                // Включаем режим "ленивой" загрузки (server-side pagination)
                lazy
                paginator
                // Указываем смещение (first) и общее число записей
                first={(lazyParams.page - 1) * lazyParams.rows}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                loading={loading}
                // При переходе на другую страницу или смене кол-ва строк срабатывает handlePageChange
                onPage={handlePageChange}
                // Переключение количества строк доступно через rowsPerPageOptions
                rowsPerPageOptions={[10, 20, 50, 100]}
                dataKey="_id"
                selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Название" />
                <Column field="warehouse" header="Склад" />
                <Column field="price" header="Цена" />
                <Column field="currentStock" header="Остаток" />
                <Column field="minStock" header="Мин. Остаток" />
                <Column field="quantity" header="Количество" />
            </DataTable>
        </div>
    );
}
