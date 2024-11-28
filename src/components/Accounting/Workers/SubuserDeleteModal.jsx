import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export const SubuserDeleteModal = ({ isVisible, subuserId, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/subUsers//delete-subuser/${subuserId}`,
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
