import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';

export const SubuserDeleteModal = ({ isVisible, subuserId, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/subUsers/delete-subuser/${subuserId}`);

            onSuccess();
        } catch (error) {
            console.error('Error updating store:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            visible={isVisible}
            onHide={onClose}
            header="Удалить"
            style={{ width: '25vw' }}
            modal
            closable={true}
        >
            <p>Действительно ли выхотите удалить работника?</p>

            {/* Кнопки */}
            <Button
                disabled={isLoading || !subuserId}
                label="Удалить"
                className="mt-5 bg-red-500 text-white rounded p-2 w-full"
                onClick={onDelete}
            />
        </Dialog>
    );
};
