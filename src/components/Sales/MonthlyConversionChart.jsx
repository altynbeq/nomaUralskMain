import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import DoubleLineChart from '../../components/demo/DoubleLineChart';
import { useStateContext } from '../../contexts/ContextProvider';
import { getDealsBack } from '../../methods/dataFetches/getDealsBack';
import LoadingSkeleton from '../LoadingSkeleton';

const MonthlyConversionChart = ({ title, leadsSeries }) => {
    const [selectedMonth, setSelectedMonth] = useState('September');
    const { leads, dateRanges } = useStateContext();
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
        setLoading(true);
        setSelectedMonth(e);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    useEffect(() => {
        let updateDimensions = () => {
            if (componentRef.current) {
                const { offsetWidth, offsetHeight } = componentRef.current;
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight,
                });
            }
        };
        updateDimensions();
    }, []);
    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 md:w-[90%] w-[90%] rounded-2xl subtle-border">
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
            {loading ? (
                <div className="pr-4 pt-3">
                    <LoadingSkeleton width={dimensions.width} height={dimensions.height - 8} />
                </div>
            ) : (
                ''
            )}

            {!loading ? (
                <div ref={componentRef}>
                    <div className="w-[100%] h-[250px]">
                        <DoubleLineChart data={leadsSeries} />
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default MonthlyConversionChart;
