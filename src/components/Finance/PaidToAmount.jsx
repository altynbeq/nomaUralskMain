import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from '../../contexts/ContextProvider';
import ProgressCardColored from '../demo/ProgressLine';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { TotalCounter, PaidToData, ConvertCalendarDate } from '../../data/MainDataSource';
import { getKKMReceiptsFront } from '../../methods/dataFetches/getKKM';
import { getSalesReceiptsFront } from '../../methods/dataFetches/getSalesReceipts';
import { getUserUrls } from '../../methods/getUserUrls';


const PaidToAmount = ({ comb, title, height, userKkmUrl, userReceiptsUrl }) => {
  const { dateRanges, receipts, kkm } = useStateContext();
  const [ totalSum, setTotalSum ] = useState();
  const stepperRef = useRef(null);
  const [ total, setTotal ]= useState(0);
  const [dates, setDates] = useState([
    new Date(dateRanges[1].startDate.replace('%20', ' ')),
    new Date(dateRanges[1].endDate.replace('%20', ' '))
  ]);
  const [panelData, setPanelData] = useState([]);

  const handleDateChange = async (e) => {
    if(e[1]){
      const properDate = ConvertCalendarDate(e);
      
      const salesList = await getSalesReceiptsFront(userReceiptsUrl, properDate);
      setPanelData(PaidToData(salesList));

      const kkmList = await getKKMReceiptsFront(userKkmUrl, properDate);

      setTotal(TotalCounter(kkmList))
    }
  };
  useEffect(()=> {
    if(kkm.monthFormedKKM && receipts.monthReceiptsData){
      setPanelData(PaidToData(receipts.monthReceiptsData));
      setTotal(TotalCounter(kkm.monthFormedKKM))
    }
  }, [receipts])

  return (
    <div className={`bg-white dark:text-gray-200 overflow-hidden min-h-[${height}] dark:bg-secondary-dark-bg rounded-2xl w-[90%] md:w-[${comb ? '43%' : '43%'}] p-4 flex flex-col subtle-border`}>
      <div className="flex flex-row justify-between mb-4">
        <p className="text-[1rem] font-semibold">{title}</p>
        <div className="flex flex-wrap border-solid border-1 rounded-xl border-black px-2 gap-1">
          <Calendar
            value={dates}
            onChange={(e) => {
              handleDateChange(e.value);
              setDates(e.value);
            }}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
          />
        </div>
      </div>
      <div className="flex flex-row mb-5">
        <h3>Общая: &nbsp;</h3>
        <p className="text-green-400 text-1xl">{total} тг</p> {/* Update this total dynamically if needed */}
      </div>

      <Stepper ref={stepperRef}>
        {panelData.map((panel, index) => (
          <StepperPanel key={index} header={panel.header}>
            <div>
              <section className="flex flex-wrap mb-4">
                <div className="flex flex-row">
                  <h3>{panel.header}: &nbsp;</h3>
                  <p className="text-1xl">{panel.value}</p>
                  <span className="p-1 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-[10px]">
                    {panel.percentage}%
                  </span>
                </div>
              </section>
              <section className="flex flex-col justify-between gap-6">
                {panel.kaspiStats.map((stat, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex flex-row justify-between gap-2">
                      <h3>{stat.title}</h3>
                      <p>{stat.current}тг 
                      {/* {stat.value}% */}
                      </p>
                    </div>
                    <ProgressCardColored value={stat.value} />
                  </div>
                ))}
              </section>
            </div>
          </StepperPanel>
        ))}
      </Stepper>
    </div>
  );
};

export default PaidToAmount;
