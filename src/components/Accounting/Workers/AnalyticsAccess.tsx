import React from 'react';
import { MultiSelect } from '../../Multiselect';
import { DEPARTMENT_ANALYTICS_PRIVILEGES } from '../../../models/index';

interface AnalyticsAccessProps {
    selectedValues: (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[];
    setSelectedValues: (values: (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[]) => void;
}

export const AnalyticsAccess: React.FC<AnalyticsAccessProps> = ({
    selectedValues,
    setSelectedValues,
}) => {
    const options = [
        { label: 'Финансы', value: DEPARTMENT_ANALYTICS_PRIVILEGES.Finance },
        { label: 'Продажи', value: DEPARTMENT_ANALYTICS_PRIVILEGES.Sales },
        { label: 'Сотрудники', value: DEPARTMENT_ANALYTICS_PRIVILEGES.Workers },
        { label: 'Склад', value: DEPARTMENT_ANALYTICS_PRIVILEGES.Warehouse },
    ];

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values as (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[]);
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
