import React, { useState } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface CustomSingleSelectProps {
    options: Option[];
    title: string;
    onChange: (isSelected: boolean) => void;
    selectedValue?: string | number | null;
    tooltipText?: string;
}

export const SingleSelect: React.FC<CustomSingleSelectProps> = ({
    options,
    onChange,
    title,
    selectedValue = null,
    tooltipText = 'Additional information about the selection.',
}) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const handleSelectOption = (value: string | number) => {
        const isSelected = selectedValue === value;
        onChange(!isSelected);
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
                        className={`w-8 h-8 border-4 rounded-full transition-colors ${
                            selectedValue === option.value ? 'bg-blue-500' : 'bg-white'
                        }`}
                    ></div>
                </div>
            ))}
        </div>
    );
};
