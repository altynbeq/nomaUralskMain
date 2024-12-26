import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { formatDate } from '../../methods/dataFormatter';

const LatestSalesList = ({ title }) => {
    const [writeOffs, setWriteOffs] = useState([]);
    const [groupedWriteOffs, setGroupedWriteOffs] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Dummy data for testing dummyWriteOffs writeOffs
        const dummySales = [
            {
                id: 1,
                date: '2024-12-20',
                storeName: 'Store A',
                totalSales: 5000,
                numberOfSales: 10,
                writeOffs: [
                    {
                        id: 1,
                        date: '2024-12-20',
                        productName: {
                            НоменклатураНаименование: 'Product A',
                            Сумма: 1000,
                        },
                        quantity: 5,
                        responsible: { name: 'John Doe' },
                        organization: { storeName: 'Store A' },
                        warehouse: { warehouseName: 'Warehouse A' },
                        reason: 'Expired',
                        file: { objectURL: '/images/product-a.jpg' },
                    },
                ],
            },
            {
                id: 2,
                date: '2024-12-21',
                storeName: 'Store B',
                totalSales: 3000,
                numberOfSales: 6,
                writeOffs: [
                    {
                        id: 2,
                        date: '2024-12-21',
                        productName: {
                            НоменклатураНаименование: 'Product B',
                            Сумма: 2000,
                        },
                        quantity: 3,
                        responsible: { name: 'Jane Smith' },
                        organization: { storeName: 'Store B' },
                        warehouse: { warehouseName: 'Warehouse B' },
                        reason: 'Damaged',
                        file: { objectURL: '/images/product-b.jpg' },
                    },
                ],
            },
        ];

        setWriteOffs(dummySales);
    }, []);

    useEffect(() => {
        if (writeOffs?.length) {
            const groupedWriteOffsArray = writeOffs.map((writeOff) => ({
                date: writeOff.date,
                storeName: writeOff.storeName,
                totalSales: writeOff.totalSales,
                numberOfSales: writeOff.numberOfSales,
                writeOffs: writeOff.writeOffs,
            }));

            setGroupedWriteOffs(groupedWriteOffsArray);
        }
    }, [writeOffs]);

    const openModal = (rowData) => {
        setSelectedRow(rowData);
        setModalVisible(true);
    };

    const rowExpansionTemplate = (data) => {
        const salesList = data.writeOffs.length > 10 ? data.writeOffs.slice(0, 10) : data.writeOffs;
        const showPagination = data.writeOffs.length > 10;

        return (
            <div className="cursor-pointer">
                <DataTable
                    value={salesList}
                    onRowClick={(e) => openModal(e.data)}
                    dataKey="id"
                    paginator={showPagination}
                    rows={10}
                >
                    <Column
                        field="productName.НоменклатураНаименование"
                        header="Наименование товара"
                    />
                    <Column field="quantity" header="Количество" />
                    <Column field="productName.Сумма" header="Сумма" />
                    <Column
                        field="date"
                        header="Дата списания"
                        body={(rowData) => formatDate(rowData.date)}
                    />
                    <Column field="responsible.name" header="Ответственный" />
                </DataTable>
            </div>
        );
    };

    const renderModalContent = () => {
        if (!selectedRow) return null;
        return (
            <div className="p-2 md:p-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">
                            Наименование товара
                        </label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.productName?.НоменклатураНаименование || ''}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">Количество</label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.quantity || ''}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">Сумма</label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={`${selectedRow.productName?.Сумма || ''}₸`}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">
                            Дата списания
                        </label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={formatDate(selectedRow.date)}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">
                            Ответственный
                        </label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.responsible?.name || ''}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">Магазин</label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.organization?.storeName || ''}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">Склад</label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.warehouse?.warehouseName || ''}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-lg mb-1 text-gray-700">Причина</label>
                        <input
                            type="text"
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 disabled:opacity-75"
                            value={selectedRow.reason || ''}
                            disabled
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto mb-10 w-[100%] mt-5 sm:w-[90%] flex flex-col subtle-border p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                <h3 className="text-md font-bold mb-4 sm:mb-0">
                    {title ? title : 'Список продаж'}
                </h3>
                <Calendar
                    value={dateRange}
                    selectionMode="range"
                    onChange={(e) => setDateRange(e.value)}
                    className="border-blue-500 border-2 rounded-lg p-2"
                    placeholder="Выберите период"
                    showIcon
                    locale="ru"
                />
            </div>

            <DataTable
                value={groupedWriteOffs}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="date"
            >
                <Column expander style={{ width: '3em', textAlign: 'center' }} />
                <Column field="storeName" header="Магазин" />
                <Column
                    field="date"
                    header="Дата"
                    body={(rowData) => new Date(rowData.date).toLocaleDateString()}
                />
                <Column
                    field="totalSales"
                    header="Сумма продаж"
                    body={(rowData) => `${rowData.totalSales} ₸`}
                />
                <Column
                    field="numberOfSales"
                    header="Количество продаж"
                    body={(rowData) => rowData.numberOfSales}
                />
            </DataTable>

            <Dialog
                visible={isModalVisible}
                onHide={() => setModalVisible(false)}
                header="Детали продажи"
                className="w-[60%] mt-10 md:mt-0 mx-2 sm:mx-auto"
                breakpoints={{ '960px': '90vw' }}
                style={{ padding: '1rem', boxShadow: 'none' }}
            >
                {renderModalContent()}
            </Dialog>
        </div>
    );
};

export default LatestSalesList;
