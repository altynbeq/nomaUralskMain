import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';

export const AnalyticsAccess = () => {
    const options = [
        { label: 'Финансы', value: 'react' },
        { label: 'Продажи', value: 'angular' },
        { label: 'Сотрудники', value: 'vue' },
        { label: 'Склад', value: 'svelte' },
    ];

    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values);
    };

    return (
        <div className="flex flex-col gap-5">
            <MultiSelect
                title="Доступ к аналитике"
                options={options}
                onChange={handleChange}
                selectedValues={selectedValues}
                tooltipText="Пользователь департамента получит доступ к выбранным модулям аналитики"
            />
        </div>
    );
};
