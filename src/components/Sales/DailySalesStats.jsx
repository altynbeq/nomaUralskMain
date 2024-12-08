import React, { useState, useEffect } from 'react';

import { Button } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import HolePie from '../ReCharts/HolePieChart';
import { FaShare, FaFileDownload } from 'react-icons/fa';
import { SalesHolePie, FinanceStats, FormatAmount, SpisanieStats } from '../../data/MainDataSource';
import { getSpisanie } from '../../methods/dataFetches/getSpisanie';
import { useAuthStore } from '../../store';
import { getCompanyData } from '../../methods/getCompanyData';

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl?.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const DailySalesStats = ({ kkm }) => {
    const { dateRanges } = useStateContext();
    const user = useAuthStore((state) => state.user);
    const date = dateRanges[0].bitrixStartDate.split(' ')[0];
    const [pieData, setPieData] = useState([]);
    const [stats, setStats] = useState({});
    const [spisanieSum, steSpisanieSum] = useState({});

    useEffect(() => {
        if (!user) {
            return;
        }
        const reqDate = dateRanges[0];
        const getter = async () => {
            const companyId = user.companyId ? user.companyId : user.id;
            const companyData = await getCompanyData(companyId);
            const userSpisanieUrl = convertUrl(companyData?.externalApis?.apiUrlSpisanie);
            console.log(userSpisanieUrl);
            const spisanieData = await getSpisanie(userSpisanieUrl, reqDate);

            const spis = SpisanieStats(spisanieData)?.totalSpisanieSum;
            const numericValue = parseFloat(spis?.replace(/,/g, ''));
            steSpisanieSum(numericValue);
        };
        getter();
        if (kkm.dayFormedKKM) {
            setPieData(SalesHolePie(kkm.dayFormedKKM));
            setStats(FinanceStats(kkm.dayFormedKKM));
        }
    }, [dateRanges, kkm.dayFormedKKM, user]);
    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[55%]  rounded-2xl subtle-border">
            <div className="flex justify-between">
                <p className="font-semibold text-1xl">Продажи за день</p>
                <div className="flex items-center gap-4">
                    <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                        <span>{date}</span>
                    </p>
                </div>
            </div>
            <div className="mt-5 flex gap-2 flex-col md:flex-col w-[100%] items-center text-center justify-center">
                <div className="w-[100%] h-[300px]  flex text-center flex-col align-center justify-center">
                    <h2>Store Sales</h2>
                    <HolePie data={pieData} />
                </div>
                <div className=" w-[100%] py-2 border-t-1 border-b-1 pr-2 flex flex-row md:w-[100%] gap-8 justify-center ">
                    <div className="md:flex md:flex-row">
                        <div className="flex justify-center  border-color  flex-col text-start md:mr-5">
                            <p className="text-gray-500 mt-1">Прибыль</p>
                            <span className="text-1xl ">{FormatAmount(stats.totalSum)} тг</span>
                        </div>
                        <div className="flex md:border-l-1 pl-2 flex-col text-start">
                            <p className="text-gray-500 mt-1">Продаж</p>
                            <p className="text-[1rem] font-semibold">
                                {FormatAmount(stats.salesCount)}
                            </p>
                        </div>
                    </div>
                    <div className="md:flex md:flex-row">
                        <div className="flex justify-center border-l-1  pl-2 flex-col text-start md:mr-5">
                            <p className="text-gray-500 mt-1">Продано товаров</p>
                            <p className="text-1xl font-semibold">
                                {FormatAmount(stats.itemsSold)}
                            </p>
                        </div>
                        <div className="flex justify-center border-l-1  pl-2 flex-col text-start">
                            <p className="text-gray-500 ">Cписание/Товары</p>
                            <span className="text-1xl font-semibold">
                                {FormatAmount(
                                    stats.totalSum > 0 && spisanieSum > 0
                                        ? Math.round((spisanieSum * 100) / stats.totalSum)
                                        : 0,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-5 justify-center">
                    <Button
                        text="Download"
                        bgColor="#1e4db6"
                        borderRadius="24px"
                        icon={<FaFileDownload />}
                    />
                    <Button text="Share" bgColor="#1e4db6" borderRadius="24px" icon={<FaShare />} />
                </div>
            </div>
        </div>
    );
};

export default DailySalesStats;
