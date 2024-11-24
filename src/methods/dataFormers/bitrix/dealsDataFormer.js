export const dealsDataFormer = (list) => {
    let dealsStats = {
        leadsCount: list.length,
        totalSum: 0,
        avgCheck: 0,
        maxAmount: 0,
        minAmount: 0,
        maxAmountSeries: 0,
        minAmountSeries: 0,
        minSalesSeries: 0,
        maxSalesSeries: 0,
        bestSale: {},
        bestWorker: {},
        workersStats: {},
        bestDay: {},
        avgCheckSeries: [
            { x: 1, yval: 0 },
            { x: 2, yval: 0 },
            { x: 3, yval: 0 },
            { x: 4, yval: 0 },
            { x: 5, yval: 0 },
            { x: 6, yval: 0 },
            { x: 7, yval: 0 },
        ],
        salesSeries: [
            { x: 'Thursday', y: 0 },
            { x: 'Friday', y: 0 },
            { x: 'Saturday', y: 0 },
            { x: 'Sunday', y: 0 },
            { x: 'Monday', y: 0 },
            { x: 'Tuesday', y: 0 },
            { x: 'Wednesday', y: 0 },
        ],
        series: [
            { x: 'Thursday', y: 0 },
            { x: 'Friday', y: 0 },
            { x: 'Saturday', y: 0 },
            { x: 'Sunday', y: 0 },
            { x: 'Monday', y: 0 },
            { x: 'Tuesday', y: 0 },
            { x: 'Wednesday', y: 0 },
        ],
    };
    const workersStats = {};
    const dailySalesCount = {
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
    };

    list.forEach((lead) => {
        // Calculate totalSum
        const opportunity = parseFloat(lead.OPPORTUNITY);
        dealsStats.totalSum += opportunity;

        // Date when lead was closed
        const closeDate = new Date(lead.CLOSEDATE);
        // Get day of the week as string
        const dayOfWeek = closeDate.toLocaleDateString('en-US', { weekday: 'long' });

        const dayIndex = dealsStats.series.findIndex((item) => item.x === dayOfWeek);
        if (dayIndex !== -1) {
            dealsStats.series[dayIndex].y += opportunity;
            dailySalesCount[dayOfWeek] += 1;
        }

        if (lead.CLOSED === 'Y' && lead.STAGE_ID === 'WON' && opportunity !== 0) {
            if (opportunity > dealsStats.maxAmount) {
                dealsStats.maxAmount = opportunity;
                dealsStats.bestSale = lead; // Update the best sale
            }
            if (dealsStats.minAmount === 0 || opportunity < dealsStats.minAmount) {
                dealsStats.minAmount = opportunity;
            }

            const workerId = lead.LAST_ACTIVITY_BY;
            if (workersStats[workerId]) {
                workersStats[workerId].sales += opportunity;
                workersStats[workerId].count += 1;
            } else {
                workersStats[workerId] = { sales: opportunity, count: 1 };
            }
        }
    });

    let bestWorkerId = null;
    let maxWorkerSales = 0;
    let bestWorkerSalesCount = 0;
    for (let workerId in workersStats) {
        if (workersStats[workerId].sales > maxWorkerSales) {
            maxWorkerSales = workersStats[workerId].sales;
            bestWorkerId = workerId;
            bestWorkerSalesCount = workersStats[workerId].count;
        }
    }

    // Calculate min and max amount from series
    let minAmountInSeries = 0;
    let maxAmountInSeries = 0;

    dealsStats.series.forEach((day) => {
        if (day.y > maxAmountInSeries) {
            maxAmountInSeries = day.y;
        }
        if (day.y < minAmountInSeries && day.y > 0) {
            // Consider only positive amounts
            minAmountInSeries = day.y;
        }
    });

    let bestDay = {};
    let maxDaySales = 0;
    dealsStats.series.forEach((day) => {
        if (day.y > maxDaySales) {
            maxDaySales = day.y;
            bestDay = day;
        }
    });

    // Calculate min and max sales from dailySalesCount
    let minSalesInSeries = 0;
    let maxSalesInSeries = 0;

    for (let day in dailySalesCount) {
        if (dailySalesCount[day] > maxSalesInSeries) {
            maxSalesInSeries = dailySalesCount[day];
        }
        if (dailySalesCount[day] < minSalesInSeries && dailySalesCount[day] > 0) {
            minSalesInSeries = dailySalesCount[day];
        }
    }

    dealsStats.bestWorker = {
        id: bestWorkerId,
        salesCount: bestWorkerSalesCount,
        totalSales: maxWorkerSales,
    };
    dealsStats.workersStats = workersStats;
    dealsStats.bestDay = bestDay;
    dealsStats.maxAmountSeries = maxAmountInSeries;
    dealsStats.minAmountSeries = minAmountInSeries;
    dealsStats.maxSalesSeries = maxSalesInSeries;
    dealsStats.minSalesSeries = minSalesInSeries;
    dealsStats.avgCheck =
        dealsStats.leadsCount > 0 ? Math.round(dealsStats.totalSum / dealsStats.leadsCount) : 0;

    // dealsStats.series.forEach(day => {
    //     const dayIndex = dealsStats.avgCheckSeries.findIndex(item => item.x === day.x);
    //     if (dayIndex !== -1 && dailySalesCount[day.x] > 0) {
    //         dealsStats.avgCheckSeries[dayIndex].yval = Math.round(day.y / dailySalesCount[day.x]);
    //     }
    // });

    // Update salesSeries
    dealsStats.salesSeries = dealsStats.salesSeries.map((day) => ({
        x: day.x,
        y: dailySalesCount[day.x],
    }));

    dealsStats.avgCheckSeries.forEach((day) => {
        const dayOfWeekIndex = day.x - 1; // Convert x to array index (0 for Monday, 1 for Tuesday, etc.)
        const totalSumForDay = dealsStats.series[dayOfWeekIndex].y; // Get total sum of money for the day
        const totalSalesForDay = dealsStats.salesSeries[dayOfWeekIndex].y; // Get total number of sales for the day

        if (totalSalesForDay > 0) {
            day.yval = Math.round(totalSumForDay / totalSalesForDay); // Calculate average check for the day
        } else {
            day.yval = 0; // If no sales, average check is 0
        }
    });
    return dealsStats;
};
