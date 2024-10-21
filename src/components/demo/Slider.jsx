import React, { useEffect, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { Dropdown } from 'primereact/dropdown';
import { useStateContext } from "../../contexts/ContextProvider";
import { StepperPanel } from 'primereact/stepperpanel';
import { FaDollarSign, FaMoneyBillAlt, FaMoneyBill, FaBox, FaFilter, FaChartBar } from "react-icons/fa";
import PieChartRe from '../ReCharts/PieChart'
import { MonthDropdownToDate, FinanceShare } from '../../data/MainDataSource';
import { getKKMReceiptsFront } from '../../methods/dataFetches/getKKM';

const Slider = ({ title, data, userKkmUrl }) => {
    const stepperRef = useRef(null);
    const { kkm } = useStateContext();
    const [ shares, setShare ] = useState([]);
    const [ selectedMonth, setSelectedMonth ] = useState('Сентябрь');
    const months = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    const handleMonthChange = async (e) => {
        setSelectedMonth(e);
        const properDate = MonthDropdownToDate(e);
        if(title == "Доли финансов"){
            const kkmData = await getKKMReceiptsFront(userKkmUrl, properDate);
            setShare(FinanceShare(kkmData));
        }
    }

    useEffect(() => {
        if(shares.length == 0){
            setShare([...data]);
        }
    }, [data])
   
    return (
        <div className={`bg-white dark:text-gray-200 justify-center p-5 dark:bg-secondary-dark-bg w-[90%] md:w-[42%] rounded-2xl subtle-border`}>
            <div className="flex flex-row justify-between gap-4 ">
                <h2 className="text-black font-bold text-1xl">{title}</h2>
                <div className="flex flex-wrap  pb-6 gap-1 border-solid	 ">
                <Dropdown 
                    value={selectedMonth} 
                    onChange={(e) => handleMonthChange(e.value)} 
                    options={months} 
                    optionLabel="name" 
                    placeholder="Выберите месяц" 
                    className="w-full md:w-14rem" /> 
                </div>
            </div>
            
            <div className="h-[300px]">
                <PieChartRe data={shares} />
            </div>
        </div>
    )
}
export default Slider