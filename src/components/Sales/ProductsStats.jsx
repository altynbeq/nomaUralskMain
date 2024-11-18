import React from 'react';
import { IoIosMore } from 'react-icons/io';
import { FaDollarSign, FaMoneyBillAlt, FaMoneyBill, FaChartBar } from 'react-icons/fa';
import { ExportToExcel } from '../';

const ProductsStats = ({ idcomp, title }) => {
    const weeklyStats = [
        {
            id: '1',
            icon: <FaDollarSign />,
            amount: '1 300 230 тг',
            title: 'Топ выручка',
            desc: 'Choco',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            id: '2',
            icon: <FaMoneyBill />,
            amount: '3100 шт',
            title: 'Топ продаж',
            desc: 'Nintendo',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            id: '3',
            icon: <FaMoneyBillAlt />,
            amount: '11 шт',
            title: 'Худший продаж',
            desc: 'PC',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            id: '7',
            icon: <FaMoneyBillAlt />,
            amount: '12 000 тг',
            title: 'Худшая выручка',
            desc: 'WeWork',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            icon: <FaChartBar />,
            amount: 131,
            title: 'Продано товаров',
            desc: 'Уникальных товаров ',
            iconBg: 'rgb(254, 201, 15)',
            pcColor: 'green-600',
        },
    ];

    return (
        <div className="bg-white dark:text-gray-200 justify-center align-center text-center dark:bg-secondary-dark-bg  ml-1 w-[90%] md:w-[30%] rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
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

                    <div className="mt-2">
                        <ExportToExcel title={title} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsStats;
