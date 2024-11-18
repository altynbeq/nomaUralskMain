import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';
import { DEPARTMENT_ANALYTICS_PRIVILEGES } from '../../../models/index';

export const AnalyticsAccess = () => {
    const options = [
        { label: 'Финансы', value: DEPARTMENT_ANALYTICS_PRIVILEGES.FINANCES },
        { label: 'Продажи', value: DEPARTMENT_ANALYTICS_PRIVILEGES.SALES },
        { label: 'Сотрудники', value: DEPARTMENT_ANALYTICS_PRIVILEGES.EMPLOYEES },
        { label: 'Склад', value: DEPARTMENT_ANALYTICS_PRIVILEGES.WAREHOUSE },
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
