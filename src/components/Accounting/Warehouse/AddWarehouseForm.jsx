// AddWarehouseForm.js
import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { useIsSmallScreen } from '../../../methods/useIsSmallScreen';
import { useStateContext } from '../../../contexts/ContextProvider';
import { formatDate } from '../../../methods/dataFormatter';

export const AddWarehouseForm = ({
    formData,
    handleInputChange,
    handleDateChange,
    handleDropdownChange,
    handleFileUpload, // Обработчик файлов
    handleSubmit,
    errors, // Получаем ошибки из родительского компонента
}) => {
    const isSmallScreen = useIsSmallScreen(768);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { warehouses, products, companyStructure, subUser } = useStateContext();

    useEffect(() => {
        if (formData.file) {
            const objectUrl = URL.createObjectURL(formData.file);
            setPreviewUrl(objectUrl);

            // Очистка URL при изменении файла или размонтировании компонента
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [formData.file]);

    useEffect(() => {
        handleDropdownChange(subUser, 'responsible');
        handleDateChange(new Date(), 'date');
    }, [handleDateChange, handleDropdownChange, subUser]);

    return (
        <form className="px-4" onSubmit={handleSubmit}>
            <div className={`grid gap-4 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Название товара</label>
                    <Dropdown
                        value={formData.productName}
                        onChange={(e) => handleDropdownChange(e.value, 'productName')}
                        options={products}
                        optionLabel="НоменклатураНаименование"
                        placeholder="Товар"
                        className={`border-blue-500 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 max-w-[250px] ${errors.warehouse ? 'border-red-500' : ''}`}
                        showClear
                    />
                    {errors.productName && <small className="p-error">{errors.productName}</small>}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Дата</label>
                    <InputText
                        value={formatDate(new Date())}
                        placeholder="Дата"
                        className={`border-blue-500 border-2 rounded p-2 max-w-[250px] ${errors.date ? 'border-red-500' : ''}`}
                    />
                    {errors.date && <small className="p-error">{errors.date}</small>}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Организация</label>
                    <Dropdown
                        value={formData.organization}
                        onChange={(e) => handleDropdownChange(e.value, 'organization')}
                        options={companyStructure?.stores || []}
                        optionLabel="storeName"
                        placeholder="Магазин"
                        className={`border-blue-500 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 max-w-[250px] ${errors.warehouse ? 'border-red-500' : ''}`}
                        showClear
                    />
                    {errors.organization && (
                        <small className="p-error">{errors.organization}</small>
                    )}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Ответственный</label>
                    <InputText
                        value={subUser.name}
                        // onChange={(e) => handleInputChange(e, 'responsible')}
                        placeholder="Ответственный"
                        className={`border-blue-500 border-2 rounded p-2 max-w-[250px] ${errors.responsible ? 'border-red-500' : ''}`}
                    />
                    {errors.responsible && <small className="p-error">{errors.responsible}</small>}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Склад</label>
                    <Dropdown
                        value={formData.warehouse}
                        onChange={(e) => handleDropdownChange(e.value, 'warehouse')}
                        options={warehouses}
                        optionLabel="warehouseName"
                        placeholder="Склад"
                        className={`border-blue-500 border-2 text-white rounded-lg focus:ring-2 focus:ring-blue-300 max-w-[250px] ${errors.warehouse ? 'border-red-500' : ''}`}
                        showClear
                    />
                    {errors.warehouse && <small className="p-error">{errors.warehouse}</small>}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Причина</label>
                    <InputText
                        value={formData.reason}
                        onChange={(e) => handleInputChange(e, 'reason')}
                        placeholder="Причина"
                        className={`border-blue-500 border-2 placeholder-gray rounded p-2 max-w-[250px] text-white ${errors.reason ? 'border-red-500' : ''}`}
                    />
                    {errors.reason && <small className="p-error">{errors.reason}</small>}
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Количество</label>
                    <InputText
                        value={formData.quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value > 0) {
                                handleInputChange(e, 'quantity');
                            }
                        }}
                        type="number" // Изменено на "number" для валидации чисел
                        placeholder="Количество"
                        className={`border-blue-500 border-2 placeholder-gray rounded-lg p-2 max-w-[250px]  ${errors.quantity ? 'border-red-500' : ''}`}
                    />
                    {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                </div>

                {/* Photo Upload */}
                <div className="space-y-2 flex flex-col max-w-[150px]">
                    <label className="text-sm font-medium">Фото</label>
                    <FileUpload
                        mode="basic"
                        name="demo[]"
                        accept="image/*"
                        maxFileSize={1000000}
                        auto
                        chooseLabel="Загрузить"
                        uploadHandler={(e) => handleFileUpload(e.files[0])} // Передаём файл в родительский обработчик
                        className={`rounded-lg ${errors.file ? 'border-red-500' : ''}`}
                    />
                    {errors.file && <small className="p-error">{errors.file}</small>}
                    <p className="text-xs text-gray-500">Сделайте фото товара</p>
                </div>

                {/* Предпросмотр загруженного файла */}
                {previewUrl && (
                    <div className="col-span-2 flex flex-col items-center">
                        <label className="text-sm font-medium">Предпросмотр фото:</label>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="mt-2 max-h-48 object-contain border rounded"
                        />
                    </div>
                )}
            </div>
            <div className="col-span-2 flex justify-center">
                <Button
                    label="Добавить"
                    type="submit"
                    className={`bg-blue-500 text-white max-w-[250px] rounded p-2 w-full mt-10 ${Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={Object.keys(errors).length > 0}
                />
            </div>
        </form>
    );
};
