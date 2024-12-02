import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from '../../contexts/ContextProvider';
import ProgressCardColored from '../demo/ProgressLine';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import {
    totalCounterReceipts,
    TotalCounter,
    PaidToData,
    ConvertCalendarDate,
} from '../../data/MainDataSource';
import { getKKMReceiptsFront } from '../../methods/dataFetches/getKKM';
import { getSalesReceiptsFront } from '../../methods/dataFetches/getSalesReceipts';
import { getUserUrls } from '../../methods/getUserUrls';
import LoadingSkeleton from '../LoadingSkeleton';

const PaidToAmount = ({ comb, title, height, userKkmUrl, userReceiptsUrl }) => {
    const { dateRanges, receipts, kkm } = useStateContext();
    const [totalSum, setTotalSum] = useState();
    const stepperRef = useRef(null);
    const [total, setTotal] = useState(0);
    const [dates, setDates] = useState([
        new Date(dateRanges[1].startDate.replace('%20', ' ')),
        new Date(dateRanges[1].endDate.replace('%20', ' ')),
    ]);
    const [panelData, setPanelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleDateChange = async (e) => {
        if (e[1]) {
            setLoading(true);
            const properDate = ConvertCalendarDate(e);

            const salesList = await getSalesReceiptsFront(userReceiptsUrl, properDate);
            // console.log("salesList", salesList)
            setPanelData(PaidToData(salesList));

            let kkmList = '';
            try {
                kkmList = await getKKMReceiptsFront(userKkmUrl, properDate);
            } catch (e) {
                // console.log("=>(PaidToAmount.jsx:29) e", e);
            }
            // console.log('calend')
            setTotal(totalCounterReceipts(salesList));
            setLoading(false);
        }
    };
    useEffect(() => {
        let updateDimensions = () => {
            if (componentRef.current) {
                const { offsetWidth, offsetHeight } = componentRef.current;
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight,
                });
            }
        };
        updateDimensions();

        if (kkm.monthFormedKKM && receipts.monthReceiptsData) {
            setPanelData(PaidToData(receipts.monthReceiptsData));
            setTotal(totalCounterReceipts(receipts.monthReceiptsData));
        }
    }, [receipts]);

    return (
        <div
            style={{ alignSelf: '', minHeight: 520 }}
            className={`bg-white dark:text-gray-200 overflow-hidden min-h-[${height}] dark:bg-secondary-dark-bg rounded-2xl w-[90%] md:w-[${comb ? '43%' : '43%'}] p-6 flex flex-col subtle-border`}
        >
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
            {loading ? (
                <div className="pr-4 pt-2">
                    <LoadingSkeleton width={dimensions.width} height={dimensions.height - 8} />
                </div>
            ) : (
                ''
            )}

            {!loading ? (
                <div ref={componentRef}>
                    <div className="flex flex-row mb-5">
                        <h3>Общая: &nbsp;</h3>
                        <p className="text-green-400 text-1xl">{total} ₸</p>{' '}
                        {/* Update this total dynamically if needed */}
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
                                                    <p>
                                                        {stat.current} ₸{/* {stat.value}% */}
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
            ) : (
                ''
            )}
        </div>
    );
};

export default PaidToAmount;
