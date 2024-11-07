import React, { useEffect, useState } from 'react';
import { useStateContext  } from '../../contexts/ContextProvider';
import BarChartRe from '../ReCharts/BarCharts';
import { fetchDeals } from '../../methods/dataFetches/getDealsBitrix';

const WeaklyRevenueOverviewStacked = () => {
    const { currentColor, dateRanges, deals } = useStateContext();
    const [ russianSalesSeries, setrussianSalesSeries ] = useState([]);
    const [ dealsSeries, setDealsSeries ] = useState({});

    const russianDaysMap = {
        'Monday': 'Пн',
        'Tuesday': 'Вт',
        'Wednesday': 'Ср',
        'Thursday': 'Чт',
        'Friday': 'Пт',
        'Saturday': 'Сб',
        'Sunday': 'Вс'
    };
    useEffect(() => {
        if(deals.dealsWeek){
            const russianSalesSeries = deals.dealsWeek.avgCheckSeries.map(item => ({
                ...item,
                x: russianDaysMap[item.x] || item.x 
            }));
            setrussianSalesSeries(russianSalesSeries)
        } 
    }, [deals])

    return (
        <div className="rounded-2xl p-2 mx-3" style={{ backgroundColor: currentColor }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="font-semibold text-white text-2xl">Средний чек</p>

                <div className="mt-4 md:mt-0 text-center md:text-right">
                    <p className="text-2xl text-white font-semibold">{deals.avgCheck}</p>
                    <p className="text-gray-200">За неделю</p>
                </div>
            </div>

            <div className="mt-4 h-[100px]">
                {/* Pass the new series with Russian day names to the chart */}
                <BarChartRe data={russianSalesSeries} />
            </div>
        </div>
    );
};

export default WeaklyRevenueOverviewStacked;
