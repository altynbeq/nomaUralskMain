import React from 'react';

import { Stacked } from '../../components';
import {
    stackedCustomSeries,
    stackedPrimaryXAxis,
    stackedPrimaryYAxis,
} from '../../data/salesData';

const WeaklyTotalSalesChart = ({ leads, sales1C }) => {
    const list = leads.series ? leads.series : sales1C.series;

    const maxSeriesVal = list.reduce((acc, item) => {
        return Math.max(acc, item.y);
    }, 0);

    const minSeriesVal = list.reduce((acc, item) => {
        if (item.y !== 0 || acc === Infinity) {
            return Math.min(acc, item.y);
        }
        return acc;
    }, Infinity);

    const finalMinSeriesVal = minSeriesVal === Infinity ? 0 : minSeriesVal;

    const range = maxSeriesVal - finalMinSeriesVal;

    let interval;
    if (range <= 10) {
        interval = 1;
    } else if (range <= 100) {
        interval = 10;
    } else if (range <= 1000) {
        interval = 100;
    } else if (range <= 10000) {
        interval = 1000;
    } else if (range <= 100000) {
        interval = 10000;
    } else if (range <= 1000000) {
        interval = 100000;
    } else {
        interval = 1000000;
    }

    let stackedCustomSeries = [
        {
            dataSource: list,
            xName: 'x',
            yName: 'y',
            name: 'Продажи',
            type: 'StackingColumn',
            background: 'blue',
        },
    ];

    let stackedPrimaryYAxis = {
        lineStyle: { width: 0 },
        minimum: finalMinSeriesVal / 2,
        maximum: maxSeriesVal > 0 ? maxSeriesVal * 1.5 : 10,
        interval: interval,
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: '{value}',
    };

    let stackedPrimaryXAxis = {
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        interval: 1,
        lineStyle: { width: 0 },
        labelIntersectAction: 'Rotate45',
        valueType: 'Category',
    };

    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 md:w-[43%] w-[90%] rounded-2xl subtle-border">
            <div className="flex justify-between items-center gap-2 mb-10">
                <p className="md:text-xl font-semibold">Продажи за неделю</p>
                <div className="flex items-center gap-4">
                    <p className="flex md:text-xl items-center gap-2 text-green-400 hover:drop-shadow-xl">
                        <span></span>
                        <span>13-19 Мая 2024</span>
                    </p>
                </div>
            </div>

            <Stacked
                stackedCustomSeries={stackedCustomSeries}
                stackedPrimaryXAxis={stackedPrimaryXAxis}
                stackedPrimaryYAxis={stackedPrimaryYAxis}
            />
        </div>
    );
};

export default WeaklyTotalSalesChart;
