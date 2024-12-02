import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { useIsSmallScreen } from '../../../methods/useIsSmallScreen';

export const AddWarehouseForm = ({
    formData,
    handleInputChange,
    handleDateChange,
    handleFileUpload, // Обработчик файлов
    handleSubmit,
}) => {
    const isSmallScreen = useIsSmallScreen(768);
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
        <form className="px-4" onSubmit={handleSubmit}>
            <div className={`grid gap-4 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Название товара</label>
                    <InputText
                        value={formData.productName}
                        onChange={(e) => handleInputChange(e, 'productName')}
                        placeholder="Товар"
                        className="bg-blue-500 text-white placeholder-white rounded p-2 max-w-[250px]"
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
                        className="max-w-[250px] border-blue-500 border-2 rounded-lg p-1"
                        placeholder="Дата"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Организация</label>
                    <InputText
                        value={formData.organization}
                        onChange={(e) => handleInputChange(e, 'organization')}
                        placeholder="Организация"
                        className="bg-blue-500 text-white placeholder-white rounded p-2 max-w-[250px]"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Ответственный</label>
                    <InputText
                        value={formData.responsible}
                        onChange={(e) => handleInputChange(e, 'responsible')}
                        placeholder="Ответственный"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px] text-white"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Склад</label>
                    <InputText
                        value={formData.warehouse}
                        onChange={(e) => handleInputChange(e, 'warehouse')}
                        placeholder="Склад товара"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px] text-white"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Причина</label>
                    <InputText
                        value={formData.reason}
                        onChange={(e) => handleInputChange(e, 'reason')}
                        placeholder="Причина"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px] text-white"
                    />
                </div>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Количество</label>
                    <InputText
                        value={formData.quantity}
                        onChange={(e) => handleInputChange(e, 'quantity')}
                        type="number" // Изменено на "text" для тестирования
                        placeholder="Количество"
                        className="bg-blue-500 placeholder-white rounded p-2 max-w-[250px] text-white"
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
                        className="w-full max-w-[250px]"
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
            <Button
                label="Добавить"
                type="submit"
                className="flex justify-center bg-blue-500 text-white rounded p-2 w-full mt-10"
            />
        </form>
    );
};
