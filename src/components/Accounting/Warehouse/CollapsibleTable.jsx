import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { isValidDepartmentId } from '../../../methods/isValidDepartmentId';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { formatDate } from '../../../methods/dataFormatter';

export default function CollapsibleTableWithDetails() {
    const [writeOffs, setWriteOffs] = useState([]);
    const [groupedWriteOffs, setGroupedWriteOffs] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [dateRange, setDateRange] = useState(null); // Раньше: const [dates, setDates] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const currentUserId = localStorage.getItem('_id');
        const companyId = localStorage.getItem('companyId');
        const departmentId = localStorage.getItem('departmentId');
        const clientId = isValidDepartmentId(departmentId) ? companyId : currentUserId;

        const fetchWriteOffs = async () => {
            try {
                const response = await fetch(
                    `https://nomalytica-back.onrender.com/api/clientsSpisanie/${clientId}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
                if (response.ok) {
                    const data = await response.json();
                    setWriteOffs(data.writeOffs);
                } else {
                    console.error('Не удалось загрузить данные списаний');
                }
            } catch (error) {
                console.error('Ошибка при получении списаний:', error);
            }
        };

        fetchWriteOffs();
    }, []);

    useEffect(() => {
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
                writeOff.productName.НоменклатураНаименование
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
            );
        }

        const groupedData = {};
        filteredWriteOffs.forEach((writeOff) => {
            const date = new Date(writeOff.date).toISOString().split('T')[0];
            if (!groupedData[date]) {
                groupedData[date] = { date, writeOffs: [], totalSum: 0, totalQuantity: 0 };
            }
            groupedData[date].writeOffs.push(writeOff);
            groupedData[date].totalSum += writeOff.productName.Сумма;
            groupedData[date].totalQuantity += parseInt(writeOff.quantity, 10);
        });

        const groupedWriteOffsArray = Object.values(groupedData);
        setGroupedWriteOffs(groupedWriteOffsArray);
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
                    rowsPerPageOptions={[5, 10, 20]}
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
                    <span className="font-bold text-lg">Cклад:</span>{' '}
                    {selectedRow.warehouse?.warehouseName}
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
        <div className="mx-auto w-full sm:w-[90%] flex flex-col subtle-border p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <h3 className="text-md mb-4 sm:mb-0">Список списаний</h3>
                <div className="flex flex-col sm:flex-row justify-end gap-6 mb-3 w-full sm:w-auto">
                    <Calendar
                        value={dateRange}
                        selectionMode="range"
                        onChange={(e) => setDateRange(e.value)}
                        className="border-blue-500 border-2 rounded-lg p-2 w-full sm:w-auto"
                        placeholder="Выберите период"
                        locale="ru"
                        inputStyle={{ width: '100%' }}
                    />
                    <InputText
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск"
                        className="border-blue-500 border-2 rounded-lg p-2 w-full sm:w-auto"
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
                rowsPerPageOptions={[5, 10, 20]}
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
