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

    const openSecondModal = () => {
        setOpenNewPlanModal(true);
    };

    const closeSecondModal = () => {
        setOpenNewPlanModal(false);
    };

    const handleSave = () => {
        closeSecondModal();
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
                    <Button onClick={openSecondModal} label="Добавить" icon="pi pi-plus" />
                </div>
                <div>
                    // здесь
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
