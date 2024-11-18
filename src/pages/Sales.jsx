import React, { useEffect, useState } from 'react';
import {
    DailySalesStats,
    YearStats,
    MonthlyTotalSalesChart,
    OverallRevenueChart,
    WeeklyStats,
    MonthlyConversion,
} from '../components/Sales';
import StatsBoxes from '../components/Sales/StatsBoxes';
import PeriodStats from '../components/demo/PeriodStats';
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
import { getLeadsBack } from '../methods/dataFetches/getLeadsBack';
import { parse } from 'postcss';

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

const Sales = ({ urls }) => {
    const [salesShare, setSalesShare] = useState([]);
    const { skeletonUp, kkm, receipts, leads, deals, setLeads, dateRanges } = useStateContext();
    const [ready, setReady] = useState(false);
    const [productsGridRows, setProductGridRows] = useState([]);
    const [productStats, setProductStats] = useState({});
    const [barSeriesAll, setBarSeriesAll] = useState([]);
    const [barSeriesByStore, setBarSeriesByStore] = useState([]);
    const [leadsSeries, setLeadsSeries] = useState([]);
    const [totalSeries, setTotalSerues] = useState([]);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');
    const [userSpisanieUrl, setUserSpisanieUrl] = useState('');

    useEffect(() => {
        if (kkm.monthFormedKKM && receipts.monthReceiptsData) {
            setSalesShare(SaleShare(kkm.monthFormedKKM));
            setProductGridRows(ProductSoldGridList(kkm.monthFormedKKM));
            setProductStats(ProductsStats(kkm.monthFormedKKM));
            setBarSeriesAll(SalesBarSeriesAll(kkm.monthFormedKKM));
            setBarSeriesByStore(SalesBarSeriesByStore(kkm.monthFormedKKM));
        }
        if (leads.series && deals.dealsMonth) {
            setLeadsSeries(leads.series);

            const conversion = generateConversionSeries(leads.series, deals.dealsMonth.salesSeries);
            const totalSeriesL = formData(leads.series, conversion);

            // console.log("Leads:", leads);
            // console.log("Deals:", deals);

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
                setUserReceiptsUrl(convReceipt);
                setUserSpisanieUrl(convSpis);
            }
        }
        window.scrollTo(0, 0);
    }, []);
    // console.log("barSeriesAll", barSeriesAll);
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
        <div className="mt-12 flex flex-col gap-3  justify-center ">
            <div className="flex  w-[100%] flex-wrap  justify-center align-top xs:flex-col    gap-[0.5rem] items-center">
                <DailySalesStats />
                <WeeklyStats idcomp="weekStats" title="Дневная статистика" />
            </div>
            <div className="flex w-[100%] flex-wrap align-center justify-center gap-[1.5rem] items-center">
                <StatsBoxes
                    title="Продукты"
                    rows={productsGridRows}
                    columns={GridProductListCols}
                />
            </div>
            <div className="flex w-[100%] flex-wrap align-center justify-center gap-[1.5rem] items-center">
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
            <div className="flex w-[100%]   gap-6 align-center  flex-wrap justify-center   items-center">
                <CarouselCard
                    carousel={true}
                    userKkmUrl={userKkmUrl}
                    data={salesShare}
                    title="Доли продаж"
                />
                <ProductStatsComp title="Товары" userKkmUrl={userKkmUrl} stats={productStats} />
                {/* <PeriodStats title="Товары" stats={salesStats} statsTwo={salesStatsTwo} statsThree={salesStats} /> */}
            </div>
            <div className="flex w-[100%] align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                {/* <CardWithBarChart title="Общие продажи" series={barSeriesAll} dataKey="Все" /> */}
                <CardWithBarChart
                    title="Продажи по магазинам"
                    series={barSeriesByStore}
                    userKkmUrl={userKkmUrl}
                    dataKey="Все"
                />
            </div>
            <div className="flex w-[100%] align-center  flex-wrap justify-center gap-[1.5rem]  items-center">
                {/* <MonthlyTotalSalesChart leadsSeries={leadsSeries} title="Лиды за месяц" type="leads" /> */}
                <MonthlyConversion
                    leadsSeries={totalSeries}
                    title="Конверсия Bitrix %"
                    type="conversion"
                />
                {/* <MonthlyTotalSalesChart leadsSeries={conversionSeries} title="Конверсия Bitrix %" type="conversion"/> */}
            </div>
            <div className="flex mt-5 flex-wrap align-center justify-center gap-[1.5rem] w-[100%] items-center">
                <OverallRevenueChart series={barSeriesAll} />
                <YearStats title="Годовая статистика" />
            </div>
        </div>
    );
};

export default Sales;
