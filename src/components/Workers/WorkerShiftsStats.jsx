import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
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
    const [isFilterDialogVisible, setIsFilterDialogVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Стейт для текущей страницы
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

    const openFilterDialog = () => {
        setIsFilterDialogVisible(true);
    };

    const applyFilters = () => {
        setIsFilterDialogVisible(false);
    };

    const clearFilters = () => {
        setStoreFilter(null);
        setDepartmentFilter(null);
    };

    // Обновление текущей страницы
    const onPageChange = (event) => {
        setCurrentPage(event.page); // Устанавливаем текущую страницу
    };

    return (
        <div className="relative bg-white w-[90%] mx-auto md:max-w-screen mt-10 p-5 subtle-border dark:bg-gray-900 overflow-auto">
            <h1 className="text-xl font-semibold mb-4">Аналитика смен</h1>

            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="flex justify-end mb-4 gap-4">
                        <Button
                            label="Фильтры"
                            icon="pi pi-filter"
                            onClick={openFilterDialog}
                            className="p-button-outlined p-button-primary rounded-lg bg-blue-500 text-white px-2"
                        />

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
                        first={currentPage * 10} // Устанавливаем с какой записи начинать
                        onPage={onPageChange} // Обновляем текущую страницу
                        className="p-datatable-sm p-datatable-striped"
                        globalFilter={globalFilter}
                        emptyMessage="Данные отсутствуют"
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
                        <Column field="totalShifts" header="Смены" sortable />
                        <Column
                            header="Часы"
                            body={(rowData) =>
                                `${rowData.totalWorkedHours.hours} ч. ${rowData.totalWorkedHours.minutes} м.`
                            }
                            sortable
                        />
                        <Column
                            header="Отработано смен"
                            body={(rowData) => {
                                const workedPercentage = rowData.workedTimePercentage;
                                const latePercentage = 100 - workedPercentage;

                                return (
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="flex justify-between w-full text-sm font-semibold">
                                            <span
                                                style={{ color: '#2E8B57' }}
                                            >{`${workedPercentage}%`}</span>
                                            <span
                                                style={{ color: '#DC143C' }}
                                            >{`${latePercentage}%`}</span>
                                        </div>
                                        <div className="progress-container">
                                            <div
                                                className="progress-success"
                                                style={{ width: `${workedPercentage}%` }}
                                            ></div>
                                            <div
                                                className="progress-danger"
                                                style={{ width: `${latePercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Column
                            header="Опоздания"
                            body={(rowData) => `${rowData.latePercentage}%`}
                        />
                    </DataTable>

                    <Dialog
                        header="Фильтры"
                        visible={isFilterDialogVisible}
                        style={{ width: '30vw' }}
                        onHide={() => setIsFilterDialogVisible(false)}
                    >
                        <div className="field">
                            <label htmlFor="storeFilter" className="block mb-2">
                                Магазин
                            </label>
                            <Dropdown
                                id="storeFilter"
                                value={storeFilter}
                                options={storeOptions}
                                onChange={(e) => setStoreFilter(e.value)}
                                placeholder="Выберите магазин"
                                className="w-full bg-blue-500 rounded-lg text-white"
                            />
                        </div>

                        <div className="field mt-4">
                            <label htmlFor="departmentFilter" className="block mb-2">
                                Отдел
                            </label>
                            <Dropdown
                                id="departmentFilter"
                                value={departmentFilter}
                                options={departmentOptions}
                                onChange={(e) => setDepartmentFilter(e.value)}
                                placeholder="Выберите отдел"
                                className="w-full bg-blue-500 rounded-lg text-white"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <Button
                                label="Очистить"
                                onClick={clearFilters}
                                className="p-button-text"
                            />
                            <Button
                                label="Применить"
                                onClick={applyFilters}
                                className="bg-blue-500 rounded-lg text-white p-2"
                            />
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    );
};
