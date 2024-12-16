import React, { useEffect, useState } from 'react';
import {
    DailySalesStats,
    YearStats,
    OverallRevenueChart,
    WeeklyStats,
    MonthlyConversion,
} from '../components/Sales';
import StatsBoxes from '../components/Sales/StatsBoxes';
import CardWithBarChart from '../components/demo/CardWithBarChart';
import TableSort from '../components/demo/TablesList';
import CarouselCard from '../components/demo/Slider';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useStateContext } from '../contexts/ContextProvider';
import {
    SaleShare,
    ProductsStats,
    ProductSoldGridList,
    GridProductListCols,
    SalesBarSeriesAll,
    SalesBarSeriesByStore,
} from '../data/MainDataSource';
import ProductStatsComp from '../components/demo/ProductsStatComp';
import { useCompanyStore } from '../store/companyStore';

function generateConversionSeries(leadsSeries, dealsSeries) {
    return leadsSeries.map((lead, index) => {
        const leadValue = lead.y;
        const dealValue = dealsSeries[index].y;

        // Avoid division by zero by checking if leadValue is greater than 0
        const conversion = leadValue > 0 ? (dealValue * 100) / leadValue : 0;

        return { x: lead.x, y: conversion.toFixed(2) }; // Round conversion to 2 decimal places
    });
}

function formData(leadsSeries, conversionSeries) {
    return leadsSeries.map((lead, index) => ({
        name: `Day ${lead.x}`,
        lead: lead.y, // leads
        conversion: parseFloat(conversionSeries[index].y), // conversion percentage
        amt: 0, // placeholder for any additional data, or you can remove this if not needed
    }));
}

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const InternalTabs = ({ urls }) => {
    const [salesShare, setSalesShare] = useState([]);
    const { skeletonUp, access } = useStateContext();
    const kkm = useCompanyStore((state) => state.kkm);
    const receipts = useCompanyStore((state) => state.receipts);
    const leads = useCompanyStore((state) => state.leads);
    const deals = useCompanyStore((state) => state.deals);
    const [productsGridRows, setProductGridRows] = useState([]);
    const [productStats, setProductStats] = useState({});
    const [barSeriesAll, setBarSeriesAll] = useState([]);
    const [barSeriesByStore, setBarSeriesByStore] = useState([]);
    const [totalSeries, setTotalSerues] = useState([]);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userSpisanieUrl, setUserSpisanieUrl] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (kkm?.monthFormedKKM && receipts?.monthReceiptsData) {
            setSalesShare(SaleShare(kkm.monthFormedKKM));
            setProductGridRows(ProductSoldGridList(kkm.monthFormedKKM));
            setProductStats(ProductsStats(kkm.monthFormedKKM));
            setBarSeriesAll(SalesBarSeriesAll(kkm.monthFormedKKM));
            setBarSeriesByStore(SalesBarSeriesByStore(kkm.monthFormedKKM));
        }
        if (leads?.series && deals?.dealsMonth) {
            const conversion = generateConversionSeries(leads.series, deals.dealsMonth.salesSeries);
            const totalSeriesL = formData(leads.series, conversion);

            setTotalSerues(totalSeriesL);
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
                setUserSpisanieUrl(convSpis);
            }
        }
        window.scrollTo(0, 0);
    }, [
        deals?.dealsMonth,
        kkm?.monthFormedKKM,
        leads?.series,
        receipts?.monthReceiptsData,
        urls?.externalApis,
    ]);
    if (skeletonUp) {
        return (
            <div className="flex mx-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        );
    }

    const tabs = [
        {
            id: 'general',
            label: 'Общая',
        },
        {
            id: 'offline',
            label: 'Оффлайн',
        },
        {
            id: 'online',
            label: 'Онлайн',
        },
    ];

    const tabContents = {
        general: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex   flex-wrap  justify-center align-top xs:flex-col    gap-[0.5rem] items-center">
                    <DailySalesStats kkm={kkm} />
                    <WeeklyStats
                        deals={deals}
                        kkm={kkm}
                        idcomp="weekStats"
                        title="Дневная статистика"
                    />
                </div>
                <div className="flex  flex-wrap align-center justify-center gap-[1.5rem] items-center">
                    <StatsBoxes
                        title="Продукты"
                        rows={productsGridRows}
                        columns={GridProductListCols}
                    />
                </div>
                <div className="flex  flex-wrap align-center justify-center gap-[1.5rem] items-center">
                    <TableSort
                        title="Продано товаров"
                        userSpisanieUrl={userSpisanieUrl}
                        userKkmUrl={userKkmUrl}
                        displayStats={true}
                        width="25%"
                        spisanieStats={productStats}
                        rows={productsGridRows}
                        columns={GridProductListCols}
                    />
                </div>
                <div className="flex    gap-6 align-center  flex-wrap justify-center   items-center">
                    <CarouselCard
                        carousel={true}
                        userKkmUrl={userKkmUrl}
                        data={salesShare}
                        title="Доли продаж"
                    />
                    <ProductStatsComp
                        kkm={kkm}
                        title="Товары"
                        userKkmUrl={userKkmUrl}
                        stats={productStats}
                    />
                    {/* <PeriodStats title="Товары" stats={salesStats} statsTwo={salesStatsTwo} statsThree={salesStats} /> */}
                </div>
                <div className="flex  align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                    {/* <CardWithBarChart title="Общие продажи" series={barSeriesAll} dataKey="Все" /> */}
                    <CardWithBarChart
                        title="Продажи по магазинам"
                        series={barSeriesByStore}
                        userKkmUrl={userKkmUrl}
                        dataKey="Все"
                    />
                </div>
                <div className="flex  align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                    {/* <MonthlyTotalSalesChart leadsSeries={leadsSeries} title="Лиды за месяц" type="leads" /> */}
                    <MonthlyConversion
                        leadsSeries={totalSeries}
                        title="Конверсия Bitrix %"
                        type="conversion"
                    />
                    {/* <MonthlyTotalSalesChart leadsSeries={conversionSeries} title="Конверсия Bitrix %" type="conversion"/> */}
                </div>
                <div className="flex mt-5 flex-wrap align-center justify-center gap-[1.5rem]  items-center">
                    <OverallRevenueChart series={barSeriesAll} />
                    <YearStats title="Годовая статистика" />
                </div>
            </div>
        ),
        offline: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex  flex-wrap align-center justify-center gap-[1.5rem] items-center">
                    <TableSort
                        title="Продано товаров"
                        userSpisanieUrl={userSpisanieUrl}
                        userKkmUrl={userKkmUrl}
                        displayStats={true}
                        width="25%"
                        spisanieStats={productStats}
                        rows={productsGridRows}
                        columns={GridProductListCols}
                    />
                </div>
                <div className="flex    gap-6 align-center  flex-wrap justify-center   items-center">
                    <CarouselCard
                        carousel={true}
                        userKkmUrl={userKkmUrl}
                        data={salesShare}
                        title="Доли продаж"
                    />
                    <ProductStatsComp
                        kkm={kkm}
                        title="Товары"
                        userKkmUrl={userKkmUrl}
                        stats={productStats}
                    />
                    {/* <PeriodStats title="Товары" stats={salesStats} statsTwo={salesStatsTwo} statsThree={salesStats} /> */}
                </div>
                <div className="flex  align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                    {/* <CardWithBarChart title="Общие продажи" series={barSeriesAll} dataKey="Все" /> */}
                    <CardWithBarChart
                        title="Продажи по магазинам"
                        series={barSeriesByStore}
                        userKkmUrl={userKkmUrl}
                        dataKey="Все"
                    />
                </div>
            </div>
        ),
        online: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex  flex-wrap align-center justify-center gap-[1.5rem] items-center">
                    <StatsBoxes
                        title="Продукты"
                        rows={productsGridRows}
                        columns={GridProductListCols}
                    />
                </div>
                <div className="flex  align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                    {/* <MonthlyTotalSalesChart leadsSeries={leadsSeries} title="Лиды за месяц" type="leads" /> */}
                    <MonthlyConversion
                        leadsSeries={totalSeries}
                        title="Конверсия Bitrix %"
                        type="conversion"
                    />
                    {/* <MonthlyTotalSalesChart leadsSeries={conversionSeries} title="Конверсия Bitrix %" type="conversion"/> */}
                </div>
            </div>
        ),
    };

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
        // <div className="mt-12 flex flex-col gap-3  justify-center ">
        //     <div className="flex  w-[100%] flex-wrap  justify-center align-top xs:flex-col    gap-[0.5rem] items-center">
        //         <DailySalesStats kkm={kkm} />
        //         <WeeklyStats
        //             deals={deals}
        //             kkm={kkm}
        //             idcomp="weekStats"
        //             title="Дневная статистика"
        //         />
        //     </div>
        //     <div className="flex w-[100%] flex-wrap align-center justify-center gap-[1.5rem] items-center">
        //         <StatsBoxes
        //             title="Продукты"
        //             rows={productsGridRows}
        //             columns={GridProductListCols}
        //         />
        //     </div>
        //     <div className="flex w-[100%] flex-wrap align-center justify-center gap-[1.5rem] items-center">
        //         <TableSort
        //             title="Продано товаров"
        //             userSpisanieUrl={userSpisanieUrl}
        //             userKkmUrl={userKkmUrl}
        //             displayStats={true}
        //             width="25%"
        //             spisanieStats={productStats}
        //             rows={productsGridRows}
        //             columns={GridProductListCols}
        //         />
        //     </div>
        //     <div className="flex w-[100%]   gap-6 align-center  flex-wrap justify-center   items-center">
        //         <CarouselCard
        //             carousel={true}
        //             userKkmUrl={userKkmUrl}
        //             data={salesShare}
        //             title="Доли продаж"
        //         />
        //         <ProductStatsComp
        //             kkm={kkm}
        //             title="Товары"
        //             userKkmUrl={userKkmUrl}
        //             stats={productStats}
        //         />
        //         {/* <PeriodStats title="Товары" stats={salesStats} statsTwo={salesStatsTwo} statsThree={salesStats} /> */}
        //     </div>
        //     <div className="flex w-[100%] align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
        //         {/* <CardWithBarChart title="Общие продажи" series={barSeriesAll} dataKey="Все" /> */}
        //         <CardWithBarChart
        //             title="Продажи по магазинам"
        //             series={barSeriesByStore}
        //             userKkmUrl={userKkmUrl}
        //             dataKey="Все"
        //         />
        //     </div>
        //     <div className="flex w-[100%] align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
        //         {/* <MonthlyTotalSalesChart leadsSeries={leadsSeries} title="Лиды за месяц" type="leads" /> */}
        //         <MonthlyConversion
        //             leadsSeries={totalSeries}
        //             title="Конверсия Bitrix %"
        //             type="conversion"
        //         />
        //         {/* <MonthlyTotalSalesChart leadsSeries={conversionSeries} title="Конверсия Bitrix %" type="conversion"/> */}
        //     </div>
        //     <div className="flex mt-5 flex-wrap align-center justify-center gap-[1.5rem] w-[100%] items-center">
        //         <OverallRevenueChart series={barSeriesAll} />
        //         <YearStats title="Годовая статистика" />
        //     </div>
        // </div>
    );
};

const Sales = ({ urls }) => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs urls={urls} />
            </div>
        </div>
    );
};

export default Sales;
