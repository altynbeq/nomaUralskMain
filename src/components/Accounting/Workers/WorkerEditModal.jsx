import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

export const WorkEditModal = ({ isVisible, onClose, worker, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const onDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/subUsers//delete-subuser/${worker._id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to update store');
            }
            onSuccess();
        } catch (error) {
            console.error('Error updating store:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const onSave = () => {

    // }

    return (
        <Dialog
            visible={isVisible}
            onHide={onClose}
            header="Редактировать"
            style={{ width: '50vw' }}
            modal
            closable={true}
        >
            <div className="p-4">
                <div className="mb-4">
                    <label htmlFor="workerName" className="block text-gray-700 font-medium mb-2">
                        Имя работника
                    </label>
                    <InputText
                        id="workerName"
                        value={worker?.name || ''}
                        onChange={(e) => (worker.name = e.target.value)}
                        placeholder="Введите имя работника"
                        className="border-2 p-1 rounded-lg border-blue-500"
                    />
                </div>

                {/* Кнопки */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        label="Удалить"
                        className="bg-red-500 text-white rounded p-2"
                        onClick={onDelete}
                        disabled={isLoading}
                    />
                    <Button
                        label="Сохранить"
                        className="bg-blue-500 text-white rounded p-2"
                        // onClick={onSave}
                    />
                </div>
            </div>
        </Dialog>
    );
};
