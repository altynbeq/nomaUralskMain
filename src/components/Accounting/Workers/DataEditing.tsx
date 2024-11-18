import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';
import { DEPARTMENT_EDITING_PRIVILEGES } from '../../../models/index';

export const DataEditing = () => {
    const options = [
        { label: 'Смены', value: DEPARTMENT_EDITING_PRIVILEGES.SHIFTS },
        { label: 'Склад', value: DEPARTMENT_EDITING_PRIVILEGES.WAREHOUSE },
        { label: 'Расходы', value: DEPARTMENT_EDITING_PRIVILEGES.EXPENSES },
        { label: 'Сотрудники', value: DEPARTMENT_EDITING_PRIVILEGES.EMPLOYEES },
    ];

    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values);
    };

    return (
        <div className="flex flex-col gap-5">
            <MultiSelect
                title="Редактирование данных"
                options={options}
                onChange={handleChange}
                selectedValues={selectedValues}
                tooltipText="Department user will be able to edit and add new data records"
            />
        </div>
    );
};
