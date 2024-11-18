import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';

export const DataEditing = () => {
    const options = [
        { label: 'Смены', value: 'react' },
        { label: 'Склад', value: 'angular' },
        { label: 'Расходы', value: 'vue' },
        { label: 'Сотрудники', value: 'svelte' },
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
