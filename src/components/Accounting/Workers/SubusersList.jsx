import { useState, useMemo, useEffect } from 'react';
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

    // Фильтрация отделов на основе выбранного магазина
    const filteredDepartments = useMemo(() => {
        if (selectedStore) {
            return companyStructure.departments.filter(
                (dept) => dept.storeId === selectedStore._id,
            );
        }
        return companyStructure.departments;
    }, [selectedStore, companyStructure.departments]);

    // Сброс выбранного отдела, если он не принадлежит выбранному магазину
    useEffect(() => {
        if (selectedDepartment) {
            const departmentBelongsToStore = filteredDepartments.some(
                (dept) => dept._id === selectedDepartment._id,
            );
            if (!departmentBelongsToStore) {
                setSelectedDepartment(null);
            }
        }
    }, [selectedStore, filteredDepartments, selectedDepartment]);

    // Логика фильтрации сотрудников
    const filteredSubusers = useMemo(() => {
        return companyStructure.subUsers?.filter((subuser) => {
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
    }, [
        companyStructure.subUsers,
        companyStructure.departments,
        searchTerm,
        selectedDepartment,
        selectedStore,
    ]);

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
                    <div className="flex flex-row gap-2">
                        <Dropdown
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.value)}
                            options={companyStructure?.stores || []}
                            optionLabel="storeName"
                            showClear
                            placeholder="Магазин"
                            className="flex-1 border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                        />
                        <Dropdown
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.value)}
                            showClear
                            options={filteredDepartments}
                            optionLabel="name"
                            placeholder="Отдел"
                            className="flex-1 border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                            disabled={filteredDepartments.length === 0}
                        />
                    </div>
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Поиск"
                        className="flex-1 w-full pl-10 p-2 border-2 border-blue-500 rounded-lg"
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

            {/* Модальные окна */}
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
