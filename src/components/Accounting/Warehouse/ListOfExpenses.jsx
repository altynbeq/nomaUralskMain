import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from './ListOfExpensesData';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { EditProductModal } from '../../../components/EditProductModal';
import { useCompanyStore } from '../../../store';

export default function ListOfExpenses() {
    const warehouses = useCompanyStore((state) => state.warehouses);
    const products = useCompanyStore((state) => state.products);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const getWarehouseNameFromProduct = (productName) => {
        const match = productName.match(/\(([^)]+)\)$/);
        return match ? match[1] : null;
    };

    const rows = filteredProducts.map((product, index) => ({
        id: product._id || index,
        НоменклатураНаименование: product.НоменклатураНаименование,
        status: 'Online',
        users: Math.floor(Math.random() * 1000),
        eventCount: Math.floor(Math.random() * 500),
        viewsPerUser: Math.floor(Math.random() * 50),
        averageTime: Math.floor(Math.random() * 50),
        conversions: null,
    }));

    const handleSelectionChange = (ids) => {
        const selected = ids.map((id) =>
            products.find((product) => product._id === id || product.id === id),
        );
        setSelectedItems(selected.filter(Boolean));
    };

    useEffect(() => {
        const filtered = products.filter((product) => {
            const matchesProductSearch = product.НоменклатураНаименование
                .toLowerCase()
                .includes(productSearch.toLowerCase());

            let matchesWarehouse = true;
            if (selectedWarehouse && selectedWarehouse.warehouseName) {
                const productWarehouseName = getWarehouseNameFromProduct(
                    product.КассаККМНаименование,
                );
                matchesWarehouse = productWarehouseName === selectedWarehouse.warehouseName;
            }

            return matchesProductSearch && matchesWarehouse;
        });
        setFilteredProducts(filtered);
    }, [productSearch, selectedWarehouse, products]);

    return (
        <div className="mx-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[90%]  rounded-2xl subtle-border">
            <div className="flex flex-col justify-between mb-4 ">
                <div className="flex items-center justify-between flex-col md:flex-row mb-5">
                    <p className="flex text-[1rem] font-semibold align-left">Список товаров</p>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <div className="flex flex-row gap-2">
                            <Button
                                className=" border-blue-500 border-2 rounded-lg p-2"
                                label="Редактировать"
                                icon="pi pi-file-edit"
                                onClick={() => setEditModalIsVisible(true)}
                            />
                            <EditProductModal
                                warehouses={warehouses}
                                items={selectedItems}
                                isOpen={editModalIsVisible}
                                onClose={() => {
                                    if (!editModalIsVisible) return;
                                    setEditModalIsVisible(false);
                                }}
                            />
                            <Dropdown
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.value)}
                                options={warehouses}
                                optionLabel="warehouseName"
                                placeholder="Склад"
                                className="border-blue-500 w-fit border-2 rounded-lg focus:ring-2 focus:ring-blue-300 "
                                showClear
                            />
                        </div>
                        <div className="flex ">
                            <InputText
                                className="border-blue-500 w-full rounded-lg p-2 border-2"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Поиск товара"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap border-solid border-1 rounded-xl  px-2 gap-1 w-full">
                    <DataGrid
                        autoHeight
                        checkboxSelection
                        rows={rows}
                        columns={columns}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        initialState={{
                            pagination: { paginationModel: { pageSize: 20 } },
                        }}
                        pageSizeOptions={[10, 20, 50]}
                        disableColumnResize
                        onRowSelectionModelChange={handleSelectionChange}
                        density="compact"
                        slotProps={{
                            filterPanel: {
                                filterFormProps: {
                                    logicOperatorInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                    },
                                    columnInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                        sx: { mt: 'auto' },
                                    },
                                    operatorInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                        sx: { mt: 'auto' },
                                    },
                                    valueInputProps: {
                                        InputComponentProps: {
                                            variant: 'outlined',
                                            size: 'small',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
