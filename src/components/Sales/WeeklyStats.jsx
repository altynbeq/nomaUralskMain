import React, { useState, useRef } from 'react';
import {
    FaDollarSign,
    FaMoneyBillAlt,
    FaMoneyBill,
    FaBox,
    FaFilter,
    FaChartBar,
} from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { FormatAmount } from '../../data/MainDataSource';
import { useStateContext } from '../../contexts/ContextProvider';

const WeeklyStats = ({ idcomp, title }) => {
    const stepperRef = useRef(null);
    const { kkm, deals } = useStateContext();
    const [selectedStore, setSelectedStore] = useState('Все магазины');
    const stores = ['Все магазины', 'Алматы', 'Сатпаева', 'Панфилова'];

    const handleStoreChange = (e) => {
        setSelectedStore(e);
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
        // { id: '4', title: 'Продаж Bitrix', icon: <FaBox />, iconBg: '#1d4db7', pcColor: 'black-600', btrx: true, valueKey: 'spisanie', format: false, desc: 'Все магазины' },
        // { id: '5', title: 'Средний чек Bitrix', icon: <FaFilter />, iconBg: '#1d4db7', pcColor: 'black-600', btrx: true, valueKey: 'conversion', format: false, desc: 'Все магазины' },
    ];

    return (
        <div className="bg-white dark:text-gray-200 justify-center align-center text-center dark:bg-secondary-dark-bg p-1 ml-1 w-[90%] md:w-[35%] rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className="w-[100%] bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl px-6 pt-4 pb-6 mx-3">
                    <div className="flex flex-row  justify-start ">
                        <p className="text-1xl font-semibold">{title}</p>
                    </div>

                    <Stepper ref={stepperRef} style={{}}>
                        {Object.entries(kkm.monthFormedKKM).map(([storeName, storeData]) => {
                            const avgCheck = Math.round(
                                storeData.totalSum / storeData.totalNumberSales,
                            );
                            return (
                                <StepperPanel key={storeName} header={storeName}>
                                    <div className="mt-2">
                                        {financeStatsTemplate.map((stat) => {
                                            const statValue =
                                                stat.valueKey === 'averageCheck'
                                                    ? avgCheck
                                                    : storeData[stat.valueKey];
                                            return (
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
                                                                {stat.desc || ` ${storeName}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className={stat.pcColor}>
                                                        {stat.format
                                                            ? FormatAmount(statValue)
                                                            : stat.btrx &&
                                                                stat.title == 'Продаж Bitrix'
                                                              ? FormatAmount(deals.leadsCount)
                                                              : stat.btrx &&
                                                                  stat.title == 'Средний чек Bitrix'
                                                                ? FormatAmount(deals.avgCheck)
                                                                : statValue}{' '}
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
            </div>
        </div>
    );
};

export default WeeklyStats;
