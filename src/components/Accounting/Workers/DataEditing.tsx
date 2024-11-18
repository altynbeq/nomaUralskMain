import React from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';
import { DEPARTMENT_EDITING_PRIVILEGES } from '../../../models/index';

interface DataEditingProps {
    selectedValues: (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[];
    setSelectedValues: (values: (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[]) => void;
}

export const DataEditing: React.FC<DataEditingProps> = ({ selectedValues, setSelectedValues }) => {
    const options = [
        { label: 'Смены', value: DEPARTMENT_EDITING_PRIVILEGES.Shifts },
        { label: 'Склад', value: DEPARTMENT_EDITING_PRIVILEGES.Warehouse },
        { label: 'Расходы', value: DEPARTMENT_EDITING_PRIVILEGES.Expenses },
        { label: 'Сотрудники', value: DEPARTMENT_EDITING_PRIVILEGES.Workers },
    ];

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values as (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[]);
    };

    return (
        <div className="flex flex-col gap-5">
            <MultiSelect
                title="Редактирование данных"
                options={options}
                onChange={handleChange}
                selectedValues={selectedValues}
                tooltipText="Пользователь отдела сможет редактировать и добавлять новые записи данных"
            />
        </div>
    );
};
