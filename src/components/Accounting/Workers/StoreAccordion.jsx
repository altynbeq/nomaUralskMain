// StoreAccordion.jsx
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import AlertModal from '../../AlertModal';

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

    return (
        <div className="mx-auto w-full sm:w-[90%] p-4">
            <Accordion activeIndex={activeIndex} onTabChange={onTabChange}>
                {stores.map((store, index) => (
                    <AccordionTab key={store._id} header={store.storeName}>
                        {activeIndex === index && (
                            <div className="p-4">
                                <ul className="list-none p-0">
                                    {filteredDepartments.length > 0 ? (
                                        filteredDepartments.map((dept) => (
                                            <li
                                                key={dept._id}
                                                className="flex justify-between items-center mb-2"
                                            >
                                                <span className="text-black">{dept.name}</span>
                                                <div>
                                                    <Button
                                                        icon="pi pi-pencil"
                                                        className="p-button-text text-blue-500 mr-2"
                                                        onClick={() => {
                                                            handleEditDepartment(dept.name);
                                                            setSelectedEditingDepartment(dept);
                                                        }}
                                                    />
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-text text-red-500"
                                                        onClick={() => handleDeleteDepartment(dept)}
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
                        className="p-2 border rounded"
                        required
                    />
                    <Button
                        disabled={isLoading || !departmentName}
                        type="submit"
                        className={`flex bg-blue-500 text-white py-2 px-4 rounded ml-auto ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Добавить
                    </Button>
                </form>
            </Dialog>
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
                        className="p-2 border rounded"
                        required
                    />
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className={`flex bg-blue-500 text-white py-2 px-4 rounded ml-auto ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Изменить
                    </Button>
                </form>
            </Dialog>
            <AlertModal
                message={alertModalText}
                open={showAlertModal}
                onClose={() => setShowAlertModal(false)}
            />
        </div>
    );
};
