// import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FaCheck } from 'react-icons/fa';

export const BulkMode = ({ bulkMode, setBulkMode, selectedDays, setSelectedDays }) => {
    const modeOptions = [
        { label: 'Добавление', value: 'add' },
        { label: 'Редактирование', value: 'edit' },
    ];
    // const [selectedDays, setSelectedDays] = useState([]);
    return (
        <>
            {selectedDays.length === 0 ? (
                <Dropdown
                    value={bulkMode}
                    onChange={(e) => setBulkMode(e.value)}
                    options={modeOptions}
                    placeholder="Выберите режим"
                    className="w-full border-blue-500 border-2 rounded-lg"
                    showClear
                />
            ) : (
                // Если дни выбраны, показываем список дней
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedDays.map((d) => (
                        <div
                            key={d.getTime()}
                            className="flex items-center gap-1 bg-blue-100 p-2 rounded"
                        >
                            <FaCheck className="text-blue-600" />
                            <span>{d.toLocaleDateString('ru-RU')}</span>
                        </div>
                    ))}
                    <Button
                        label="Очистить дни"
                        className="p-button-text text-red-500"
                        onClick={() => setSelectedDays([])}
                    />
                </div>
            )}
        </>
    );
};
