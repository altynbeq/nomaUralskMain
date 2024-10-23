import React, {useEffect, useRef, useState} from 'react'
import { Calendar } from 'primereact/calendar';
import { useStateContext } from "../../contexts/ContextProvider";
import BarChartWide from '../ReCharts/BarChartWide';
import LoadingSkeleton from "../LoadingSkeleton";
import {setTime} from "@syncfusion/ej2-react-schedule";

const YearBarChart = () => {
    const { dateRanges } = useStateContext();
    const stepperRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleDateChange = (e) => {
        setLoading(true);
        setTimeout(()=>{setLoading(false);},1000)

    }
    useEffect(()=> {
        let updateDimensions = () => {
            if (componentRef.current) {
                const {offsetWidth, offsetHeight} = componentRef.current;
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight,
                })
            }
        };
        updateDimensions()},[loading]);
    const [dates, setDates] = useState([new Date(dateRanges[1].startDate.replace('%20', ' ')), new Date(dateRanges[1].endDate.replace('%20', ' '))]);
    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[90%] md:w-[87%]  rounded-2xl subtle-border">
            <div className='flex flex-row justify-between mb-4 '>
                <div className=''>
                    <p className="text-[1rem] font-semibold ">Финансы за год</p>
                </div>
                <div className="flex flex-wrap border-solid border-1 rounded-xl border-black px-2 gap-1">
                            <Calendar value={dates} onChange={(e) => {
                        handleDateChange(e.value)
                        setDates(e.value)
                        }} selectionMode="range" readOnlyInput hideOnRangeSelection />
                </div>
            </div>
            {loading ? <div className="pr-4 pt-2">
                <LoadingSkeleton width={dimensions.width} height={dimensions.height - 8}/>
            </div> : '' }

            {!loading ? <div ref={componentRef}>
            <div className='flex h-[400px]'>
                <BarChartWide />
            </div></div>:''}
        </div>
    )
}

export default YearBarChart