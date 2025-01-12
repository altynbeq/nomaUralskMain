import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { formatDate } from '../../../methods/dataFormatter';
import { FaSearch, FaRegCalendarAlt, FaFilter } from 'react-icons/fa';

export function WriteOffs({ title, writeOffs }) {
    const [groupedWriteOffs, setGroupedWriteOffs] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (writeOffs?.length) {
            let filteredWriteOffs = writeOffs;

            if (dateRange && dateRange[0] && dateRange[1]) {
                const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
                const endDate = new Date(dateRange[1]).setHours(23, 59, 59, 999);
                filteredWriteOffs = filteredWriteOffs.filter((writeOff) => {
                    const writeOffDate = new Date(writeOff.date).getTime();
                    return writeOffDate >= startDate && writeOffDate <= endDate;
                });
            }

            if (searchQuery) {
                filteredWriteOffs = filteredWriteOffs.filter((writeOff) =>
                    writeOff.product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
                );
            }

            const groupedData = {};
            filteredWriteOffs.forEach((writeOff) => {
                const date = new Date(writeOff.date).toISOString().split('T')[0];
                if (!groupedData[date]) {
                    groupedData[date] = { date, writeOffs: [], totalSum: 0, totalQuantity: 0 };
                }
                groupedData[date].writeOffs.push(writeOff);
                groupedData[date].totalSum += writeOff.product.name;
                groupedData[date].totalQuantity += parseInt(writeOff.quantity, 10);
            });

            const groupedWriteOffsArray = Object.values(groupedData);
            setGroupedWriteOffs(groupedWriteOffsArray);
        }
    }, [dateRange, writeOffs, searchQuery]);

    const openModal = (rowData) => {
        setSelectedRow(rowData);
        setModalVisible(true);
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="cursor-pointer">
                <DataTable
                    value={data.writeOffs}
                    onRowClick={(e) => openModal(e.data)}
                    dataKey="id"
                    breakpoint="960px"
                    paginator
                    rows={5}
                >
                    <Column field="product.name" header="Наименование товара" />
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
            <div className="flex flex-col gap-2">
                <p>
                    <span className="font-bold text-lg">Наименование товара:</span>{' '}
                    {selectedRow.productName?.НоменклатураНаименование}
                </p>
                <p>
                    <span className="font-bold text-lg">Количество:</span> {selectedRow.quantity}
                </p>
                <p>
                    <span className="font-bold text-lg">Сумма:</span>{' '}
                    {selectedRow.productName?.Сумма}₸
                </p>
                <p>
                    <span className="font-bold text-lg">Дата списания:</span>{' '}
                    {formatDate(selectedRow.date)}
                </p>
                <p>
                    <span className="font-bold text-lg">Ответственный:</span>{' '}
                    {selectedRow.responsible?.name}
                </p>
                <p>
                    <span className="font-bold text-lg">Магазин:</span>{' '}
                    {selectedRow.organization?.storeName}
                </p>
                <p>
                    <span className="font-bold text-lg">Cклад:</span> {selectedRow.warehouse?.name}
                </p>
                <p>
                    <span className="font-bold text-lg">Причина:</span> {selectedRow.reason}
                </p>
                <div className="flex justify-center">
                    <img
                        className="w-full h-auto max-w-md rounded-lg"
                        src={`https://nomalytica-back.onrender.com${selectedRow?.file?.objectURL}`}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto w-[100%] mt-5 sm:w-[90%] flex flex-col subtle-border p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <h3 className="text-lg font-bold ml-2 mb-4 sm:mb-0">
                    {title ? title : 'Список списаний'}
                </h3>
                <div className="flex flex-col sm:flex-row justify-end gap-6 mb-3 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Поиск списаний"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <FaFilter className="h-5 w-5 text-gray-600" />
                        <span>Фильтр</span>
                    </button>
                    <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <FaRegCalendarAlt className="h-5 w-5 text-gray-600" />
                        <span>Дата</span>
                    </button>

                    <Calendar
                        value={dateRange}
                        selectionMode="range"
                        onChange={(e) => setDateRange(e.value)}
                        className="hidden"
                        placeholder="Выберите период"
                        locale="ru"
                        inputStyle={{ width: '100%' }}
                    />
                </div>
            </div>

            <DataTable
                value={groupedWriteOffs}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="date"
                breakpoint="960px"
                paginator
                rows={10}
            >
                <Column expander style={{ width: '3em', textAlign: 'center' }} />
                <Column
                    field="date"
                    header="Дата"
                    body={(rowData) => new Date(rowData.date).toLocaleDateString()}
                />
                <Column
                    field="totalSum"
                    header="Сумма"
                    body={(rowData) => `${rowData.totalSum} ₸`}
                />
                <Column
                    field="totalQuantity"
                    header="Количество"
                    body={(rowData) => rowData.totalQuantity}
                />
            </DataTable>

            <Dialog
                visible={isModalVisible}
                onHide={() => setModalVisible(false)}
                header="Детали списания"
                className="w-full max-w-md mx-2 sm:mx-auto"
                breakpoints={{ '960px': '90vw' }}
                style={{ padding: '1rem' }}
            >
                {renderModalContent()}
            </Dialog>
        </div>
    );
}
