import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

export const AddWarehouseForm = ({
    formData,
    handleInputChange,
    handleDateChange,
    handleSubmit,
}) => (
    <form className="space-y-4 p-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Название товара</label>
                <InputText
                    value={formData.productName}
                    onChange={(e) => handleInputChange(e, 'productName')}
                    placeholder="Введите товар"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Дата</label>
                <Calendar
                    value={formData.date}
                    onChange={(e) => handleDateChange(e, 'date')}
                    dateFormat="dd.mm.yy"
                    placeholder="Выберите дату"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Организация</label>
                <InputText
                    value={formData.organization}
                    onChange={(e) => handleInputChange(e, 'organization')}
                    placeholder="Название организации"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Ответственный</label>
                <InputText
                    value={formData.responsible}
                    onChange={(e) => handleInputChange(e, 'responsible')}
                    placeholder="Имя ответственного"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Склад</label>
                <InputText
                    value={formData.warehouse}
                    onChange={(e) => handleInputChange(e, 'warehouse')}
                    placeholder="Склад товара"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Причина</label>
                <InputText
                    value={formData.reason}
                    onChange={(e) => handleInputChange(e, 'reason')}
                    placeholder="Причина списания"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Количество</label>
                <InputText
                    value={formData.quantity}
                    onChange={(e) => handleInputChange(e, 'quantity')}
                    type="text" // Изменено на "text" для тестирования
                    placeholder="Количество товара"
                    className="w-full"
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
                    onUpload={(e) => console.log('File uploaded:', e)}
                    className="w-full"
                />
                <p className="text-xs text-gray-500">Сделайте фото товара</p>
            </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
            <Button label="Добавить" type="submit" className="p-button-rounded p-button-success" />
        </div>
    </form>
);
