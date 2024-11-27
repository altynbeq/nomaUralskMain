import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { getCurrentMonthYear } from '../../methods/getCurrentMonthYear';
import avatar from '../../data/avatar.jpg';

export const StorePlanModal = ({ isVisible, onHide, store }) => {
    const categories = ['Розы', 'Шоколадки', 'Боксы'];
    const [openNewPlanModal, setOpenNewPlanModal] = useState(false);
    const [planName, setPlanName] = useState('');
    const [planGoal, setPlanGoal] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [plans, setPlans] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPlanIndex, setEditingPlanIndex] = useState(null);

    const openSecondModal = () => {
        setOpenNewPlanModal(true);
    };

    const closeSecondModal = () => {
        setOpenNewPlanModal(false);
        setPlanName('');
        setPlanGoal('');
        setSelectedCategory('');
        setIsEditMode(false);
        setEditingPlanIndex(null);
    };

    const handleSave = () => {
        if (isEditMode) {
            // Update the existing plan
            setPlans((prevPlans) =>
                prevPlans.map((plan, index) =>
                    index === editingPlanIndex
                        ? { name: planName, goal: planGoal, category: selectedCategory }
                        : plan,
                ),
            );
        } else if (planName && planGoal && selectedCategory) {
            // Add a new plan
            setPlans((prevPlans) => [
                ...prevPlans,
                { name: planName, goal: planGoal, category: selectedCategory },
            ]);
        }
        closeSecondModal();
    };

    const handleEdit = (index) => {
        const plan = plans[index];
        setPlanName(plan.name);
        setPlanGoal(plan.goal);
        setSelectedCategory(plan.category);
        setEditingPlanIndex(index);
        setIsEditMode(true);
        setOpenNewPlanModal(true);
    };

    const handleDelete = (index) => {
        setPlans((prevPlans) => prevPlans.filter((_, i) => i !== index));
    };

    return (
        <>
            <Dialog
                visible={isVisible}
                onHide={onHide}
                header={
                    <div className="flex gap-2">
                        <img
                            src={
                                store?.image
                                    ? `https://nomalytica-back.onrender.com${store.image}`
                                    : avatar
                            }
                            alt={store.storeName}
                            className="w-12 h-12 rounded-full object-cover mb-2"
                        />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-lg">
                                {store?.storeName || 'Название магазина'}
                            </h3>
                            <p className="text-sm font-semibold">План на {getCurrentMonthYear()}</p>
                        </div>
                    </div>
                }
                style={{ width: '450px' }}
                modal
                closable
            >
                <div className="flex justify-end mt-3">
                    <Button
                        onClick={openSecondModal}
                        label="Добавить"
                        className="bg-blue-500 text-white border-2 p-2 rounded-lg"
                    />
                </div>
                <div>
                    {plans.length > 0 ? (
                        <div className="mt-4">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className="p-2 mb-3 border-2 rounded-lg border-gray-300 shadow-sm flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-bold text-md">
                                            Категория: {plan.category}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Название: {plan.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Цель: {plan.goal} тг
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-text p-button-info"
                                            onClick={() => handleEdit(index)}
                                            tooltip="Изменить"
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text p-button-danger"
                                            onClick={() => handleDelete(index)}
                                            tooltip="Удалить"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">Планы пока не добавлены</p>
                    )}
                </div>
            </Dialog>
            <Dialog
                visible={openNewPlanModal}
                onHide={closeSecondModal}
                header="Новый План"
                style={{ width: '450px' }}
                modal
                closable
            >
                <div className="p-4">
                    <div className="field mb-4">
                        <label htmlFor="planName" className="block font-medium mb-2">
                            Название
                        </label>
                        <InputText
                            id="planName"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            placeholder="Введите название"
                            className="w-full border-2 p-1 rounded-lg border-blue-500"
                        />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="planGoal" className="block font-medium mb-2">
                            Цель
                        </label>
                        <InputText
                            type="number"
                            id="planGoal"
                            value={planGoal}
                            onChange={(e) => setPlanGoal(e.target.value)}
                            placeholder="Введите цель"
                            className="w-full border-2 p-1 rounded-lg border-blue-500"
                        />
                    </div>
                    <div className="field mb-4">
                        <Dropdown
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.value)}
                            options={categories}
                            showClear
                            placeholder="Выберите категорию"
                            className="w-full bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                    <div className="field flex justify-center mt-5">
                        <Button
                            className="bg-green-500 text-white border-2 p-2 rounded-lg"
                            onClick={handleSave}
                            label="Cохранить"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
