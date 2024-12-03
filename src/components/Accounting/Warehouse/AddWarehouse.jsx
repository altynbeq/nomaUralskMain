// AddWarehouse.js
import { useState, useCallback } from 'react';
import { MdInsertDriveFile, MdPieChart, MdDescription } from 'react-icons/md';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AddWarehouseForm } from './AddWarehouseForm';
import { useIsSmallScreen } from '../../../methods/useIsSmallScreen';
import AlertModal from '../../AlertModal';
import { isValidDepartmentId } from '../../../methods/isValidDepartmentId';

export const AddWarehouse = () => {
    const isSmallScreen = useIsSmallScreen(768);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        date: new Date(),
        organization: '',
        responsible: '',
        warehouse: '',
        reason: '',
        quantity: '',
        file: null,
    });
    const [errors, setErrors] = useState({});
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const removeError = (field) => {
        setErrors((prevErrors) => {
            const { [field]: removed, ...rest } = prevErrors;
            return rest;
        });
    };

    const handleInputChange = useCallback((e, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));
        removeError(field);
    }, []);

    const handleDropdownChange = useCallback((value, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
        removeError(field);
    }, []);

    const handleDateChange = useCallback((e, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: e.value }));
        removeError(field);
    }, []);

    const handleFileUpload = useCallback((file) => {
        setFormData((prevData) => ({ ...prevData, file })); // Обновляем файл в состоянии
        removeError('file');
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.productName) newErrors.productName = 'Название товара обязательно';
        // if (!formData.date) newErrors.date = 'Дата обязательна';
        if (!formData.organization) newErrors.organization = 'Организация обязательна';
        if (!formData.responsible) newErrors.responsible = 'Ответственный обязателен';
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
        async (e) => {
            e.preventDefault();
            if (validate()) {
                const submissionData = new FormData();

                // Сериализация вложенных объектов
                submissionData.append('productName', JSON.stringify(formData.productName));
                submissionData.append('date', new Date().toISOString());
                submissionData.append('organization', JSON.stringify(formData.organization));
                submissionData.append('responsible', JSON.stringify(formData.responsible));
                submissionData.append('warehouse', JSON.stringify(formData.warehouse));
                submissionData.append('reason', formData.reason);
                submissionData.append('quantity', formData.quantity);
                submissionData.append('file', formData.file);
                const currentUserDepartmentId = localStorage.getItem('departmentId');
                const subuserCompanyId = localStorage.getItem('companyId');
                const userId = localStorage.getItem('_id');
                const companyId = isValidDepartmentId(currentUserDepartmentId)
                    ? subuserCompanyId
                    : userId;
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/clientsSpisanie/${companyId}/write-off`,
                        {
                            method: 'POST',
                            body: submissionData,
                        },
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Ошибка при отправке данных');
                    }
                    setIsModalOpen(false);
                    setShowAlertModal(true);
                    setFormData({
                        productName: null,
                        date: null,
                        organization: null,
                        responsible: null,
                        warehouse: null,
                        reason: '',
                        quantity: '',
                        file: null,
                    });
                    setErrors({});
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log('Validation failed:', errors);
            }
        },
        [formData, errors, validate],
    );

    return (
        <div className="w-[90%] md:w-[40%] subtle-border mx-auto mt-5 md:mt-0 md:pt-0 flex items-center justify-center">
            <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-col relative">
                <div className="flex-1 flex flex-col items-center justify-center">
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
                    handleDropdownChange={handleDropdownChange}
                    errors={errors}
                    isLoading={isLoading}
                />
            </Dialog>
            <AlertModal
                open={showAlertModal}
                message="Вы успешо добавили списание"
                onClose={() => setShowAlertModal(false)}
            />
        </div>
    );
};
