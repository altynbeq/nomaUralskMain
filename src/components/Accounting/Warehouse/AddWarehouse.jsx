// AddWarehouse.js
import { useState, useCallback } from 'react';
import { MdInsertDriveFile, MdPieChart, MdDescription } from 'react-icons/md';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AddWarehouseForm } from './AddWarehouseForm';
import { useIsSmallScreen } from '../../../methods/useIsSmallScreen';

export const AddWarehouse = () => {
    const isSmallScreen = useIsSmallScreen(768);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        date: null,
        organization: '',
        responsible: '',
        warehouse: '',
        reason: '',
        quantity: '',
        file: null,
    });
    const [errors, setErrors] = useState({}); // Состояние для ошибок

    const handleInputChange = useCallback((e, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));
        setErrors({});
    }, []);

    const handleWareHouseChange = useCallback((e, field) => {
        setErrors({});
        setFormData((prevData) => ({ ...prevData, [field]: e }));
    }, []);

    const handleDateChange = useCallback((e, field) => {
        setErrors({});
        setFormData((prevData) => ({ ...prevData, [field]: e.value }));
    }, []);

    const handleFileUpload = useCallback((file) => {
        setErrors({});
        setFormData((prevData) => ({ ...prevData, file })); // Обновляем файл в состоянии
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.productName.trim()) newErrors.productName = 'Название товара обязательно';
        if (!formData.date) newErrors.date = 'Дата обязательна';
        if (!formData.organization.trim()) newErrors.organization = 'Организация обязательна';
        if (!formData.responsible.trim()) newErrors.responsible = 'Ответственный обязателен';
        if (!formData.warehouse) newErrors.warehouse = 'Склад обязателен';
        if (!formData.reason.trim()) newErrors.reason = 'Причина обязательна';
        if (!formData.quantity) {
            newErrors.quantity = 'Количество обязательно';
        } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Количество должно быть положительным числом';
        }
        if (!formData.file) newErrors.file = 'Фото обязательно';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (validate()) {
                console.log('Form submitted:', formData);
                // Здесь вы можете отправить данные на сервер
                setIsModalOpen(false);
                // Сброс формы после успешной отправки (опционально)
                setFormData({
                    productName: '',
                    date: null,
                    organization: '',
                    responsible: '',
                    warehouse: '',
                    reason: '',
                    quantity: '',
                    file: null,
                });
                setErrors({});
            } else {
                console.log('Validation failed:', errors);
            }
        },
        [formData, errors],
    );

    return (
        <div className="w-[90%] mb-5 md:w-[40%] subtle-border mx-auto mt-5 md:mt-0 md:pt-0 flex items-center justify-center">
            <div className="w-full h-72 bg-white rounded-lg shadow-md p-6 flex flex-col relative">
                <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-4">
                    <div className="flex m-5 p-8 flex-col items-center justify-center w-full border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                        <p className="text-gray-600">Заполните данные списания</p>
                        <div className="flex gap-4 justify-center my-4">
                            <MdInsertDriveFile size={32} className="text-blue-500" />
                            <MdPieChart size={32} className="text-blue-500" />
                            <MdDescription size={32} className="text-blue-500" />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                label="Добавить"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white rounded p-2 max-w-[250px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                header="Добавить списание"
                visible={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                style={{ width: isSmallScreen ? '150vw' : '40vw' }}
            >
                <AddWarehouseForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleDateChange={handleDateChange}
                    handleFileUpload={handleFileUpload}
                    handleSubmit={handleSubmit}
                    handleWareHouseChange={handleWareHouseChange}
                    errors={errors} // Передаем ошибки в форму
                />
            </Dialog>
        </div>
    );
};
