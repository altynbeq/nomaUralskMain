import React, { useRef, useState, useEffect } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from "../../contexts/ContextProvider";
import { StoresList, FormatAmount, TotalCounter, ConvertCalendarDate } from '../../data/MainDataSource';
import { FaDollarSign, FaMoneyBillAlt, FaBoxOpen, FaRegThumbsDown, FaMoneyBill, FaBox, FaFilter, FaChartBar } from "react-icons/fa";
import { getKKMReceiptsFront } from '../../methods/dataFetches/getKKM';
import LoadingSkeleton from "../LoadingSkeleton";

const PeriodStats = ({ idcomp, title, urls, userKkmUrl }) => {
    const stepperRef = useRef(null);
    const { dateRanges, receipts, kkm, spisanie, deals } = useStateContext();
    const [ total, setTotal ] = useState(0);
    const [dates, setDates] = useState([new Date(dateRanges[1].startDate.replace('%20', ' ')), new Date(dateRanges[1].endDate.replace('%20', ' '))]);
    const [panelData, setPanelData] = useState([]);
    const [ kkmStats, setKkmStats ] = useState([]);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


    const handleDateChange = async (e) => {
        if(e[1]){
            setLoading(true);
            const properDate = ConvertCalendarDate(e);
            const kkmList = await getKKMReceiptsFront(userKkmUrl, properDate);
            setKkmStats(kkmList);

            setTotal(TotalCounter(kkmList));
            setLoading(false);
        }
    } 
    useEffect(()=> {
        if(kkm.monthFormedKKM && receipts.monthReceiptsData){
          setTotal(TotalCounter(kkm.monthFormedKKM))
          setKkmStats(kkm.monthFormedKKM);
        }
        if (componentRef.current && document.readyState === 'complete') {
            const {offsetWidth, offsetHeight} = componentRef.current;
            setDimensions({
                width: offsetWidth,
                height: offsetHeight,
            })
        }
      }, [receipts,loading])
    
    const financeStatsTemplate = [
        { id: '1', title: 'Выручка', icon: <FaDollarSign />, iconBg: '#1d4db7', pcColor: 'black-600', valueKey: 'totalSum', format: true },
        { id: '2', title: 'Средний чек', icon: <FaMoneyBill />, iconBg: '#1d4db7', pcColor: 'black-600', valueKey: 'averageCheck', format: true },
        { id: '3', title: 'Продаж', icon: <FaMoneyBillAlt />, iconBg: '#1d4db7', pcColor: 'black-600', valueKey: 'totalNumberSales', format: false },
        { id: '4', title: 'Продаж Bitrix', icon: <FaBox />, iconBg: '#1d4db7', pcColor: 'black-600', btrx: true, valueKey: 'spisanie', format: false, desc: 'Все магазины' },
        { id: '5', title: 'Средний чек Bitrix', icon: <FaFilter />, iconBg: '#1d4db7', pcColor: 'black-600', btrx: true, valueKey: 'conversion', format: false, desc: 'Все магазины' },
    ];
    return (
        <div style={{alignSelf:'flex-start', minHeight: 520}} className={`bg-white dark:text-gray-200 overflow-hidden  dark:bg-secondary-dark-bg rounded-2xl w-[90%] md:w-[43%] p-6 flex flex-col subtle-border`}>
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
            {loading ? <div className="pr-4 pt-2">
                <LoadingSkeleton width={dimensions.width} height={dimensions.height - 8}/>
            </div> : '' }

            {!loading ? <div ref={componentRef}>
            <div className="flex flex-row mb-1">
                <h3>Общая: &nbsp;</h3>
                <p className="text-green-400 text-1xl">{total} ₸</p> {/* Update this total dynamically if needed */}
            </div>
            <Stepper ref={stepperRef}>
                {Object.entries(kkmStats).map(([storeName, storeData]) => {
                    const avgCheck = Math.round(storeData.totalSum / storeData.totalNumberSales)
                    return(
                        <StepperPanel key={storeName} header={storeName}>
                            <div className="mt-2">
                                {financeStatsTemplate.map((stat) => {
                                    const statValue = stat.valueKey === 'averageCheck' ? avgCheck : storeData[stat.valueKey]
                                    return(
                                        <div key={stat.id} className="flex justify-between mt-4 w-full">
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                style={{ background: stat.iconBg }}
                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                            >
                                                {stat.icon}
                                            </button>
                                            <div>
                                                <p className="text-md font-semibold">{stat.title}</p>
                                                <p className="text-sm text-gray-400">{stat.desc || `Данные по ${storeName}`}</p>
                                            </div>
                                        </div>
                                        <p className={stat.pcColor}>
                                        {stat.format ? FormatAmount(statValue) : stat.btrx && stat.title == "Продаж Bitrix" ? FormatAmount(deals.leadsCount) : stat.btrx && stat.title == "Средний чек Bitrix" ? FormatAmount(deals.avgCheck) : statValue} {stat.format ? '₸' : ''}
                                        </p>
                                    </div>
                                    )
                                    
                                })
                                }
                                    
                            </div>
                        </StepperPanel>
                    )
                    
                })}
            </Stepper>
            </div> : ""}
    </div>
    )
}
export default PeriodStats