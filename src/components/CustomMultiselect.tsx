import React, { useState } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface MultiSelectProps {
    options: Option[];
    title: string;
    onChange: (selectedValues: (string | number)[]) => void;
    selectedValues?: (string | number)[];
    tooltipText?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    onChange,
    title,
    selectedValues = [],
    tooltipText = 'Additional information about Analytics Access.',
}) => {
    const [selected, setSelected] = useState<(string | number)[]>(selectedValues);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false); // Локальное состояние для тултипа

    const handleSelectOption = (value: string | number) => {
        const isSelected = selected.includes(value);
        const updatedSelection = isSelected
            ? selected.filter((item) => item !== value)
            : [...selected, value];

        setSelected(updatedSelection);
        onChange(updatedSelection);
    };

    return (
        <div className="relative flex flex-col items-start gap-4 p-4 border rounded shadow-md max-w-sm">
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{title}</span>
                <div
                    className="w-5 h-5 border rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 cursor-pointer"
                    title="Click for more information"
                    onClick={() => setIsTooltipVisible((prev) => !prev)}
                >
                    i
                </div>
            </div>

            {isTooltipVisible && (
                <div className="absolute top-12 left-0 bg-gray-100 border border-gray-300 text-sm text-gray-700 p-2 rounded shadow-lg w-full">
                    {tooltipText}
                </div>
            )}

            {options.map((option) => (
                <div
                    key={option.value}
                    className="flex items-center justify-between w-full cursor-pointer group"
                    onClick={() => handleSelectOption(option.value)}
                >
                    <span className="text-base">{option.label}</span>

                    <div
                        className={`w-5 h-5 border-2 rounded-full transition-colors ${
                            selected.includes(option.value) ? 'bg-blue-500' : 'bg-white'
                        }`}
                    ></div>
                </div>
            ))}
        </div>
    );
};
