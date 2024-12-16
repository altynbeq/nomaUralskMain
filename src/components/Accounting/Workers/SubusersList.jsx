import { useState, useMemo, useEffect, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SubuserEditModal } from './SubuserEditModal';
import { SubuserDeleteModal } from './SubuserDeleteModal';
import AlertModal from '../../AlertModal';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';

export const SubusersList = ({ departments, subUsers, stores }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSubuserEditModal, setShowSubuserEditModal] = useState(false);
    const [showSubuserDeleteModal, setShowSubuserDeleteModal] = useState(false);
    const [editingSubuser, setEditingSubuser] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Фильтрация отделов на основе выбранного магазина
    const filteredDepartments = useMemo(() => {
        if (selectedStore) {
            return departments.filter((dept) => dept.storeId === selectedStore._id);
        }
        return departments;
    }, [selectedStore, departments]);

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
        return subUsers?.filter((subuser) => {
            const matchesSearch = subuser.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = selectedDepartment
                ? subuser.departmentId === selectedDepartment._id
                : true;

            const subuserDepartment = departments.find((dept) => dept._id === subuser.departmentId);
            const subuserStoreId = subuserDepartment ? subuserDepartment.storeId : null;

            const matchesStore = selectedStore ? subuserStoreId === selectedStore._id : true;

            return matchesSearch && matchesDepartment && matchesStore;
        });
    }, [subUsers, departments, searchTerm, selectedDepartment, selectedStore]);

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

    const departmentTemplate = (rowData) => (
        <p className="text-sm text-gray-500">
            {rowData.departmentId ? getDepartmentName(rowData.departmentId) : 'Неизвестно'}
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
                className="p-button-rounded text-blue-500 p-button-secondary"
                onClick={() => {
                    setShowSubuserEditModal(true);
                    setEditingSubuser(rowData);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded text-red-500 p-button-danger"
                onClick={() => {
                    setShowSubuserDeleteModal(true);
                    setEditingSubuser(rowData);
                }}
            />
        </div>
    );

    // Создаём мапу для быстрого доступа к названию департамента
    const departmentsMap = useMemo(() => {
        const map = new Map();
        departments?.forEach((dept) => {
            map.set(dept._id, dept.name);
        });
        return map;
    }, [departments]);

    const getDepartmentName = useCallback(
        (departmentId) => {
            return departmentsMap.get(departmentId) ?? 'Неизвестный департамент';
        },
        [departmentsMap],
    );

    return (
        <div className="w-[90%] bg-white rounded-lg shadow-md p-4 subtle-border">
            {/* Верхние фильтры */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <h3 className="flex items-center">Сотрудники</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-row gap-2">
                        <div className="relative">
                            {/* Filter Button */}
                            <button
                                className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <FaFilter />
                                <span>Фильтр</span>
                            </button>

                            {/* Dropdown Content */}
                            {isFilterOpen && (
                                <div className="absolute z-10 min-w-[20vw] bg-white p-4 mt-2 w-fit shadow-lg rounded-lg border border-gray-200">
                                    {/* Department Dropdown */}
                                    <div className="flex justify-end mb-2">
                                        <button
                                            className="text-gray-500 hover:text-red-500"
                                            onClick={() => setIsFilterOpen(false)}
                                        >
                                            <FaTimes className="text-xl" />
                                        </button>
                                    </div>
                                    <Dropdown
                                        value={selectedStore}
                                        onChange={(e) => setSelectedStore(e.value)}
                                        options={stores || []}
                                        optionLabel="storeName"
                                        showClear
                                        placeholder="Магазин"
                                        className="w-full mb-3 border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <Dropdown
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.value)}
                                        showClear
                                        options={filteredDepartments}
                                        optionLabel="name"
                                        placeholder="Отдел"
                                        className="w-full mb-3  border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                                        disabled={filteredDepartments?.length === 0}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск"
                            className="flex-1 w-full pl-10 p-2 border-2 border-blue-500 rounded-lg"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <DataTable value={filteredSubusers} className="w-full">
                <Column header="Сотрудник" body={nameTemplate} />
                <Column header="Департамент" body={departmentTemplate} />
                <Column header="Почта" body={emailTemplate} />
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
