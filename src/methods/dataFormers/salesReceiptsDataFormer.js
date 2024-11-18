// Function to process sales data and compute store statistics
export const sales1CDataFormer = (data) => {
    const processedDocuments = new Set();
    const stats = {};

    data.forEach((item) => {
        const documentNumber = item['Номер'];
        const cashRegister = item['КассаККМНаименование'];
        const terminal = item['ЭквайринговыйТерминалНаименование'] || 'Неопределено';
        const totalDocumentAmount = parseFloat(item['СуммаДокумента'].toString());
        const saleDate = new Date(item['Дата']);
        const saleHour = saleDate.getHours();

        // Adjust date for sales between midnight and 1 AM
        if (saleHour < 1) {
            saleDate.setDate(saleDate.getDate() - 1);
        }

        const dayOfWeek = (saleDate.getDay() + 3) % 7; // Custom week starting on Thursday

        // Initialize stats for this store if it doesn't exist
        if (!stats[cashRegister]) {
            stats[cashRegister] = {
                paidTo: {},
                totalSum: 0,
                KassaKKMName: {},
                salesSeries: Array.from({ length: 7 }, (_, i) => ({
                    x: [
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                    ][i],
                    y: 0,
                })),
                salesSumSeries: Array.from({ length: 7 }, (_, i) => ({
                    x: [
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                    ][i],
                    y: 0,
                })),
                totalNumberSales: 0,
            };
        }

        const uniqueDocKey = `${saleDate.toISOString().split('T')[0]}-${documentNumber}-${totalDocumentAmount}`;

        if (!stats[cashRegister].paidTo[terminal]) {
            stats[cashRegister].paidTo[terminal] = 0;
        }

        if (!processedDocuments.has(uniqueDocKey)) {
            processedDocuments.add(uniqueDocKey);

            // Update the total sum and sales series for the specific store
            stats[cashRegister].totalSum += totalDocumentAmount;
            stats[cashRegister].paidTo[terminal] += totalDocumentAmount;
            stats[cashRegister].totalNumberSales++; // Increment the total number of sales

            stats[cashRegister].salesSeries[dayOfWeek].y++;
            stats[cashRegister].salesSumSeries[dayOfWeek].y += totalDocumentAmount;
        }
    });

    return stats;
};
