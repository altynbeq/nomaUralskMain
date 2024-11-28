import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useStateContext } from '../../../contexts/ContextProvider';

export const SubusersList = ({ subusers }) => {
    const { companyStructure } = useStateContext();

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Логика фильтрации
    const filteredSubusers = subusers.filter((subuser) => {
        const matchesSearch = subuser.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Фильтр по отделу и магазину, если требуется
        return matchesSearch;
    });

    const nameTemplate = (rowData) => (
        <div className="flex items-center">
            <span className="mr-2">{rowData.icon}</span>
            <div>
                <p className="font-bold">{rowData.name}</p>
                <p className="text-sm text-gray-500">{rowData.rank}</p>
            </div>
        </div>
    );

    const emailTemplate = () => <p className="text-sm text-gray-500">alt.quat@gmail.com</p>;

    const dateTemplate = () => (
        <p className="text-sm text-gray-500">{new Date().toISOString().split('T')[0]}</p>
    );

    const actionTemplate = () => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary" />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" />
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-4 m-16">
            {/* Верхние фильтры */}
            <div className="flex gap-4 justify-between mb-4">
                <h3 className="flex items-center">Сотрудники</h3>
                <div className="flex gap-4">
                    <Dropdown
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.value)}
                        showClear
                        options={companyStructure?.departments || []}
                        optionLabel="name"
                        placeholder="Выберите отдел"
                        className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.value)}
                        options={companyStructure?.stores || []}
                        optionLabel="storeName"
                        showClear
                        placeholder="Выберите магазин"
                        className="flex-1 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Поиск"
                        className="flex-1 w-full pl-10 p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            {/* Таблица */}
            <DataTable value={filteredSubusers} className="w-full">
                <Column header="Сотрудник" body={nameTemplate} />
                <Column header="Email" body={emailTemplate} />
                <Column header="Дата" body={dateTemplate} />
                <Column header="Действия" body={actionTemplate} />
            </DataTable>
        </div>
    );
};
