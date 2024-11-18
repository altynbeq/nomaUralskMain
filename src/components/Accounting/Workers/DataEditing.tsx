import { useState } from 'react';
import { MultiSelect } from '../../../components/CustomMultiselect';

export const DataEditing = () => {
    const options = [
        { label: 'Shifts', value: 'react' },
        { label: 'Warehouse', value: 'angular' },
        { label: 'Expenses', value: 'vue' },
        { label: 'Workers', value: 'svelte' },
    ];

    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

    const handleChange = (values: (string | number)[]) => {
        setSelectedValues(values);
    };

    return (
        <div className="flex flex-col gap-5">
            <MultiSelect
                title="Data editing"
                options={options}
                onChange={handleChange}
                selectedValues={selectedValues}
                tooltipText="Department user will be able to edit and add new data records"
            />
        </div>
    );
};
