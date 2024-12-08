import React, { useEffect, useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import { FaDollarSign, FaMoneyBillAlt, FaBox, FaFilter } from 'react-icons/fa';
import { FormatAmount, ConvertCalendarDate } from '../../data/MainDataSource';
import { useStateContext } from '../../contexts/ContextProvider';
import { getKKMReceiptsFront } from '../../methods/dataFetches/getKKM';
import LoadingSkeleton from '../LoadingSkeleton';

const ProductsStatsComp = ({ title, userKkmUrl, kkm }) => {
    const stepperRef = useRef(null);
    const { dateRanges } = useStateContext();
    const [dates, setDates] = useState([
        new Date(dateRanges[1].startDate.replace('%20', ' ')),
        new Date(dateRanges[1].endDate.replace('%20', ' ')),
    ]);
    const [productStats, setProductsStats] = useState(kkm.monthFormedKKM);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleDateChange = async (e) => {
        if (e[1]) {
            setLoading(true);
            const properDate = ConvertCalendarDate(e);
            const kkmData = await getKKMReceiptsFront(userKkmUrl, properDate);
            setProductsStats(kkmData);
            setLoading(false);
        }
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

    const productStatsTemplate = (storeStats) => [
        {
            id: '1',
            title: 'Best Sold Item (Amount)',
            desc: storeStats.bestSoldItemAmount?.name,
            valueKey: storeStats.bestSoldItemAmount?.amount,
            icon: <FaBox />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            format: false,
        },
        {
            id: '2',
            title: 'Best Sold Item (Sum)',
            desc: storeStats.bestSoldItemSum?.name,
            valueKey: Math.round(storeStats.bestSoldItemSum?.totalSum),
            icon: <FaDollarSign />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            format: true,
        },
        {
            id: '3',
            title: 'Least Sold Item (Amount)',
            desc: storeStats.leastSoldItemAmount?.name,
            valueKey: storeStats.leastSoldItemAmount?.amount,
            icon: <FaFilter />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            format: false,
        },
        {
            id: '4',
            title: 'Least Sold Item (Sum)',
            desc: storeStats.leastSoldItemSum?.name,
            valueKey: Math.round(storeStats.leastSoldItemSum?.totalSum),
            icon: <FaMoneyBillAlt />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            format: true,
        },
    ];

    return (
        <div
            className={`bg-white dark:text-gray-200 overflow-hidden dark:bg-secondary-dark-bg rounded-2xl w-[90%] md:w-[43%] px-6 py-6 flex flex-col subtle-border`}
        >
            <div className="flex flex-row justify-between mb-4">
                <p className="text-[1rem] font-semibold">{title}</p>
                <div className="flex flex-wrap border-solid border-1 rounded-xl border-black px-2 gap-1">
                    <Calendar
                        value={dates}
                        onChange={(e) => {
                            setDates(e.value);
                            handleDateChange(e.value);
                        }}
                        selectionMode="range"
                        readOnlyInput
                        hideOnRangeSelection
                    />
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
                    <Stepper ref={stepperRef}>
                        {Object.entries(productStats).map(([storeName, storeStats]) => (
                            <StepperPanel key={storeName} header={storeName}>
                                <div className="mt-2">
                                    {productStatsTemplate(storeStats).map((stat) => (
                                        <div
                                            key={stat.id}
                                            className="flex justify-between mt-4 w-full"
                                        >
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    style={{ background: stat.iconBg }}
                                                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                >
                                                    {stat.icon}
                                                </button>
                                                <div>
                                                    <p className="text-md font-semibold">
                                                        {stat.title}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {stat.desc
                                                            ? stat.desc
                                                            : `No data for ${storeName}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={stat.pcColor}>
                                                {stat.format
                                                    ? FormatAmount(stat.valueKey)
                                                    : stat.valueKey}{' '}
                                                {stat.format ? '₸' : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </StepperPanel>
                        ))}
                    </Stepper>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ProductsStatsComp;
