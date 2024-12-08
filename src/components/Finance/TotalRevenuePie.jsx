import React, { useEffect, useState } from 'react';
import HalfPie from '../ReCharts/HalfPieChart';

const TotalRevenuePie = ({ deals }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (deals.dealsMonth && deals.dealsMonth.dealsSource) {
            setData(deals.dealsMonth.dealsSource);
        }
    }, []);

    return (
        <div className="bg-white dark:text-gray-200  dark:bg-secondary-dark-bg rounded-2xl p-4 m-3 flex flex-col  items-center  subtle-border">
            <div className="w-full h-[120px] mt-5">
                <HalfPie data={data} />
            </div>
            <p className="text-gray-400">За месяц</p>
            <p className="text-2xl font-semibold ">Каналы продаж</p>
        </div>
    );
};

export default TotalRevenuePie;
