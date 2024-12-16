import React from 'react';
import { IoIosMore } from 'react-icons/io';
import { useStateContext } from '../../contexts/ContextProvider';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import {
    FaDollarSign,
    FaMoneyBillAlt,
    FaMoneyBill,
    FaBox,
    FaFilter,
    FaChartBar,
} from 'react-icons/fa';
import ExportToExcel from '../ExportToExcel';

const YearStats = ({ idcomp, title, excelData, kkm, sales1C, products1C, deals, leads }) => {
    const { currentColor, currentMode } = useStateContext();

    const weeklyStats = [
        {
            id: '1',
            icon: <FaDollarSign />,
            amount: 'тг',
            title: 'Выручка',
            // desc: 'XX',
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
        {
            id: '2',
            icon: <FaMoneyBill />,
            amount: 'тг',
            title: 'Средний чек',
            // desc: `Сотрудник ${data.bestWorker && data.bestWorker.id ? data.bestWorker.id : 'Пусто'}`,
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
        {
            id: '3',
            icon: <FaMoneyBillAlt />,
            amount: `?тг`,
            title: 'Макс чек',
            desc: `?`,
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
        {
            id: '4',
            icon: <FaBox />,
            amount: ' шт',
            title: 'Топ товар',
            desc: '',
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
        {
            id: '5',
            icon: <FaFilter />,
            amount: '%',
            title: 'Конверсия',
            desc: 'Bitrix',
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
        {
            icon: <FaChartBar />,
            amount: '',
            title: 'Продано товаров',
            desc: 'Уникальных товаров ',
            iconBg: '#1e4db6',
            pcColor: 'green-600',
        },
    ];

    return (
        <div className="bg-white dark:text-gray-200 justify-center align-center text-center dark:bg-secondary-dark-bg p-1 ml-1 w-[100%] md:w-[35%] rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 mx-3">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">{title}</p>
                        <button type="button" className="text-xl font-semibold text-gray-500">
                            <IoIosMore />
                        </button>
                    </div>

                    <div className="mt-2">
                        {weeklyStats.map((item) => (
                            <div
                                key={idcomp + item.id}
                                className="flex justify-between mt-4 w-full"
                            >
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        style={{ background: item.iconBg }}
                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                    >
                                        {item.icon}
                                    </button>
                                    <div>
                                        <p className="text-md font-semibold">{item.title}</p>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>

                                <p className={`text-${item.pcColor}`}>{item.amount}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex justify-center">
                        <ExportToExcel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YearStats;
