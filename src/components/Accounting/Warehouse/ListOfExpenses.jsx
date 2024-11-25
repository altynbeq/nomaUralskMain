import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from './ListOfExpensesData';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function ListOfExpenses() {
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState({});
    const [editingSelectedWarehouse, setEditingSelectedWarehouse] = useState({});
    const [warehouses, setWarehouses] = useState([
        { warehouseName: 'Склад 1', id: '1' },
        { warehouseName: 'Склад 2', id: '1' },
        { warehouseName: 'Склад 3', id: '3' },
    ]);
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState('');

    useEffect(() => {
        const companyId = localStorage.getItem('_id');
        if (companyId) {
            const fetchCompanyData = async () => {
                try {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/companies/${companyId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setProducts(data.products);
                    if (data.warehouses) {
                        setWarehouses(
                            data.warehouses.map((warehouseName, index) => ({
                                warehouseName,
                                id: index.toString(),
                            })),
                        );
                    }

                    // setCompanyData(data);

                    // Update warehouses state
                    // if (data.warehouses) {
                    //     setWarehouses(
                    //         data.warehouses.map((warehouseName, index) => ({
                    //             warehouseName,
                    //             id: index.toString(),
                    //         })),
                    //     );
                    // }

                    // If you have a products state, you can set it here
                    // setProducts(data.products);
                } catch (error) {
                    console.error('Error fetching company data:', error);
                }
            };

            fetchCompanyData();
        }
    }, []);

    return (
        <div className="mx-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[90%]  rounded-2xl subtle-border">
            <div className="flex flex-col justify-between mb-4 ">
                <div className="flex items-center justify-between mb-5">
                    <p className="flex text-[1rem] font-semibold align-left">Список списаний</p>
                    <div className="flex gap-6 items-center">
                        <InputText
                            className=" rounded-lg p-2 border-2"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="Поиск товара"
                        />
                        <div>
                            <Button
                                className=" bg-blue-500 text-white rounded-lg p-2"
                                label="Редактировать"
                                icon="pi pi-file-edit"
                                onClick={() => setEditModalIsVisible(true)}
                            />
                            <Dialog
                                header="Редактирование"
                                visible={editModalIsVisible}
                                style={{ width: '50vw' }}
                                onHide={() => {
                                    if (!editModalIsVisible) return;
                                    setEditModalIsVisible(false);
                                }}
                            >
                                <div className="flex flex-col gap-5 mt-4">
                                    {/* Перенос на другой склад */}
                                    <div className="flex items-center gap-4">
                                        <p>Выберите склад:</p>
                                        <Dropdown
                                            value={editingSelectedWarehouse}
                                            onChange={(e) => setEditingSelectedWarehouse(e.value)}
                                            options={warehouses}
                                            optionLabel="warehouseName"
                                            placeholder="Выберите склад"
                                            className="min-w-[220px] bg-blue-500 text-white rounded-lg"
                                        />
                                        <Button
                                            label="Перенести"
                                            className=" bg-blue-500 text-white rounded-lg p-2"
                                            onClick={() => {
                                                console.log('Перенос на склад:', selectedWarehouse);
                                                setEditModalIsVisible(false);
                                            }}
                                        />
                                    </div>

                                    {/* Резерв */}
                                    <Button
                                        label="Резерв"
                                        className="p-button-success max-w-[120px] bg-blue-500 text-white rounded-lg p-2"
                                        icon="pi pi-lock"
                                        onClick={() => {
                                            console.log('Резервировать товар');
                                            // setEditModalIsVisible(false);
                                        }}
                                    />

                                    {/* Удаление */}
                                    <Button
                                        label="Удалить"
                                        className="p-button-danger max-w-[120px] bg-blue-500 text-white rounded-lg p-2"
                                        icon="pi pi-trash"
                                        onClick={() => {
                                            console.log('Удалить товар');
                                            // setEditModalIsVisible(false);
                                        }}
                                    />
                                </div>
                            </Dialog>
                        </div>
                        <Dropdown
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.value)}
                            options={warehouses}
                            optionLabel="warehouseName"
                            placeholder="Выберите склад"
                            className="bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300 min-w-[220px]"
                            showClear
                        />
                    </div>
                    {/* <Dropdown></Dropdown> */}
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
