// components/EmployeeCalendar/Filters.jsx
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { FaFilter } from 'react-icons/fa';

export const Filters = ({
    isFilterOpen,
    setIsFilterOpen,
    selectedStore,
    setSelectedStore,
    selectedDepartment,
    setSelectedDepartment,
    stores,
    filteredDepartments,
}) => {
    return (
        <div className="relative">
            <button
                className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                onClick={() => setIsFilterOpen((prev) => !prev)}
            >
                <FaFilter />
                <span>Фильтр</span>
            </button>

            {isFilterOpen && (
                <div className="absolute z-10 bg-white p-4 mt-2 w-72 shadow-lg rounded-lg border border-gray-200">
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.value)}
                        showClear
                        options={stores}
                        optionLabel="storeName"
                        placeholder="Магазин"
                        className="w-full mb-3 border-blue-500 border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                    />

                    <Dropdown
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.value)}
                        options={filteredDepartments}
                        optionLabel="name"
                        placeholder="Отдел"
                        disabled={!selectedStore}
                        className="w-full border-blue-500 border-2 text-black rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                </div>
            )}
        </div>
    );
};
