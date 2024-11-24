export const calculateSpisanieStats = (data) => {
    const spisanieStats = {};

    // Initialize seriesCount and seriesSum for each day of the month (1-31)
    const seriesCountTemplate = Array.from({ length: 31 }, (_, index) => ({
        x: `${index + 1}`,
        y: 0,
    }));
    const seriesSumTemplate = Array.from({ length: 31 }, (_, index) => ({
        x: `${index + 1}`,
        y: 0,
    }));

    data.forEach((item) => {
        const skladName = item.СкладПредставление;
        const quantity = item.Количество;

        // Extract price from the last part of НоменклатураНаименование
        const itemName = item.НоменклатураНаименование;
        const itemParts = itemName.split(' ');
        let price = 0;

        // Iterate through the parts in reverse and find the last number before a non-numeric code
        for (let i = itemParts.length - 1; i >= 0; i--) {
            const parsed = parseFloat(itemParts[i]);
            // Check if it's a valid price and ignore numeric codes or zeros
            if (
                !isNaN(parsed) &&
                parsed > 0 &&
                !itemParts[i].includes('-') &&
                itemParts[i].length <= 8
            ) {
                price = parsed;
                break;
            }
        }

        // Extract day from the Дата field
        const date = new Date(item.Дата);
        const day = date.getDate();

        // Ensure each `skladName` has its own independent stats initialized
        if (!spisanieStats[skladName]) {
            spisanieStats[skladName] = {
                numberOfSpisanie: 0,
                spisanieSum: 0,
                spisanieItems: [],
                seriesCount: seriesCountTemplate.map((item) => ({ ...item })), // clone template
                seriesSum: seriesSumTemplate.map((item) => ({ ...item })), // clone template
            };
        }

        // Increment spisanie count and sum for the specific store
        spisanieStats[skladName].numberOfSpisanie += 1;
        spisanieStats[skladName].spisanieSum += quantity * price;

        // Add the current item to the spisanieItems array for this store
        spisanieStats[skladName].spisanieItems.push(item);

        // Ensure the day is valid and increment the series count and sum for the store
        if (day >= 1 && day <= 31) {
            spisanieStats[skladName].seriesCount[day - 1].y += quantity;
            spisanieStats[skladName].seriesSum[day - 1].y += quantity * price;
        } else {
            console.error(`Invalid date found: ${item.Дата}`);
        }
    });
    return spisanieStats;
};
