import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import LineChartRe from '../../components/demo/LineChart';
import { useStateContext } from '../../contexts/ContextProvider';
import { getDealsBack } from '../../methods/dataFetches/getDealsBack';

const MonthlyTotalSalesChart = ({ title, leadsSeries }) => {
    const [selectedMonth, setSelectedMonth] = useState('September');
    const { leads, dateRanges } = useStateContext();
    const [series, setSeries] = useState(leads.series);

    // useEffect(() => {

    //   setSeries(data)
    // }, [series]);

    const cities = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const handleMonthChange = async (e) => {
        setSelectedMonth(e);
    };

    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 md:w-[42%] w-[90%] rounded-2xl subtle-border">
            <div className="flex justify-between items-center gap-2 mb-10">
                <p className="text-xl font-semibold">{title}</p>
                <div className="flex items-center gap-4">
                    <Dropdown
                        value={selectedMonth}
                        onChange={(e) => handleMonthChange(e.value)}
                        options={cities}
                        optionLabel="name"
                        placeholder="Выберите месяц"
                        className="w-full md:w-14rem"
                    />
                </div>
            </div>
            <div className="w-[100%] h-[250px]">
                <LineChartRe data={leadsSeries} />
            </div>
        </div>
    );
};

export default MonthlyTotalSalesChart;
