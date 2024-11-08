import React, { useEffect, useState } from 'react';

import { useStateContext } from '../contexts/ContextProvider';
import LoadingSkeleton from '../components/LoadingSkeleton'
import { PaidToAmount } from '../components/Finance'
import  CardWithStats  from '../components/demo/ChartsHolder'
import PeriodStats from '../components/demo/PeriodStats';
import CarouselCard from '../components/demo/Slider';
import  TableSort  from '../components/demo/TablesList';
import ProductStats from '../components/demo/ProductStats';
import { FinanceShare, SaleShare, GridSpisanieListRows, GridSpisanieListCols, SpisanieStats } from '../data/MainDataSource';
import { fetchDeals } from '../methods/dataFetches/getDealsBitrix';



function convertUrl(apiUrl) {
  // Replace the base URL with '/api'
  return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}


const General = ({urls}) => {

  const { kkm, skeletonUp, spisanie, dateRanges, deals, setDeals } = useStateContext();
  const [ ready, setReady ] = useState(false)
  const [ salesShare, setSalesShare ] = useState([]);
  const [ financeShare, setFinanceShare ] = useState([]);
  const [ tableRows, setTableRows ] = useState([]);
  const [ spisanieStats, setSpisanieStats ] = useState([]);
  const [ dealsStats, setDealsStats ] = useState({});
  const [ userKkmUrl, setUserKkmUrl ] = useState("");
  const [ userReceiptsUrl , setUserReceiptsUrl ] = useState("");
  const [ userSpisanieUrl , setUserSpisanieUrl ] = useState("");

  useEffect(()=> {
    if(kkm.monthFormedKKM && spisanie.monthSpisanie){
      setSalesShare(SaleShare(kkm.monthFormedKKM));
      setFinanceShare(FinanceShare(kkm.monthFormedKKM));
      // setTableRows(GridSpisanieListRows(spisanie.monthSpisanie));
      // setSpisanieStats(SpisanieStats(spisanie.monthSpisanie));
      setReady(true);
    }
    // console.log("urls", urls);
    if(urls.externalApis && urls.externalApis.apiUrlKKM){
      const convKkm = urls.externalApis.apiUrlKKM ? convertUrl(urls.externalApis.apiUrlKKM) : null;
      const convReceipt = urls.externalApis.apiUrlReceipts ? convertUrl(urls.externalApis.apiUrlReceipts) : null;
      // const convSpis = urls.externalApis.apiUrlSpisanie ? convertUrl(urls.externalApis.apiUrlSpisanie) : null;
      // console.log(convKkm)
      if(convKkm != null && convReceipt != null 
        // && convSpis != null
        ){
        setUserKkmUrl(convKkm);
        setUserReceiptsUrl(convReceipt);
        // setUserSpisanieUrl(convSpis)
      }
    }
  }, [])
  
  if(!ready && skeletonUp && userSpisanieUrl != ""){
    return(
      <div className='flex m-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]'>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  } 
  
  return ( 
    <div className="mt-12 flex flex-col gap-6 align-center  justify-center">
      <div className="flex mt-5 gap-4  w-[100%] flex-col md:flex-row  justify-center align-top      items-center">
        <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
      </div>
     
      <div className="flex w-[100%] flex-wrap  justify-center align-top xs:flex-col    gap-4 items-center">
        <PaidToAmount userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} height="520px" comb={true} id="PaidToWeek" title="Выручка"  />
        <PeriodStats title="Финансы" userKkmUrl={userKkmUrl}  />
      </div>
      {/* <div className="flex w-[100%] mt-5  gap-4  items-center flex-col md:flex-row justify-center"> */}
        {/* <ProductStats title="Товары" /> */}
        {/* <CarouselCard carousel={true} data={financeShare} title="Доли финансов" /> */}
        {/* <PeriodStats title="Товары" stats={salesStats} statsTwo={salesStatsTwo} statsThree={salesStats} /> */}
        {/* <CarouselCard carousel={true}  data={salesShare} title="Доли продаж" />
      </div> */}
      {/* <div className="flex   w-[100%] flex-wrap  justify-center align-top xs:flex-col   gap-4 items-center">
        <TableSort title="Списания" userSpisanieUrl={userSpisanieUrl} userKkmUrl={userKkmUrl} spisanieStats={spisanieStats} rows={tableRows} columns={GridSpisanieListCols} urls={urls} />
      </div> */}
    </div>
  );
};
 
export default General;