export const sales1CMonthFormer = (data) => {
    const stats = {};

    data.forEach((item) => {
        // const cashRegisterFullName = item["КассаККМНаименование"];
        let cashRegisterFullName = item['КассирНаименование'];
        // const cashRegister = cashRegisterFullName.replace(/.*Склад\s*([^\s)]+).*/, '$1'); // Extract the store name
        let cashRegister;
        if (!cashRegisterFullName) {
            cashRegisterFullName = item['КассаККМНаименование'];
            cashRegister = cashRegisterFullName.replace(/.*Склад\s*([^\s)]+).*/, '$1');
        } else {
            cashRegister = cashRegisterFullName.replace(/(\s|\d|Касса)/g, ''); // Extract the store name
        }
        if (cashRegister === 'Сатпаева') {
            cashRegister = 'Сатпаев';
        }

        // console.log("=>(salesReceiptsMonthFormer.js:7) cashRegister", cashRegister);

        const terminalName = item['ЭквайринговыйТерминалНаименование'] || 'Неопределено';
        const terminalPayment = parseFloat(item['Сумма']); // The actual payment to the terminal
        const totalDocumentAmount = parseFloat(item['СуммаДокумента']); // Total document sum
        const saleDate = new Date(item['Дата']);
        const dayOfMonth = saleDate.getDate() - 1; // 0-indexed day of the month
        const saleDayKey = saleDate.toISOString().split('T')[0]; // YYYY-MM-DD format to track unique days

        // Initialize the store (based on cash register) if it doesn't exist yet
        if (!stats[cashRegister]) {
            stats[cashRegister] = {
                paidTo: {}, // Payment per terminal
                totalSum: 0, // The total sum across all days for the store
                totalNumberSales: 0,
                uniqueDaysTracked: {}, // Track unique days for the store
                КассаККМНаименование: cashRegister,
                salesSeries: Array.from({ length: 31 }, (_, i) => ({
                    x: (i + 1).toString(),
                    y: 0,
                })), // Number of sales per day
                salesSumSeries: Array.from({ length: 31 }, (_, i) => ({
                    x: (i + 1).toString(),
                    y: 0,
                })), // Sum of sales per day
            };
        }

        const storeStats = stats[cashRegister];

        // Initialize the terminal if it doesn't exist in paidTo
        if (!storeStats.paidTo[terminalName]) {
            storeStats.paidTo[terminalName] = 0;
        }

        // Add the payment to the terminal
        storeStats.paidTo[terminalName] += terminalPayment;

        // Only add the totalDocumentAmount once per unique day
        if (!storeStats.uniqueDaysTracked[saleDayKey]) {
            storeStats.totalSum += totalDocumentAmount; // Accumulate the sum for the store
            storeStats.salesSumSeries[dayOfMonth].y += totalDocumentAmount; // Sum of sales for the specific day

            // Mark this day as processed for this store
            storeStats.uniqueDaysTracked[saleDayKey] = true;
        }

        // Update store-wide number of sales
        storeStats.totalNumberSales++;

        // Update sales series for that day (number of sales)
        storeStats.salesSeries[dayOfMonth].y++;
    });

    // console.log("data", data)

    const storeStatsTotal = data.reduce((result, item) => {
        const storeName = item['КассаККМНаименование'];
        const receiptNumber = item['Номер'];

        // Initialize store entry if it doesn't exist
        if (!result[storeName]) {
            result[storeName] = {
                receiptsNumbers: [],
                receipts: [],
                totalSum: 0, // Initialize totalSum to 0
            };
        }

        const store = result[storeName];

        // Only add receipt if "Номер" is not already in receiptsNumbers
        if (!store.receiptsNumbers.includes(receiptNumber)) {
            store.receiptsNumbers.push(receiptNumber);
            store.receipts.push(item);
            store.totalSum += item['СуммаДокумента']; // Add СуммаДокумента to totalSum
        }

        return result;
    }, {});

    Object.keys(storeStatsTotal).forEach((fullStoreName) => {
        // Extract the simplified store name
        const simplifiedStoreName = fullStoreName.replace(/.*Склад\s*([^\s)]+).*/, '$1');

        // Check if this simplified store name exists in `stats`
        if (stats[simplifiedStoreName]) {
            // Update the totalSum in `stats` with the correct totalSum from `storeStatsTotal`
            stats[simplifiedStoreName].totalSum = 1;
        }
    });

    Object.keys(stats).forEach((storeName) => {
        // Filter transactions related to this store
        const storeTransactions = data.filter(
            (item) => item.КассаККМНаименование && item.КассаККМНаименование.includes(storeName),
        );

        // Get unique transactions by 'Номер' for this store
        const uniqueData = storeTransactions.filter(
            (item, index, self) => index === self.findIndex((t) => t.Номер === item.Номер),
        );

        // Calculate the total sum of 'СуммаДокумента' for the unique transactions
        let totalSum = 0;
        uniqueData.forEach((item) => {
            totalSum += item['СуммаДокумента'];
        });

        // Set the calculated total sum to the store's totalSum in the stores object
        stats[storeName].totalSum = totalSum;
    });

    // After all data is processed, calculate the cash for each store
    Object.keys(stats).forEach((store) => {
        const storeStats = stats[store];

        // Sum the total payments to terminals
        const totalPaidToSum = Object.values(storeStats.paidTo).reduce(
            (sum, amount) => sum + amount,
            0,
        );

        // Calculate cash as the difference between totalSum and terminal payments
        const cashDifference = storeStats.totalSum - Math.abs(totalPaidToSum);

        // Add the cash difference to paidTo under the key 'Наличные'
        storeStats.paidTo['Наличные'] = Math.abs(Math.round(cashDifference));
    });
    // stats.total = 0;
    // Object.keys(stats).forEach(store =>  stats.total += Math.round(store.totalSum));
    return stats;
};

// export const sales1CMonthFormer = (data) => {
//     const stats = {};

//     data.forEach(item => {
//         const cashRegisterFullName = item["КассаККМНаименование"];
//         const cashRegister = cashRegisterFullName.replace(/.*Склад\s*([^\s)]+).*/, '$1'); // Extract the part after "Склад"

//         const terminalNames = item["ЭквайринговыйТерминалНаименование"] || "Неопределено";
//         const terminals = terminalNames.split(",").map(term => term.trim()); // Split by commas and trim spaces

//         const totalDocumentAmount = parseFloat(item["СуммаДокумента"].toString());
//         const saleDate = new Date(item["Дата"]);
//         const dayOfMonth = saleDate.getDate() - 1; // 0-indexed day of the month

//         // Initialize store object if it doesn't exist
//         if (!stats[cashRegister]) {
//             stats[cashRegister] = {
//                 paidTo: {},
//                 totalSum: 0,
//                 totalNumberSales: 0,
//                 salesSeries: Array.from({ length: 31 }, (_, i) => ({ x: (i + 1).toString(), y: 0 })),
//                 salesSumSeries: Array.from({ length: 31 }, (_, i) => ({ x: (i + 1).toString(), y: 0 })),
//             };
//         }

//         const storeStats = stats[cashRegister];

//         // Calculate how much each terminal gets
//         const amountPerTerminal = totalDocumentAmount / terminals.length;

//         terminals.forEach(terminal => {
//             // Initialize terminal object if it doesn't exist
//             if (!storeStats.paidTo[terminal]) {
//                 storeStats.paidTo[terminal] = 0;
//             }

//             // Update totals for the terminal
//             storeStats.paidTo[terminal] += Math.round(amountPerTerminal);
//         });

//         // Update store-level totals
//         storeStats.totalSum += totalDocumentAmount;
//         storeStats.totalNumberSales++;

//         // Update sales series
//         storeStats.salesSeries[dayOfMonth].y++;
//         storeStats.salesSumSeries[dayOfMonth].y += totalDocumentAmount;
//     });

//     return stats;
// };
