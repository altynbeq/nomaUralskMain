export const monthDealsDataFormer = (list) => {
    let dealsStats = {
        leadsCount: list.length,
        totalSum: 0,
        avgCheck: 0,
        maxAmount: 0,
        minAmount: Number.MAX_SAFE_INTEGER,
        maxAmountSeries: 0,
        minAmountSeries: 0,
        minSalesSeries: 0,
        maxSalesSeries: 0,
        bestDay: {},
        bestSale: {},
        bestAvgCheck: {},
        bestWorker: {},
        workersStats: {},
        workersMainStats: {},
        dealsSource: {},
        salesSeries: Array.from({ length: 31 }, (_, index) => ({ x: `${index + 1}`, y: 0 })),
        series: Array.from({ length: 31 }, (_, index) => ({ x: `${index + 1}`, y: 0 })),
    };
    const workersStats = {};
    const workersSales = {};
    const workersMainStats = {};
    const today = new Date();

    list.forEach((lead) => {
        // Calculate totalSum
        const opportunity = parseFloat(lead.OPPORTUNITY);
        if (opportunity > 0) {
            dealsStats.totalSum += opportunity;
        }

        // Date when lead was closed
        const closeDate = new Date(lead.CLOSEDATE);
        // Get day of the month
        const dayOfMonth = closeDate.getDate();

        // Only process dates up to today
        if (closeDate <= today) {
            const dayIndex = dayOfMonth - 1; // Adjust day index
            if (dayIndex >= 0 && dayIndex < 31) {
                dealsStats.series[dayIndex].y += opportunity;
                dealsStats.salesSeries[dayIndex].y++;
            }
        }

        if (lead.CLOSED === 'Y' && opportunity !== 0) {
            const workerId = lead.LAST_ACTIVITY_BY;
            if (!workersMainStats[workerId]) {
                workersMainStats[workerId] = {
                    salesCount: 0,
                    totalSales: 0,
                    conversion: '', // Placeholder for conversion
                };
            }
            if (opportunity > dealsStats.maxAmount) {
                dealsStats.maxAmount = opportunity;
            }
            if (dealsStats.minAmount === 0 || opportunity < dealsStats.minAmount) {
                dealsStats.minAmount = opportunity;
            }
            // Check for the best deal
            if (opportunity === dealsStats.maxAmount) {
                dealsStats.bestSale = lead; // Push the best deal into the bestSale array
            } else if (!dealsStats.bestSale) {
                dealsStats.bestSale = lead; // If bestSale is empty, push the first deal
            }

            if (workersStats[workerId]) {
                workersStats[workerId]++;
                workersSales[workerId] += opportunity;
            } else {
                workersStats[workerId] = 1;
                workersSales[workerId] = opportunity;
            }

            workersMainStats[workerId].salesCount++;
            workersMainStats[workerId].totalSales += opportunity;
        }
    });
    // count dealsSource
    const dealsBySource = (list) => {
        return list.reduce((acc, deal) => {
            const source = deal.SOURCE_ID;
            if (source) {
                acc[source] = (acc[source] || 0) + 1;
            }
            return acc;
        }, {});
    };

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

    let bestId = null;
    let maxSales = 0;

    for (let workerId in workersStats) {
        if (workersStats[workerId] > maxSales) {
            maxSales = workersStats[workerId];
            bestId = workerId;
        }
    }

    dealsStats.bestWorker = {
        id: bestId,
        sales: maxSales,
        totalSales: workersSales[bestId] || 0, // Get the total sales for the best worker
    };

    let bestDay = {};
    let maxDaySales = 0;
    dealsStats.series.forEach((day) => {
        if (day.y > maxDaySales) {
            maxDaySales = day.y;
            bestDay = day;
        }
    });

    let highestAvgCheckWorker = {};
    let highestAvgCheck = 0;

    for (const workerId in workersMainStats) {
        const worker = workersMainStats[workerId];
        if (worker.salesCount > 0) {
            const avgCheck = worker.totalSales / worker.salesCount;

            if (avgCheck > highestAvgCheck) {
                highestAvgCheck = avgCheck;
                highestAvgCheckWorker = {
                    id: workerId,
                    avgCheck: Math.round(avgCheck),
                    salesCount: worker.salesCount,
                    totalSales: worker.totalSales,
                };
            }
        }
    }

    // Calculate min and max sales from salesSeries
    let minSalesInSeries = Number.MAX_SAFE_INTEGER;
    let maxSalesInSeries = 0;

    dealsStats.salesSeries.forEach((day) => {
        if (day.y > maxSalesInSeries) {
            maxSalesInSeries = day.y;
        }
        if (day.y < minSalesInSeries && day.y > 0) {
            minSalesInSeries = day.y;
        }
    });

    dealsStats.bestDay = bestDay;
    dealsStats.workersStats = workersStats;
    dealsStats.maxAmountSeries = maxAmountInSeries;
    dealsStats.bestAvgCheck = highestAvgCheckWorker;
    dealsStats.workersMainStats = workersMainStats;
    dealsStats.minAmountSeries = minAmountInSeries > 0 ? Math.round(minAmountInSeries / 2) : 0;
    dealsStats.avgCheck =
        dealsStats.leadsCount > 0 ? Math.round(dealsStats.totalSum / dealsStats.leadsCount) : 0;
    dealsStats.maxSalesSeries = maxSalesInSeries;
    dealsStats.minSalesSeries = minSalesInSeries;
    dealsStats.dealsSource = dealsBySource(list);

    return dealsStats;
};
