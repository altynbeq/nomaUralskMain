import { useState, useCallback } from 'react';
import { MdInsertDriveFile, MdPieChart, MdDescription } from 'react-icons/md';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AddWarehouseForm } from './AddWarehouseForm';

export const AddWarehouse = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        date: null,
        organization: '',
        responsible: '',
        warehouse: '',
        reason: '',
        quantity: '', // Или 0, если используете type="number"
    });

    const handleInputChange = useCallback((e, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));
    }, []);

    const handleDateChange = useCallback((e, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: e.value }));
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            console.log('Form submitted:', formData);
            setIsModalOpen(false);
        },
        [formData],
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
                style={{ width: '50vw' }}
            >
                <AddWarehouseForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleDateChange={handleDateChange}
                    handleSubmit={handleSubmit}
                />
            </Dialog>
        </div>
    );
};
