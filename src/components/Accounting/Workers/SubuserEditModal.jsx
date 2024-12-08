import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';

export const SubuserEditModal = ({ isVisible, subuser, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [subuserName, setSubuserName] = useState('');

    useEffect(() => {
        setSubuserName(subuser.name);
    }, [subuser.name]);

    const onSave = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.put(`subUsers/update-subuser-name/${subuser._id}`, {
                name: subuserName,
            });
            onSuccess();
        } catch (error) {
            console.error('Error updating store:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog visible={isVisible} onHide={onClose} header="Редактировать" modal closable={true}>
            <div className="mb-4">
                <label htmlFor="workerName" className="block text-gray-700 font-medium mb-2">
                    Имя работника
                </label>
                <InputText
                    id="workerName"
                    value={subuserName || ''}
                    onChange={(e) => setSubuserName(e.target.value)}
                    placeholder="Введите имя работника"
                    className="border-2 p-1 rounded-lg border-blue-500 w-full"
                />
            </div>

            {/* Кнопки */}
            <Button
                disabled={isLoading || !subuserName || subuserName === subuser.name}
                label="Сохранить"
                className="bg-blue-500 text-white rounded p-2 w-full"
                onClick={onSave}
            />
        </Dialog>
    );
};
