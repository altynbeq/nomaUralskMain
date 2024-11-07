
export const kkmReceiptsDataFormer = (receipts) => {
    const storeStats = {};
    const processedSales = new Set(); // To track unique combinations of Дата and СуммаДокумента

    receipts.forEach(receipt => {
        const storeName = receipt.КассирНаименование.split(' ')[1]; 
        const kkmName = receipt.КассаККМНаименование.replace(/ОФД Фискальный регистратор |\(Склад.*\)/g, '').trim(); // Simplify KKM name

        if (!storeStats[storeName]) {
            storeStats[storeName] = {
                totalSum: 0,
                totalNumberSales: 0,  // Keep track of the total number of unique sales
                bestSoldItemAmount: { name: '', amount: 0, totalSum: 0 },
                bestSoldItemSum: { name: '', amount: 0, totalSum: 0 },
                leastSoldItemAmount: { name: '', amount: Infinity, totalSum: 0 },
                leastSoldItemSum: { name: '', amount: 0, totalSum: Infinity },
                kassaName: receipt.КассаККМНаименование,
                itemsSold: {},
                kkmStats: {}, // Initialize KKM stats
                salesSeries: Array.from({ length: 31 }, (_, i) => ({ x: (i + 1).toString(), y: 0 })), // For counting sales number
                salesSumSeries: Array.from({ length: 31 }, (_, i) => ({ x: (i + 1).toString(), y: 0 })) // For sales amount
            };
        }

        const store = storeStats[storeName];
        const itemName = receipt.НоменклатураНаименование;
        const itemQuantity = receipt.Количество;
        const itemSum = receipt.Сумма;
        const totalDocumentAmount = receipt.СуммаДокумента;
        const receiptDate = new Date(receipt.Дата).toISOString().split('T')[0]; // Standardize the date format
        const saleKey = `${receiptDate}_${totalDocumentAmount}`; // Combine Дата and СуммаДокумента as a unique key

        // **Sum all items in each receipt for store.totalSum**
        store.totalSum += itemSum; // Add itemSum to the store totalSum

        // Track items sold
        if (!store.itemsSold[itemName]) {
            store.itemsSold[itemName] = { name: itemName, amount: 0, totalSum: 0 };
        }

        store.itemsSold[itemName].amount += itemQuantity;
        store.itemsSold[itemName].totalSum += itemSum;

        // Update sales series (sales count and sales sum series)
        const day = new Date(receipt.Дата).getDate(); // Extract the day from the receipt's date
        store.salesSeries[day - 1].y += itemQuantity;
        store.salesSumSeries[day - 1].y += itemSum;

        // Update best sold item by amount
        if (store.itemsSold[itemName].amount > store.bestSoldItemAmount.amount) {
            store.bestSoldItemAmount = { 
                name: itemName, 
                amount: store.itemsSold[itemName].amount, 
                totalSum: store.itemsSold[itemName].totalSum 
            };
        }

        // Update best sold item by total sum
        if (store.itemsSold[itemName].totalSum > store.bestSoldItemSum.totalSum) {
            store.bestSoldItemSum = { 
                name: itemName, 
                amount: store.itemsSold[itemName].amount, 
                totalSum: store.itemsSold[itemName].totalSum 
            };
        }

        // Update least sold item by amount
        if (store.itemsSold[itemName].amount < store.leastSoldItemAmount.amount) {
            store.leastSoldItemAmount = { 
                name: itemName, 
                amount: store.itemsSold[itemName].amount, 
                totalSum: store.itemsSold[itemName].totalSum 
            };
        }

        // Update least sold item by total sum
        if (store.itemsSold[itemName].totalSum < store.leastSoldItemSum.totalSum) {
            store.leastSoldItemSum = { 
                name: itemName, 
                amount: store.itemsSold[itemName].amount, 
                totalSum: store.itemsSold[itemName].totalSum 
            };
        }

        // **Only consider unique sales based on the combination of Дата and СуммаДокумента**
        if (!processedSales.has(saleKey)) {
            // This is a unique sale
            store.totalNumberSales++; // Increment sale count
            processedSales.add(saleKey); // Mark this sale as processed by adding to the set
        }

        // Update KKM stats
        if (!store.kkmStats[kkmName]) {
            store.kkmStats[kkmName] = { count: 0, totalSum: 0 };
        }

        // Add the current receipt's sum to the KKM stats for this store
        store.kkmStats[kkmName].count += itemQuantity; // Using itemQuantity for count
        store.kkmStats[kkmName].totalSum += itemSum; // Sum of the "Сумма" for this transaction
    });

    Object.keys(storeStats).forEach(key => {
        const item = storeStats[key];
    
        const filteredStoreData = receipts.filter(receipt => 
            receipt['КассаККМНаименование'] === item.kassaName
        );
    
        const uniqueData = filteredStoreData.filter((receipt, index, self) =>
            self.findIndex(otherReceipt => 
                otherReceipt.Дата === receipt.Дата && 
                otherReceipt.СуммаДокумента === receipt.СуммаДокумента
            ) === index
        );
    
        item.totalNumberSales = uniqueData.length;
    });

    
    return storeStats;
};


