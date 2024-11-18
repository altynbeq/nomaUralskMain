import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';

export const AnalyticsAccess = () => {
    const options = [
        { label: 'Finance', value: 'react' },
        { label: 'Sales', value: 'angular' },
        { label: 'Workers', value: 'vue' },
        { label: 'Svelte', value: 'svelte' },
    ];

    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values);
    };

    return (
        <div className="flex flex-col gap-5">
            <MultiSelect
                options={options}
                onChange={handleChange}
                selectedValues={selectedValues}
                tooltipText="Department user will be able to edit and add new data records"
            />
        </div>
    );
};
