import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuthStore, useCompanyStore } from '../../../store/index';

export const AddCategoryModal = ({ visible, onClose }) => {
    const user = useAuthStore((state) => state.user);
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const setCategories = useCompanyStore((state) => state.setCategories);
    const categories = useCompanyStore((state) => state.categories);
    const hanleSaveClick = async () => {
        if (!category) {
            toast.error('Заполните категорию');
        }
        setIsLoading(true);
        try {
            const companyId = user?.companyId ? user.companyId : user?.id;
            if (!companyId) {
                throw Error;
            }
            const response = await axiosInstance.post('companies/create-category', {
                category,
                companyId,
            });
            if (response.status === 200) {
                toast.success('Категория успешно добавлена');
                setCategories(categories.push(category));
                onClose(false);
            }
        } catch {
            toast.error('Не удалось добавить категорию');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Dialog visible={visible} onHide={() => onClose(false)} header="Добавить категорию">
            <InputText
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
                className="mt-5 w-full border-2 rounded-md p-2"
                placeholder="Название категории"
            />
            <Button
                label="Добавить"
                className="mt-5 p-button-primary w-full bg-blue-500 p-2 text-white rounded-md"
                onClick={hanleSaveClick}
            />
        </Dialog>
    );
};
