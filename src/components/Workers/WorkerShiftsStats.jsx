import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { axiosInstance } from '../../api/axiosInstance';
import { useAuthStore } from '../../store';
import { Loader } from '../Loader';

export const WorkersShiftsStats = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [subUserShiftsStats, setSubUserShiftsStats] = useState([]);
    const [filteredStats, setFilteredStats] = useState([]);
    const [storeFilter, setStoreFilter] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const user = useAuthStore((state) => state.user);

    // Получаем данные из API
    useEffect(() => {
        (async () => {
            const companyId = user?.companyId ? user.companyId : user?.id;
            if (!companyId) return;

            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/shifts/stats/company/${companyId}`);
                setSubUserShiftsStats(response.data);
                setFilteredStats(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных: ', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [user?.companyId, user?.id]);

    // Фильтруем по магазину и отделу
    useEffect(() => {
        let filteredData = [...subUserShiftsStats];

        if (storeFilter) {
            filteredData = filteredData.filter((item) => item.storeName === storeFilter);
        }

        if (departmentFilter) {
            filteredData = filteredData.filter((item) => item.departmentName === departmentFilter);
        }

        if (globalFilter) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    item.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    item.departmentName.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    item.storeName.toLowerCase().includes(globalFilter.toLowerCase()),
            );
        }

        setFilteredStats(filteredData);
    }, [storeFilter, departmentFilter, globalFilter, subUserShiftsStats]);

    // Получаем уникальные магазины и отделы для фильтров
    const storeOptions = Array.from(new Set(subUserShiftsStats.map((item) => item.storeName))).map(
        (store) => ({
            label: store,
            value: store,
        }),
    );

    const departmentOptions = Array.from(
        new Set(subUserShiftsStats.map((item) => item.departmentName)),
    ).map((department) => ({
        label: department,
        value: department,
    }));

    return (
        <div className="bg-white w-[90%] mx-auto md:max-w-screen mt-10 p-5 subtle-border dark:bg-gray-900 overflow-auto">
            <h1 className="text-xl font-semibold mb-4">Аналитика смен</h1>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex justify-between mb-4">
                        <div className="flex gap-4">
                            <Dropdown
                                value={storeFilter}
                                options={storeOptions}
                                onChange={(e) => setStoreFilter(e.value)}
                                placeholder="Фильтр по магазину"
                                className="p-inputtext-sm"
                            />
                            <Dropdown
                                value={departmentFilter}
                                options={departmentOptions}
                                onChange={(e) => setDepartmentFilter(e.value)}
                                placeholder="Фильтр по отделу"
                                className="p-inputtext-sm"
                            />
                        </div>

                        <InputText
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Поиск..."
                            className="border rounded w-64 py-1 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <DataTable
                        value={filteredStats}
                        paginator
                        rows={10}
                        className="p-datatable-sm p-datatable-striped"
                        globalFilter={globalFilter}
                        emptyMessage="Данные отсутствуют."
                    >
                        <Column
                            field="name"
                            header="Имя"
                            sortable
                            filterPlaceholder="Поиск по имени"
                        />
                        <Column
                            field="departmentName"
                            header="Отдел"
                            sortable
                            filterPlaceholder="Поиск по отделу"
                        />
                        <Column field="totalShifts" header="Количество смен" sortable />
                        <Column
                            header="Количество часов"
                            body={(rowData) =>
                                `${rowData.totalWorkedHours.hours} ч. ${rowData.totalWorkedHours.minutes} м.`
                            }
                            sortable
                        />
                        <Column
                            header="Отработано смен"
                            body={(rowData) => `${rowData.workedTimePercentage}%`}
                            sortable
                        />
                    </DataTable>
                </>
            )}
        </div>
    );
};
