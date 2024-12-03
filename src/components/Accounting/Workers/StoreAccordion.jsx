// StoreAccordion.jsx
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import AlertModal from '../../AlertModal';
import { ProfileModal } from '../../Accounting/Workers/ProfileModal';
import { AnalyticsAccess } from '../../Accounting/Workers/AnalyticsAccess';
import { DataEditing } from '../../Accounting/Workers/DataEditing';
import {
    DEPARTMENT_ANALYTICS_PRIVILEGES,
    DEPARTMENT_EDITING_PRIVILEGES,
} from '../../../models/Department';
import PropTypes from 'prop-types';
import { StoreDetails } from './StoreDetails';

export const StoreAccordion = ({ stores, departments }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeStoreId, setActiveStoreId] = useState(null);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModalText, setAlertModalText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
    const [editedDepartmentName, setEditedDepartmentName] = useState('');
    const [selectedEditingDepartment, setSelectedEditingDepartment] = useState(null);
    const [departmentDetailsModal, setDepartmentDetailsModal] = useState({});
    const [analyticsAccess, setAnalyticsAccess] = useState([]);
    const [dataEditingAccess, setDataEditingAccess] = useState([]);
    const [initialAccess, setInitialAccess] = useState(null);
    const [showStoreInfoModal, setShowStoreInfoModal] = useState(false);
    const [selectedStoreInfo, setSelectedStoreInfo] = useState(null);

    // Обработчик изменения вкладки
    const onTabChange = (e) => {
        const newIndex = e.index === activeIndex ? null : e.index;
        setActiveIndex(newIndex);
        setActiveStoreId(newIndex !== null ? stores[newIndex]._id : null);
    };

    // Фильтрация департаментов при изменении activeStoreId
    useEffect(() => {
        if (activeStoreId) {
            const filtered = departments.filter((dept) => dept.storeId === activeStoreId);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
        }
    }, [activeStoreId, departments]);

    // Обработчики событий
    const handleEditDepartment = (deptName) => {
        setEditedDepartmentName(deptName);
        setShowEditDepartmentModal(true);
    };

    const handleDeleteDepartment = (dept) => {
        console.log('Удалить департамент:', dept);
        // Реализуйте логику удаления
    };

    const handleAddDepartment = (storeId) => {
        setShowAddDepartmentModal(true);
    };

    const addDeparmentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/departments/create-department/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        storeId: activeStoreId,
                        name: departmentName,
                    }),
                },
            );
            if (response.ok) {
                setShowAlertModal(true);
                setShowAddDepartmentModal(false);
                setAlertModalText('Вы успешно добавили департамент.');
            }
        } catch {
            setShowAlertModal(true);
            setAlertModalText('Не удалось добавить департемент, попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const editDeparmentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/departments/update-department/${selectedEditingDepartment._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: editedDepartmentName,
                    }),
                },
            );
            if (response.ok) {
                setShowAlertModal(true);
                setShowEditDepartmentModal(false);
                setSelectedEditingDepartment(null);
                setEditedDepartmentName('');
                setAlertModalText('Вы успешно изменили департамент.');
            }
        } catch {
            setShowAlertModal(true);
            setAlertModalText('Не удалось изменить департемент, попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyClick = () => {
        const companyId = localStorage.getItem('_id');
        navigator.clipboard
            .writeText(`${departmentDetailsModal?.departmentLink}&companyId=${companyId}`)
            .then(() => {
                setShowAlertModal(true);
                setDepartmentDetailsModal({});
                setAlertModalText('Вы успешно скопировали ссылку');
            })
            .catch(() => {
                setShowAlertModal(true);
                setDepartmentDetailsModal({});
                setAlertModalText('Не удалось скопировать ссылку.');
            });
    };

    const handleDepartmentDetailsClick = (dept) => {
        setDepartmentDetailsModal(dept);
        const fetchAccesses = async (deptId) => {
            try {
                const result = await fetch(
                    `https://nomalytica-back.onrender.com/api/access/access-and-subusers/${deptId}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );

                const data = await result.json();

                if (data && data.access) {
                    setInitialAccess(data.access);
                    const analyticsAccessFromBackend = Object.keys(data.access.Analytics).filter(
                        (key) => data.access.Analytics[key] === true,
                    );

                    const editingAccessFromBackend = data.access.DataManagement ? ['Allow'] : [];
                    setAnalyticsAccess(analyticsAccessFromBackend);
                    setDataEditingAccess(editingAccessFromBackend);
                } else {
                    setInitialAccess(null);
                }
            } catch (error) {
                console.error('Error fetching accesses:', error);
                setInitialAccess(null);
            }
        };
        !!dept._id && fetchAccesses(dept._id);
    };

    const mapPrivilegesToBackend = () => {
        const analyticsPrivileges = Object.keys(DEPARTMENT_ANALYTICS_PRIVILEGES)
            .filter((key) => isNaN(Number(key)))
            .reduce((acc, key) => {
                acc[key] = analyticsAccess.includes(key);
                return acc;
            }, {});

        const editingPrivileges = Object.keys(DEPARTMENT_EDITING_PRIVILEGES)
            .filter((key) => isNaN(Number(key)))
            .reduce((acc, key) => {
                acc[key] = dataEditingAccess.includes(key);
                return acc;
            }, {});

        return {
            Analytics: analyticsPrivileges,
            DataManagement: editingPrivileges['Allow'],
        };
    };

    const handleSave = async () => {
        const privileges = mapPrivilegesToBackend();
        try {
            const response = await fetch(
                'https://nomalytica-back.onrender.com/api/access/create-access',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...privileges,
                        departmentId: departmentDetailsModal._id,
                    }),
                },
            );

            if (response.ok) {
                setShowAlertModal(true);
                setAlertModalText('Вы успешно изменили доступы.');
                setDepartmentDetailsModal({});
            }
        } catch {
            setShowAlertModal(true);
            setAlertModalText('Не удалось изменить доступы.');
        }
    };

    const arePrivilegesDifferent = () => {
        if (!initialAccess) return true;

        const currentPrivileges = mapPrivilegesToBackend();

        const analyticsEqual =
            JSON.stringify(currentPrivileges.Analytics) === JSON.stringify(initialAccess.Analytics);

        const dataManagementEqual =
            currentPrivileges.DataManagement === initialAccess.DataManagement;

        return !(analyticsEqual && dataManagementEqual);
    };

    const handleUpdate = async () => {
        if (!initialAccess || !initialAccess._id) {
            return;
        }

        const privileges = mapPrivilegesToBackend();
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/access/update-access/${initialAccess._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(privileges),
                },
            );

            if (response.ok) {
                setShowAlertModal(true);
                setAlertModalText('Вы успешно изменили доступы.');
                setDepartmentDetailsModal({});
            }
        } catch {
            setShowAlertModal(true);
            setAlertModalText('Не удалось изменить доступы.');
        }
    };

    const handleAction = () => {
        if (arePrivilegesDifferent()) {
            if (initialAccess && initialAccess._id) {
                handleUpdate();
            } else {
                handleSave();
            }
        }
    };

    // Обработчик кнопки информации
    const handleStoreInfo = (store) => {
        setSelectedStoreInfo(store);
        setShowStoreInfoModal(true);
    };

    return (
        <div className="mx-auto w-full sm:w-[90%] p-4">
            <Accordion activeIndex={activeIndex} onTabChange={onTabChange}>
                {stores.map((store, index) => (
                    <AccordionTab
                        key={store._id}
                        header={
                            <div className="flex justify-between items-center w-full">
                                <span>{store.storeName}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Предотвращаем переключение аккордеона
                                        handleStoreInfo(store);
                                    }}
                                    className="p-button-text p-0"
                                    aria-label={`Информация о магазине ${store.storeName}`}
                                >
                                    <i
                                        className="pi pi-info-circle"
                                        style={{ fontSize: '1.2rem' }}
                                    ></i>
                                </button>
                            </div>
                        }
                    >
                        {activeIndex === index && (
                            <div className="p-4">
                                <ul className="list-none p-0 flex flex-col gap-4">
                                    {filteredDepartments.length > 0 ? (
                                        filteredDepartments.map((dept) => (
                                            <li
                                                onClick={() => handleDepartmentDetailsClick(dept)}
                                                key={dept._id}
                                                className="flex justify-between items-center mb-2 cursor-pointer"
                                            >
                                                <span className="text-black">{dept.name}</span>
                                                <div>
                                                    <Button
                                                        icon="pi pi-pencil"
                                                        className="p-button-text text-blue-500 mr-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Предотвращаем открытие деталей департамента
                                                            handleEditDepartment(dept.name);
                                                            setSelectedEditingDepartment(dept);
                                                        }}
                                                        aria-label={`Редактировать департамент ${dept.name}`}
                                                    />
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-text text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Предотвращаем открытие деталей департамента
                                                            handleDeleteDepartment(dept);
                                                        }}
                                                        aria-label={`Удалить департамент ${dept.name}`}
                                                    />
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Департаменты отсутствуют.</li>
                                    )}
                                </ul>
                                <Button
                                    label="Добавить департамент"
                                    icon="pi pi-plus"
                                    className="mt-4 p-button-success"
                                    onClick={() => handleAddDepartment(activeStoreId)}
                                />
                            </div>
                        )}
                    </AccordionTab>
                ))}
            </Accordion>

            {/* Модальное окно для добавления департамента */}
            <Dialog
                header="Добавить департамент"
                visible={showAddDepartmentModal}
                onHide={() => setShowAddDepartmentModal(false)}
            >
                <form onSubmit={addDeparmentSubmit} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Название"
                        value={departmentName}
                        onChange={(e) => {
                            setDepartmentName(e.target.value);
                        }}
                        className="p-inputtext p-component p-filled p-mr-2"
                        required
                    />
                    <Button
                        disabled={isLoading || !departmentName}
                        type="submit"
                        className={`p-button p-component p-button-primary ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Добавить
                    </Button>
                </form>
            </Dialog>

            {/* Модальное окно для редактирования департамента */}
            <Dialog
                header="Изменить департамент"
                visible={showEditDepartmentModal}
                onHide={() => setShowEditDepartmentModal(false)}
            >
                <form onSubmit={editDeparmentSubmit} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Название"
                        value={editedDepartmentName}
                        onChange={(e) => {
                            setEditedDepartmentName(e.target.value);
                        }}
                        className="p-inputtext p-component p-filled p-mr-2"
                        required
                    />
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className={`p-button p-component p-button-primary ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Изменить
                    </Button>
                </form>
            </Dialog>

            {/* Модальное окно для отображения деталей департамента */}
            <Dialog
                header="Детали департамента"
                visible={Object.keys(departmentDetailsModal).length !== 0}
                onHide={() => setDepartmentDetailsModal({})}
                style={{ width: '25vw' }}
            >
                <div className="flex flex-col items-center gap-10">
                    <Button
                        label="Копировать ссылку"
                        icon="pi pi-link"
                        onClick={handleCopyClick}
                        className="p-button-secondary"
                    />
                    <AnalyticsAccess
                        selectedValues={analyticsAccess}
                        setSelectedValues={setAnalyticsAccess}
                    />
                    <DataEditing
                        selectedValues={dataEditingAccess}
                        setSelectedValues={setDataEditingAccess}
                    />
                    <div className="flex w-full justify-center items-center">
                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : (
                            <Button
                                onClick={handleAction}
                                className="p-button p-component p-button-success w-1/2 text-center"
                            >
                                Сохранить
                            </Button>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Модальное окно для отображения информации о магазине */}
            <Dialog
                header={`Информация о магазине: ${selectedStoreInfo?.storeName}`}
                visible={showStoreInfoModal}
                onHide={() => setShowStoreInfoModal(false)}
                style={{ width: '60vw' }}
            >
                <StoreDetails
                    setShowStoreInfoModal={setShowStoreInfoModal}
                    selectedStore={selectedStoreInfo}
                />
            </Dialog>

            {/* Модальное окно для оповещений */}
            <AlertModal
                message={alertModalText}
                open={showAlertModal}
                onClose={() => setShowAlertModal(false)}
            />
        </div>
    );
};
