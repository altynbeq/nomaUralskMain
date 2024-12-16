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
import { Navigate } from 'react-router-dom';
import { useCompanyStore } from '../store/companyStore';

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const InternalTabs = ({ urls }) => {
    const { skeletonUp } = useStateContext();
    const [financeShare, setFinanceShare] = useState([]);
    const [weekDeals, setWeekDeals] = useState([]);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');
    const kkm = useCompanyStore((state) => state.kkm);
    const deals = useCompanyStore((state) => state.deals);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (kkm?.monthFormedKKM) {
            setFinanceShare(FinanceShare(kkm.monthFormedKKM));
        }
        if (!weekDeals?.avgCheck) {
            setWeekDeals(deals?.dealsWeek);
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
    }, [deals?.dealsWeek, kkm?.monthFormedKKM, urls?.externalApis, weekDeals?.avgCheck]);

    const tabs = [
        {
            id: 'general',
            label: 'Общая',
        },
        {
            id: 'income',
            label: 'Выручка',
        },
        {
            id: 'expenses',
            label: 'Затраты',
        },
    ];

    const tabContents = {
        general: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex  align-center gap-4 flex-wrap md:flex-row justify-center">
                    <DailyRevenue userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                    <PaidToAmount
                        comb={true}
                        userKkmUrl={userKkmUrl}
                        userReceiptsUrl={userReceiptsUrl}
                        height="350px"
                        id="PaidToWeek"
                        title="Выручка"
                    />
                </div>
                <div className="flex gap-4  items-center align-center flex-col md:flex-row justify-center">
                    <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                </div>
                <div className="flex  gap-4   flex-col md:flex-row justify-center">
                    <div className=" flex justify-center gap-4 w-[100%] align-center flex-col  md:w-[35%]">
                        <WeaklyRevenueOverviewStacked deals={deals} />
                        <TotalRevenuePie deals={deals} />
                    </div>
                    <CarouselCard
                        carousel={true}
                        userKkmUrl={userKkmUrl}
                        data={financeShare}
                        title="Доли финансов"
                    />
                </div>
                <div className="flex gap-8  items-center align-center flex-col md:flex-row justify-center">
                    <YearBarChart />
                </div>
            </div>
        ),
        income: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex  align-center gap-4 flex-wrap md:flex-row justify-center">
                    <DailyRevenue userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                    <PaidToAmount
                        comb={true}
                        userKkmUrl={userKkmUrl}
                        userReceiptsUrl={userReceiptsUrl}
                        height="350px"
                        id="PaidToWeek"
                        title="Выручка"
                    />
                </div>
                <div className="flex gap-4  items-center align-center flex-col md:flex-row justify-center">
                    <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
                </div>
                <div className="flex  gap-4   flex-col md:flex-row justify-center">
                    <div className=" flex justify-center gap-4 align-center flex-col  md:w-[35%]">
                        <WeaklyRevenueOverviewStacked deals={deals} />
                        <TotalRevenuePie deals={deals} />
                    </div>
                    <CarouselCard
                        carousel={true}
                        userKkmUrl={userKkmUrl}
                        data={financeShare}
                        title="Доли финансов"
                    />
                </div>
                <div className="flex gap-8  items-center align-center flex-col md:flex-row justify-center">
                    <YearBarChart />
                </div>
            </div>
        ),
        expenses: (
            <div>
                <h2 className="text-2xl font-bold mb-4">Затраты</h2>
                <p className="text-gray-700">Здесь будет отображаться информация о затратах.</p>
            </div>
        ),
    };

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
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
            {/* Internal Tab Navigation */}
            <div className="border-b border-gray-300">
                <nav className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                            flex-1 py-3 px-3 text-center transition-colors duration-300
                            ${
                                activeTab === tab.id
                                    ? 'bg-blue-800 text-white font-semibold'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }
                            ${activeTab === tab.id ? 'first:rounded-tl-2xl last:rounded-tr-2xl' : ''}
                        `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-6">{tabContents[activeTab]}</div>
        </div>
    );
    // return (
    //     <div className="mt-12 flex flex-col justify-center align-center gap-8">
    //         <div className="flex mt-5 w-[100%] align-center gap-4 flex-wrap md:flex-row justify-center">
    //             <DailyRevenue userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
    //             <div className=" flex justify-center gap-4 align-center flex-col w-[100%] md:w-[30%]">
    //                 <WeaklyRevenueOverviewStacked deals={deals} />
    //                 <TotalRevenuePie deals={deals} />
    //             </div>
    //         </div>
    //         <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
    //             <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
    //         </div>
    //         <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
    //             <PaidToAmount
    //                 comb={true}
    //                 userKkmUrl={userKkmUrl}
    //                 userReceiptsUrl={userReceiptsUrl}
    //                 height="350px"
    //                 id="PaidToWeek"
    //                 title="Выручка"
    //             />
    //             <CarouselCard
    //                 carousel={true}
    //                 userKkmUrl={userKkmUrl}
    //                 data={financeShare}
    //                 title="Доли финансов"
    //             />
    //         </div>
    //         <div className="flex gap-8 w-[100%] items-center align-center flex-col md:flex-row justify-center">
    //             <YearBarChart />
    //         </div>
    //     </div>
    // );
};

const Finance = ({ urls }) => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs urls={urls} />
            </div>
        </div>
    );
};

export default Finance;
