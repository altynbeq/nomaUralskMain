import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import {
    PaidToAmount,
    DailyRevenue,
    WeaklyRevenueOverviewStacked,
    TotalRevenuePie,
} from '../components/Finance';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CardWithStats from '../components/demo/ChartsHolder';
import YearBarChart from '../components/demo/YearBarChart';
import CarouselCard from '../components/demo/Slider';
import { FinanceShare } from '../data/MainDataSource';

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const Finance = ({ urls }) => {
    const { skeletonUp, kkm, deals } = useStateContext();
    const [financeShare, setFinanceShare] = useState([]);
    const [weekDeals, setWeekDeals] = useState([]);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');

    useEffect(() => {
        if (kkm.monthFormedKKM) {
            setFinanceShare(FinanceShare(kkm.monthFormedKKM));
        }
        if (!weekDeals.avgCheck) {
            // console.log(deals)
            setWeekDeals(deals.dealsWeek);
        }
        if (urls.externalApis && urls.externalApis.apiUrlKKM) {
            const convKkm = urls.externalApis.apiUrlKKM
                ? convertUrl(urls.externalApis.apiUrlKKM)
                : null;
            const convReceipt = urls.externalApis.apiUrlReceipts
                ? convertUrl(urls.externalApis.apiUrlReceipts)
                : null;
            const convSpis = urls.externalApis.apiUrlSpisanie
                ? convertUrl(urls.externalApis.apiUrlSpisanie)
                : null;
            if (convKkm != null && convReceipt != null && convSpis != null) {
                setUserKkmUrl(convKkm);
                setUserReceiptsUrl(convReceipt);
            }
        }
        window.scrollTo(0, 0);
    }, [deals.dealsWeek, kkm.monthFormedKKM, urls.externalApis, weekDeals.avgCheck]);

    if (skeletonUp) {
        return (
            <div className="flex mx-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        );
    }
    return (
        <div className="mt-12 flex flex-col justify-center align-center gap-8">
            <div className="flex mt-5 w-[100%] align-center gap-4 flex-wrap md:flex-row justify-center">
                <DailyRevenue userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                <div className=" flex justify-center gap-4 align-center flex-col w-[100%] md:w-[30%]">
                    <WeaklyRevenueOverviewStacked deals={weekDeals} />
                    <TotalRevenuePie />
                </div>
            </div>
            <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
                <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                {/* <PaidToAmount comb={true} id="PaidToWeek"  title="Выручка"  /> */}
            </div>
            <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
                {/* <PeriodStats title="Финансы"/> */}
                <PaidToAmount
                    comb={true}
                    userKkmUrl={userKkmUrl}
                    userReceiptsUrl={userReceiptsUrl}
                    height="350px"
                    id="PaidToWeek"
                    title="Выручка"
                />
                <CarouselCard
                    carousel={true}
                    userKkmUrl={userKkmUrl}
                    data={financeShare}
                    title="Доли финансов"
                />
            </div>
            <div className="flex gap-8 w-[100%] items-center align-center flex-col md:flex-row justify-center">
                <YearBarChart />
            </div>
        </div>
    );
};

export default Finance;
