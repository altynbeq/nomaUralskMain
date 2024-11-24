import React from 'react';
import { IoIosMore } from 'react-icons/io';
import { useStateContext } from '../../contexts/ContextProvider';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';

const WeekItemsStats = () => {
    const { currentColor, currentMode } = useStateContext();

    const weeklyStats = [
        {
            icon: <FiShoppingCart />,
            amount: 'XXX',
            title: 'Best Selling items',
            desc: 'XXX',
            iconBg: '#FB9678',
            pcColor: 'green-600',
        },
        {
            icon: <FiStar />,
            amount: 'LIST OF ITEMS',
            title: 'Best Selling items',
            desc: 'LIST OF ITEMS',
            iconBg: 'rgb(254, 201, 15)',
            pcColor: 'green-600',
        },
        {
            icon: <FiStar />,
            amount: 'LIST OF ITEMS',
            title: 'Топ прибыль',
            desc: 'LIST OF ITEMS',
            iconBg: 'rgb(254, 201, 15)',
            pcColor: 'green-600',
        },
        {
            icon: <BsChatLeft />,
            amount: 'LIST OF ITEMS',
            title: 'Лучший день',
            desc: 'LIST OF ITEMS',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            icon: <BsChatLeft />,
            amount: 'LIST OF ITEMS',
            title: 'Топ конверсия',
            desc: 'LIST OF ITEMS',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
        {
            icon: <BsChatLeft />,
            amount: 'LIST OF ITEMS',
            title: 'Топ средний чек',
            desc: 'LIST OF ITEMS',
            iconBg: '#00C292',
            pcColor: 'green-600',
        },
    ];

    return (
        <div className="bg-white dark:text-gray-200 justify-center align-center text-center dark:bg-secondary-dark-bg p-1 ml-1 w-[90%] md:w-[30%] rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">Месячная статистика</p>
                        <button type="button" className="text-xl font-semibold text-gray-500">
                            <IoIosMore />
                        </button>
                    </div>

                    <div className="mt-2">
                        {weeklyStats.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4 w-full">
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
                        {/* <div className="mt-4">
                    <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData}  color="rgb(242, 252, 253)" />
                    </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekItemsStats;
