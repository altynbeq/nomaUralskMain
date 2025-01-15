import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
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
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
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
    }, [
        clientId,
        filterExceedMinStock,
        lazyParams.page,
        lazyParams.rows,
        productSearch,
        selectedWarehouse,
    ]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, lazyParams, productSearch, selectedWarehouse]);

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
            toast.error('Пожалуйста, выберите товар для редактирования.');
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
                        {!filterExceedMinStock && (
                            <Button
                                onClick={() => setShowAddCategoryModal(true)}
                                label="Добавить категорию"
                                className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            />
                        )}

                        <Button
                            className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                            label="Редактировать"
                            onClick={handleEditClick}
                        />
                        <EditProductModal
                            items={selectedProducts}
                            isOpen={editModalIsVisible}
                            onClose={() => setEditModalIsVisible(false)}
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
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center p-4 border border-gray-300 rounded-lg">
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

            <DataTable
                value={products}
                lazy
                paginator
                first={(lazyParams.page - 1) * lazyParams.rows}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                loading={loading}
                onPage={handlePageChange}
                rowsPerPageOptions={[10, 20, 50, 100]}
                dataKey="id"
                selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Название" />
                <Column field="warehouse.name" header="Склад" />
                <Column field="price" header="Цена" />
                <Column field="quantity" header="Количество" />
                <Column field="minQuantity" header="Мин. количество" />
                <Column field="category.name" header="Категория" />
            </DataTable>
        </div>
    );
}
