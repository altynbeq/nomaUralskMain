import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

export const AddWarehouseForm = ({
    formData,
    handleInputChange,
    handleDateChange,
    handleFileUpload, // Обработчик файлов
    handleSubmit,
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

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

    return (
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Название товара</label>
                    <InputText
                        value={formData.productName}
                        onChange={(e) => handleInputChange(e, 'productName')}
                        placeholder="Введите товар"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Дата</label>
                    <Calendar
                        value={formData.date}
                        onChange={(e) => handleDateChange(e, 'date')}
                        showTime
                        locale="ru"
                        hourFormat="24"
                        className="w-full"
                        placeholder="Выберите дату"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Организация</label>
                    <InputText
                        value={formData.organization}
                        onChange={(e) => handleInputChange(e, 'organization')}
                        placeholder="Название организации"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Ответственный</label>
                    <InputText
                        value={formData.responsible}
                        onChange={(e) => handleInputChange(e, 'responsible')}
                        placeholder="Имя ответственного"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Склад</label>
                    <InputText
                        value={formData.warehouse}
                        onChange={(e) => handleInputChange(e, 'warehouse')}
                        placeholder="Склад товара"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Причина</label>
                    <InputText
                        value={formData.reason}
                        onChange={(e) => handleInputChange(e, 'reason')}
                        placeholder="Причина списания"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Количество</label>
                    <InputText
                        value={formData.quantity}
                        onChange={(e) => handleInputChange(e, 'quantity')}
                        type="text" // Изменено на "text" для тестирования
                        placeholder="Количество товара"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2 col-span-1">
                    <label className="text-sm font-medium">Фото</label>
                    <FileUpload
                        mode="basic"
                        name="demo[]"
                        accept="image/*"
                        maxFileSize={1000000}
                        auto
                        customUpload={true}
                        chooseLabel="Загрузить"
                        uploadHandler={(e) => handleFileUpload(e.files[0])} // Передаём файл в родительский обработчик
                        className="w-full"
                    />
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
            <div className="flex justify-end gap-3 mt-6">
                <Button
                    label="Добавить"
                    type="submit"
                    className="bg-blue-500 text-white rounded p-2 max-w-[250px]"
                />
            </div>
        </form>
    );
};
