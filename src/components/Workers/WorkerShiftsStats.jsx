import React, { useEffect, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../store/index';
import { axiosInstance } from '../../api/axiosInstance';
import { Loader } from '../Loader';

export const WorkersShiftsStats = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [subUserShiftsStats, setSubUserShiftsStats] = useState([]);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        (async () => {
            const companyId = user?.companyId ? user.companyId : user?.id;
            if (!companyId) {
                return;
            }
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/shifts/stats/company/${companyId}`);
                setSubUserShiftsStats(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [setSubUserShiftsStats, user.companyId, user?.id]);

    return (
        <div className="bg-white w-[90%] mx-auto md:max-w-screen mt-10 p-5 subtle-border dark:bg-gray-900 overflow-auto">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold">Аналитика смен</h1>
                </div>
                {/* Search field */}
                <div className="relative flex flex-row gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 text-white py-1 px-3 rounded-2xl hover:bg-blue-700 transition-colors">
                        <FiFilter />
                        Фильтр
                    </button>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="border rounded w-64 py-1 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            {/* Table */}
            <table className="table-auto w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-3 font-semibold">Имя</th>
                        <th className="py-2 px-3 font-semibold">Отдел</th>
                        <th className="py-2 px-3 font-semibold">Количество смен</th>
                        <th className="py-2 px-3 font-semibold">Количество часов</th>
                        <th className="py-2 px-3 font-semibold">Отработано смен</th>
                    </tr>
                </thead>
                {/* <tbody>{rows}</tbody> */}
            </table>
        </div>
    );
};
