import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { formatDate } from '../../../methods/dataFormatter';
import { useCompanyStore, useCompanyStructureStore, useSubUserStore } from '../../../store';

export const AddWarehouseForm = ({
    formData,
    handleInputChange,
    handleDateChange,
    handleDropdownChange,
    handleFileUpload, // Обработчик файлов
    handleSubmit,
    isLoading,
    errors, // Получаем ошибки из родительского компонента
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const warehouses = useCompanyStore((state) => state.warehouses);
    const products = useCompanyStore((state) => state.products);
    const stores = useCompanyStructureStore((state) => state.stores);
    const subUser = useSubUserStore((state) => state.subUser);

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

    const handleRemoveFile = () => {
        handleFileUpload(null); // Очищаем файл в `formData`
    };

    useEffect(() => {
        handleDropdownChange(subUser, 'responsible');
    }, [handleDateChange, handleDropdownChange, subUser]);

    // Функция для поиска товаров
    const searchProducts = (event) => {
        const query = event.query.toLowerCase();
        const filtered = products?.filter((product) =>
            product.НоменклатураНаименование.toLowerCase().includes(query),
        );
        setFilteredProducts(filtered);
    };

    return (
        <form className="px-4 rounded-2xl" onSubmit={handleSubmit}>
            <div className={`grid gap-4 grid-cols-1 md:grid-cols-2`}>
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Название товара</label>
                    <AutoComplete
                        value={formData.productName}
                        onChange={(e) => handleDropdownChange(e.value, 'productName')}
                        suggestions={filteredProducts}
                        completeMethod={searchProducts}
                        field="НоменклатураНаименование"
                        placeholder="Поиск товара"
                        className={`border-blue-500 border-2 min-w-[100%] outline-none rounded-lg p-2   max-w-[250px] ${errors.productName ? 'border-red-500' : ''}`}
                    />
                    {errors.productName && <small className="p-error">{errors.productName}</small>}
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Дата</label>
                    <InputText
                        value={formatDate(new Date())}
                        placeholder="Дата"
                        className={`border-blue-500 min-w-[100%] border-2 rounded p-2 max-w-[250px] ${errors.date ? 'border-red-500' : ''}`}
                    />
                    {errors.date && <small className="p-error">{errors.date}</small>}
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Организация</label>
                    <Dropdown
                        value={formData.organization}
                        onChange={(e) => handleDropdownChange(e.value, 'organization')}
                        options={stores || []}
                        optionLabel="storeName"
                        placeholder="Магазин"
                        className={`border-blue-500 border-2 min-w-[100%] rounded-lg focus:ring-2 focus:ring-blue-300 max-w-[250px] ${errors.warehouse ? 'border-red-500' : ''}`}
                        showClear
                    />
                    {errors.organization && (
                        <small className="p-error">{errors.organization}</small>
                    )}
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Ответственный</label>
                    <InputText
                        disabled={!!subUser?.name}
                        value={subUser?.name}
                        onChange={(e) => handleInputChange(e, 'responsible')}
                        placeholder="Ответственный"
                        className={`border-blue-500 min-w-[100%] border-2 rounded p-2 max-w-[250px] ${errors.responsible ? 'border-red-500' : ''}`}
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
                        className={`border-blue-500 border-2 min-w-[100%] rounded-lg focus:ring-2 focus:ring-blue-300 max-w-[250px] ${errors.warehouse ? 'border-red-500' : ''}`}
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
                        className={`border-blue-500 border-2 min-w-[100%] placeholder-gray rounded p-2 max-w-[250px] ${errors.reason ? 'border-red-500' : ''}`}
                    />
                    {errors.reason && <small className="p-error">{errors.reason}</small>}
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Количество</label>
                    <InputText
                        value={formData.quantity}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^\d*$/.test(value)) {
                                handleInputChange(e, 'quantity');
                            }
                        }}
                        inputMode="numeric"
                        type="text"
                        placeholder="Количество"
                        className={`border-blue-500 border-2 min-w-[100%] placeholder-gray rounded-lg p-2 max-w-[250px]  ${errors.quantity ? 'border-red-500' : ''}`}
                    />
                    {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                </div>

                <div className="space-y-2 flex flex-col max-w-[150px]">
                    <label className="text-sm font-medium">Фото</label>
                    <div className="relative">
                        {!formData.file ? (
                            <>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors flex items-center justify-center"
                                >
                                    Загрузить фото
                                </label>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-48 object-contain border rounded mb-2"
                                />
                                <Button
                                    label="Удалить фото"
                                    className="p-button-danger"
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        )}
                    </div>
                    {errors.file && <small className="p-error">{errors.file}</small>}
                </div>
            </div>

            <div className="flex justify-center md:col-span-2">
                <Button
                    label="Добавить"
                    type="submit"
                    className={`bg-blue-500 text-white  rounded-2xl p-2 px-3  mt-10 ${Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={Object.keys(errors).length > 0 || isLoading}
                />
            </div>
        </form>
    );
};
