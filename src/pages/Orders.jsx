import React, { useEffect, useState } from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Resize,
    Sort,
    ContextMenu,
    Filter,
    Page,
    ExcelExport,
    PdfExport,
    Edit,
    Inject,
} from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../data/ordersData';
import { Header, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { Calendar } from 'primereact/calendar';
import { OrdersEditModal, ExcelReader } from '../components/Sklad';

import { FaCalendarAlt } from 'react-icons/fa';
import { getSalesProductsFront } from '../methods/products&spisanie/getSalesProductsFront';
import LoadingSkeleton from '../components/LoadingSkeleton';

function formatDates(dates) {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}%20${hours}:${minutes}:${seconds}`;
    };

    return {
        startDate: formatDate(dates[0]),
        endDate: formatDate(dates[1]),
    };
}

const Orders = ({ ordersData, defVal, title, width }) => {
    const { dateRanges } = useStateContext();
    const [editClicked, setEditClicked] = useState(false);
    const [salesProductsData, setProductsData] = useState([]);
    const [ready, setReady] = useState(false);
    const [dates, setDates] = useState(null);
    const editing = { allowDeleting: true, allowEditing: true };

    if (dates == null) {
        const weekDateStart = new Date(dateRanges[1].startDate.replace('%20', ' '));
        const weekDateEnd = new Date(dateRanges[1].endDate.replace('%20', ' '));

        setDates([weekDateStart, weekDateEnd]);
    }

    async function dataGetter(date) {
        const data = await getSalesProductsFront(date);

        const orders = Object.entries(data.itemName).map(([name, details], index) => {
            return {
                Count: details.count,
                Price: details.price + ' ₸',
                TotalAmount: Math.round(details.totalSum) + ' ₸',
                OrderItems: name,
                Status: 'Продано',
                StatusBg: '#8BE78B',
            };
        });
        setProductsData(orders);
        setReady(true);
    }

    const handleDateChange = (e) => {
        if (e[1]) {
            setReady(false);
            const date = formatDates(e);
            dataGetter(date);
        }
    };

    useEffect(() => {
        if (!defVal) {
            const orders = Object.entries(ordersData).map(([name, details], index) => {
                return {
                    Count: details.count,
                    Price: details.price + ' ₸',
                    TotalAmount: Math.round(details.totalSum) + ' ₸',
                    OrderItems: name,
                    Status: 'Продано',
                    StatusBg: '#8BE78B',
                };
            });
            setProductsData(orders);
        }
        setReady(true);
    }, []);

    if (!ready) {
        return <LoadingSkeleton />;
    }
    return (
        <div
            className={`md:p-5 bg-white w-${width} dark:text-black dark:bg-secondary-dark-bg  rounded-3xl subtle-border`}
        >
            <div className="flex flex-row align-center mt-4  justify-between h-12 mx-5">
                <Header title={title} />
                <div className="flex flex-row align-top  gap-2">
                    <div className=" text-2xl rounded-2xl">
                        <FaCalendarAlt />
                    </div>

                    <div className="mb-2 md:mb-6  z-10 bg-white">
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
            </div>
            <div className="flex w-full justify-end">
                {editClicked && <OrdersEditModal active={editClicked} setActive={setEditClicked} />}
            </div>
            <GridComponent
                id="gridcomp"
                dataSource={salesProductsData}
                allowPaging
                allowSorting
                allowExcelExport
                allowPdfExport
                contextMenuItems={contextMenuItems}
                editSettings={editing}
            >
                <ColumnsDirective>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    {ordersGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject
                    services={[
                        Resize,
                        Sort,
                        ContextMenu,
                        Filter,
                        Page,
                        ExcelExport,
                        Edit,
                        PdfExport,
                    ]}
                />
            </GridComponent>
        </div>
    );
};
export default Orders;
