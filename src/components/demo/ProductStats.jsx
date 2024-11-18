import React, { useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from '../../contexts/ContextProvider';
import { StoresList, FormatAmount } from '../../data/MainDataSource';
import {
    FaDollarSign,
    FaMoneyBillAlt,
    FaBoxOpen,
    FaRegThumbsDown,
    FaMoneyBill,
    FaBox,
    FaFilter,
    FaChartBar,
} from 'react-icons/fa';

const ProductStats = ({ title }) => {
    const stepperRef = useRef(1);
    const { dateRanges, receipts, kkm, spisanie } = useStateContext();
    const [dates, setDates] = useState([
        new Date(dateRanges[1].startDate.replace('%20', ' ')),
        new Date(dateRanges[1].endDate.replace('%20', ' ')),
    ]);
    const [panelData, setPanelData] = useState([]);
    const handleDateChange = async (e) => {
        if (e[1]) {
            // console.log("hellooo")
        }
    };

    const financeStatsTemplate = [
        {
            id: '1',
            title: 'Выручка',
            icon: <FaDollarSign />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'totalSum',
            format: true,
        },
        {
            id: '2',
            title: 'Средний чек',
            icon: <FaMoneyBill />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'averageCheck',
            format: true,
        },
        {
            id: '3',
            title: 'Продаж',
            icon: <FaMoneyBillAlt />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'totalNumberSales',
            format: false,
        },
        {
            id: '4',
            title: 'Списаний',
            icon: <FaBox />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'spisanie',
            format: false,
            desc: '70 товар',
        },
        {
            id: '5',
            title: 'Конверсия',
            icon: <FaFilter />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'conversion',
            format: false,
            desc: 'Bitrix',
        },
        {
            id: '6',
            title: 'Онлайн продаж',
            icon: <FaChartBar />,
            iconBg: '#1d4db7',
            pcColor: 'black-600',
            valueKey: 'onlineSales',
            format: false,
            desc: 'Bitrix',
        },
    ];
    return (
        <div
            className={`bg-white dark:text-gray-200 overflow-hidden  dark:bg-secondary-dark-bg rounded-2xl w-[90%] md:w-[43%] p-4 flex flex-col subtle-border`}
        >
            <div className="flex flex-row justify-between mb-4">
                <p className="text-[1rem] font-semibold">{title}</p>
                <div className="flex flex-wrap border-solid border-1 rounded-xl border-black px-2 gap-1">
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

            <Stepper ref={stepperRef} style={{}}>
                {Object.entries(kkm.monthFormedKKM).map(([storeName, storeData]) => {
                    const avgCheck = Math.round(storeData.totalSum / storeData.totalNumberSales);
                    return (
                        <StepperPanel key={storeName + 'product'} header={storeName}>
                            <div className="mt-2">
                                {financeStatsTemplate.map((stat) => {
                                    const statValue =
                                        stat.valueKey === 'averageCheck'
                                            ? avgCheck
                                            : storeData[stat.valueKey];
                                    return (
                                        <div
                                            key={stat.id + 'prod'}
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
                                                        {stat.desc || `Данные по ${storeName}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={stat.pcColor}>
                                                {stat.format ? FormatAmount(statValue) : statValue}{' '}
                                                {stat.format ? '₸' : ''}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </StepperPanel>
                    );
                })}
            </Stepper>
        </div>
    );
};
export default ProductStats;
