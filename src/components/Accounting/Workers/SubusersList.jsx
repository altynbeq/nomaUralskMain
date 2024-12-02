import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useStateContext } from '../../../contexts/ContextProvider';
import { SubuserEditModal } from './SubuserEditModal';
import { SubuserDeleteModal } from './SubuserDeleteModal';
import AlertModal from '../../AlertModal';

export const SubusersList = () => {
    const { companyStructure } = useStateContext();

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSubuserEditModal, setShowSubuserEditModal] = useState(false);
    const [showSubuserDeleteModal, setShowSubuserDeleteModal] = useState(false);
    const [editingSubuser, setEditingSubuser] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);

    // Логика фильтрации
    const filteredSubusers = companyStructure.subUsers?.filter((subuser) => {
        const matchesSearch = subuser.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment
            ? subuser.departmentId === selectedDepartment._id
            : true;

        const subuserDepartment = companyStructure.departments.find(
            (dept) => dept._id === subuser.departmentId,
        );
        const subuserStoreId = subuserDepartment ? subuserDepartment.storeId : null;

        const matchesStore = selectedStore ? subuserStoreId === selectedStore._id : true;

        return matchesSearch && matchesDepartment && matchesStore;
    });

    const nameTemplate = (rowData) => (
        <div className="flex items-center">
            {rowData.icon && <span className="mr-2">{rowData.icon}</span>}
            <div>
                <p className="font-bold">{rowData.name}</p>
                <p className="text-sm text-gray-500">{rowData.rank}</p>
            </div>
        </div>
    );

    const emailTemplate = (rowData) => (
        <p className="text-sm text-gray-500">{rowData.email || 'Не указан'}</p>
    );

    const dateTemplate = (rowData) => (
        <p className="text-sm text-gray-500">
            {rowData.createdAt ? new Date(rowData.createdAt).toLocaleDateString() : 'Неизвестно'}
        </p>
    );

    const onSuccessEditing = () => {
        setShowSubuserEditModal(false);
        setShowAlertModal(true);
    };

    const onSuccessDeleting = () => {
        setShowSubuserDeleteModal(false);
        setShowAlertModal(true);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-secondary"
                onClick={() => {
                    setShowSubuserEditModal(true);
                    setEditingSubuser(rowData);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => {
                    setShowSubuserDeleteModal(true);
                    setEditingSubuser(rowData);
                }}
            />
        </div>
    );

    return (
        <div className="w-[90%] bg-white rounded-lg shadow-md p-4">
            {/* Верхние фильтры */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <h3 className="flex items-center">Сотрудники</h3>
                <div className="flex flex-col md:flex-row gap-4">
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
            <SubuserEditModal
                onSuccess={onSuccessEditing}
                subuser={editingSubuser}
                isVisible={showSubuserEditModal}
                onClose={() => setShowSubuserEditModal(false)}
            />
            <SubuserDeleteModal
                onSuccess={onSuccessDeleting}
                onClose={() => setShowSubuserDeleteModal(false)}
                isVisible={showSubuserDeleteModal}
                subuserId={editingSubuser?._id || ''}
            />
            <AlertModal
                message="Вы успешно обновили данные сотрудника"
                open={showAlertModal}
                onClose={() => setShowAlertModal(false)}
            />
        </div>
    );
};
