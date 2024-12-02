import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { isValidDepartmentId } from '../../../methods/isValidDepartmentId';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { formatDate } from '../../../methods/dataFormatter';

export default function CollapsibleTableWithDetails() {
    const [writeOffs, setWriteOffs] = useState([]);
    const [groupedWriteOffs, setGroupedWriteOffs] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [dates, setDates] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
        // Фильтрация списаний по выбранным датам
        let filteredWriteOffs = writeOffs;

        if (dates) {
            const selectedDate = new Date(dates).setHours(0, 0, 0, 0); // Нормализуем выбранную дату
            filteredWriteOffs = filteredWriteOffs.filter((writeOff) => {
                const writeOffDate = new Date(writeOff.date).setHours(0, 0, 0, 0); // Нормализуем дату списания
                return writeOffDate === selectedDate;
            });
        }

        // Фильтрация по поисковому запросу
        if (searchQuery) {
            filteredWriteOffs = filteredWriteOffs.filter((writeOff) =>
                writeOff.productName.НоменклатураНаименование
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
            );
        }

        // Группировка списаний по дате
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

        // Преобразование в массив для отображения
        const groupedWriteOffsArray = Object.values(groupedData);
        setGroupedWriteOffs(groupedWriteOffsArray);
    }, [dates, writeOffs, searchQuery]);

    const rowExpansionTemplate = (data) => {
        return (
            <DataTable value={data.writeOffs}>
                <Column field="productName.НоменклатураНаименование" header="Наименование товара" />
                <Column field="quantity" header="Количество" />
                <Column field="productName.Сумма" header="Сумма" />
                <Column
                    field="date"
                    header="Дата списания"
                    body={(rowData) => formatDate(rowData.date)}
                />
                <Column field="responsible.name" header="Ответственный" />
            </DataTable>
        );
    };

    return (
        <div className="mx-auto w-[90%] flex flex-col subtle-border p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-md">Список списаний</h3>
                <div className="flex justify-end gap-6 mb-3">
                    <Calendar
                        value={dates}
                        onChange={(e) => setDates(e.value)}
                        className="border-blue-500 border-2 rounded-lg p-2"
                        placeholder="Дата"
                        locale="ru"
                    />
                    <InputText
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск"
                        className="border-blue-500 border-2 rounded-lg p-2"
                    />
                </div>
            </div>

            <DataTable
                value={groupedWriteOffs}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="date"
            >
                <Column expander style={{ width: '3em', textAlign: 'center' }} />
                <Column
                    field="date"
                    header="Дата"
                    body={(rowData) => new Date(rowData.date).toLocaleDateString()}
                    style={{ padding: '10px 20px' }}
                />
                <Column
                    field="totalSum"
                    header="Сумма"
                    body={(rowData) => `${rowData.totalSum} ₸`}
                    style={{ padding: '10px 20px', textAlign: 'left' }}
                />
                <Column
                    field="totalQuantity"
                    header="Количество"
                    body={(rowData) => rowData.totalQuantity}
                    style={{ padding: '10px 20px', textAlign: 'left' }}
                />
            </DataTable>
        </div>
    );
}
