import React, { useState, useEffect, useRef } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import BarChartRe from '../demo/BarChart';
import { getSpisanie } from '../../methods/dataFetches/getSpisanie';
import { ConvertCalendarDate, SpisanieBarSeriesByStore } from '../../data/MainDataSource';
import LoadingSkeleton from '../LoadingSkeleton';

const SpisanieMonthChart = ({ title, series, short, userSpisanieUrl }) => {
    const { dateRanges } = useStateContext();
    const [selectedMonth, setSelectedMonth] = useState('September');
    const [selectedStore, setSelectedStore] = useState('Все магазины');
    const [barSeries, setBarSeries] = useState(series);

    const [dates, setDates] = useState([
        new Date(dateRanges[1].startDate.replace('%20', ' ')),
        new Date(dateRanges[1].endDate.replace('%20', ' ')),
    ]);
    const stores = ['Все магазины', 'Алматы', 'Сатпаева', 'Панфилова'];
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
        setBarSeries(series);
    }, [series]);

    const handleStoreChange = async (e) => {
        setSelectedStore(e);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    const handleDateChange = async (e) => {
        setLoading(true);
        if (e[1]) {
            const properDate = ConvertCalendarDate(e);
            const spisanieData = await getSpisanie(userSpisanieUrl, properDate);
            setBarSeries(SpisanieBarSeriesByStore(spisanieData));
        }
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    return (
        <div
            className={`bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 w-[90%] md:w-[${short ? 65 : 53}%] rounded-2xl subtle-border`}
        >
            <div className="flex justify-between items-center gap-2 mb-10">
                <p className="text-xl font-semibold">{title}</p>
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="border-solid border-1">
                        <Dropdown
                            value={selectedStore}
                            onChange={(e) => handleStoreChange(e.value)}
                            options={stores}
                            optionLabel="name"
                            placeholder="Выберите магазин"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div className="flex flex-row border-solid border-1 rounded-xl border-black px-2 gap-1">
                        <Calendar
                            value={dates}
                            onChange={(e) => {
                                handleDateChange(e.value);
                                setDates(e.value);
                            }}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                        />
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="pr-4 pt-2">
                    <LoadingSkeleton width={dimensions.width} height={dimensions.height - 8} />
                </div>
            ) : (
                ''
            )}

            {!loading ? (
                <div ref={componentRef}>
                    <div className="w-[100%] h-[400px]">
                        <BarChartRe data={barSeries} />
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default SpisanieMonthChart;
