import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { PaidToAmount, DailyRevenue, WeaklyRevenueOverviewStacked, TotalRevenuePie } from '../components/Finance';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CardWithStats from '../components/demo/ChartsHolder'
import YearBarChart from '../components/demo/YearBarChart'
import CarouselCard from '../components/demo/Slider';

import { FinanceShare } from '../data/MainDataSource';
import { fetchDeals } from '../methods/dataFetches/getDealsBitrix';

const Finance = () => {
  const { skeletonUp, kkm, receipts, deals, dateRanges } = useStateContext();
  const [ financeShare, setFinanceShare ] = useState([]);
  const [ weekDeals, setWeekDeals ] = useState([]);

  useEffect(()=>{
    if(kkm.monthFormedKKM){
      setFinanceShare(FinanceShare(kkm.monthFormedKKM));
    }
    // if(!weekDeals.avgCheck){
    //   const getter = async () => {
    //     const week = true;
    //     const data = await fetchDeals(dateRanges[1], week);
    //     setWeekDeals(data);
    //   }
    //   getter();
    // }
    window.scrollTo(0, 0);
  }, []);

  if(skeletonUp){
    return(
      <div className='flex mx-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]'>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  }
  return (
    <div className="mt-12 flex flex-col justify-center align-center gap-8">
      <div className="flex mt-5 w-[100%] align-center gap-4 flex-wrap md:flex-row justify-center">
        <DailyRevenue/>
        <div className=' flex justify-center gap-4 align-center flex-col w-[100%] md:w-[30%]'>
          <WeaklyRevenueOverviewStacked deals={weekDeals} />
          <TotalRevenuePie />
        </div>
      </div>
      <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
          <CardWithStats />
          {/* <PaidToAmount comb={true} id="PaidToWeek"  title="Выручка"  /> */}
      </div>
      <div className="flex gap-4 w-[100%] items-center align-center flex-col md:flex-row justify-center">
        {/* <PeriodStats title="Финансы"/> */}
        <PaidToAmount comb={true} height="350px" id="PaidToWeek"  title="Выручка"  />
        <CarouselCard carousel={true} data={financeShare} title="Доли финансов" />
      </div>
      <div className='flex gap-8 w-[100%] items-center align-center flex-col md:flex-row justify-center'>
        <YearBarChart />
      </div>
    </div>
  );
};

export default Finance;