import React, { useEffect, useState, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from './ListOfExpensesData';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { EditProductModal } from '../../../components/EditProductModal';
import { useCompanyStore } from '../../../store';
import { MdEdit } from 'react-icons/md';
import { FaFilter, FaTimes, FaExclamationTriangle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

export default function ListOfExpenses({ title }) {
    const warehouses = useCompanyStore((state) => state.warehouses);
    const products = useCompanyStore((state) => state.products);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const filterRef = useRef(null);

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
        if (products?.length) {
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
        }
    }, [productSearch, selectedWarehouse, products]);

    const handleOutsideClick = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilters(false);
        }
    };
    const CardTitle = ({ className = '', children }) => (
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
    );
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
    const pendingCount = 9;
    return (
        <div className="mx-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[90%]  rounded-2xl subtle-border">
            <div className="flex flex-col justify-between mb-4">
                <div className="flex items-center justify-between flex-col md:flex-row mb-5">
                    <p className="flex text-[1rem] font-semibold align-left">
                        {title ? (
                            title
                        ) : (
                            <div className="flex flex-row justify-between">
                                <div className="flex mb-4 flex-row gap-2">
                                    <CardTitle>Список товаров</CardTitle>
                                    {pendingCount > 0 && (
                                        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                            <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                            <span className="text-sm text-yellow-800">
                                                {pendingCount} действия
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <button
                            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => setEditModalIsVisible(true)}
                        >
                            <MdEdit className="h-5 w-5 text-gray-600" />
                            <span>Редактировать</span>
                        </button>
                        <EditProductModal
                            warehouses={warehouses}
                            items={selectedItems}
                            isOpen={editModalIsVisible}
                            onClose={() => {
                                if (!editModalIsVisible) return;
                                setEditModalIsVisible(false);
                            }}
                        />
                        <button
                            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter className="h-5 w-5 text-gray-600" />
                            <span>Фильтр</span>
                        </button>
                        <div
                            className="mr-4 cursor-pointer text-2xl"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                        </div>
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
                            className="border-blue-500 w-fit border-2 rounded-lg focus:ring-2 focus:ring-blue-300"
                            showClear
                        />
                        <InputText
                            className="border-blue-500 w-full rounded-lg p-2 border-2"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Поиск товара"
                        />
                        <button
                            className="text-red-500 text-xl ml-2"
                            onClick={() => setShowFilters(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}
                {!isCollapsed && (
                    <div className="flex flex-wrap border-solid border-1 rounded-xl px-2 gap-1 w-full">
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
                )}
            </div>
        </div>
    );
}
