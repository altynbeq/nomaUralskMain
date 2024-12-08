import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { formatDate } from '../../../methods/dataFormatter';
import 'primeicons/primeicons.css';
import { useAuthStore } from '../../../store';
import { axiosInstance } from '../../../api/axiosInstance';

export const WriteoffList = () => {
    const [writeOffs, setWriteOffs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const clientId = user.role === 'subUser' ? user.id : user.companyId;

        const fetchWriteOffs = async () => {
            try {
                const response = await axiosInstance.get(`/clientsSpisanie/${clientId}`);
                setWriteOffs(response.data.writeOffs);
            } catch (error) {
                console.error('Ошибка при получении списаний:', error);
            }
        };

        fetchWriteOffs();
    }, [user.companyId, user.id, user.role]);

    // Функция для фильтрации данных
    const getFilteredWriteOffs = () => {
        return writeOffs.filter((item) => {
            const matchesSearch = item.productName.НоменклатураНаименование
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesDate = selectedDate
                ? new Date(item.date).toDateString() === selectedDate.toDateString()
                : true;

            return matchesSearch && matchesDate;
        });
    };

    return (
        <div className="m-16 p-6 subtle-border">
            <h1 className="mb-5">Список списаний</h1>

            {/* Блок фильтров */}
            <div className="flex justify-end gap-10 mb-4">
                <div className="p-col-12 p-md-6">
                    <span className="p-input-icon-left">
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск"
                            className="w-full border-blue-500 border-2 rounded-lg p-2"
                        />
                    </span>
                </div>
                <div className="p-col-12 p-md-4">
                    <Calendar
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.value)}
                        dateFormat="dd.mm.yy"
                        placeholder="Дата"
                        locale="ru"
                        className="w-full border-blue-500 border-2 rounded-lg p-2"
                        showIcon
                        showClearButton
                    />
                </div>
            </div>

            {/* Таблица данных */}
            <DataTable
                value={getFilteredWriteOffs()}
                paginator
                rows={10}
                emptyMessage="Нет данных для отображения"
            >
                <Column field="productName.НоменклатураНаименование" header="Товар" sortable />
                <Column field="organization.storeName" header="Магазин" sortable />
                <Column field="warehouse.warehouseName" header="Склад" sortable />
                <Column field="responsible.name" header="Ответственный" sortable />
                <Column
                    field="date"
                    header="Дата"
                    body={(rowData) => formatDate(rowData.date)}
                    sortable
                />
                <Column field="reason" header="Причина" sortable />
                <Column field="quantity" header="Количество" sortable />
            </DataTable>
        </div>
    );
};
