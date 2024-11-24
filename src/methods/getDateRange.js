export function getDateRange(option) {
    const now = new Date();
    const year = now.getFullYear();
    const day = now.getDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)

    function formatDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}%20${hours}:${minutes}`;
    }

    function formatBitrixDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const startOfDay = formatDateString(new Date(year, now.getMonth(), now.getDate(), 0, 0));
    const endOfDay = formatDateString(new Date(year, now.getMonth(), now.getDate(), 23, 59));
    const bitrixStartOfDay = formatBitrixDateString(
        new Date(year, now.getMonth(), now.getDate(), 0, 0),
    );
    const bitrixEndOfDay = formatBitrixDateString(
        new Date(year, now.getMonth(), now.getDate(), 23, 59),
    );

    let startDate, endDate, bitrixStartDate, bitrixEndDate, dateType;

    if (option === 'today') {
        startDate = startOfDay;
        endDate = endOfDay;
        bitrixStartDate = bitrixStartOfDay;
        bitrixEndDate = bitrixEndOfDay;
        dateType = 'week';
    } else if (option === 'week') {
        const daysToThursday = (day + 3) % 7; // Calculate days to previous Thursday (day 4)
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - daysToThursday);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Add 6 days to get the following Wednesday

        startDate = formatDateString(
            new Date(
                firstDayOfWeek.getFullYear(),
                firstDayOfWeek.getMonth(),
                firstDayOfWeek.getDate(),
                0,
                0,
            ),
        );
        endDate = formatDateString(
            new Date(
                lastDayOfWeek.getFullYear(),
                lastDayOfWeek.getMonth(),
                lastDayOfWeek.getDate(),
                23,
                59,
            ),
        );
        bitrixStartDate = formatBitrixDateString(
            new Date(
                firstDayOfWeek.getFullYear(),
                firstDayOfWeek.getMonth(),
                firstDayOfWeek.getDate(),
                0,
                0,
            ),
        );
        bitrixEndDate = formatBitrixDateString(
            new Date(
                lastDayOfWeek.getFullYear(),
                lastDayOfWeek.getMonth(),
                lastDayOfWeek.getDate(),
                23,
                59,
            ),
        );
        dateType = 'week';
    } else if (option === 'month') {
        startDate = formatDateString(new Date(year, now.getMonth(), 1, 0, 0));
        endDate = endOfDay;
        bitrixStartDate = formatBitrixDateString(new Date(year, now.getMonth(), 1, 0, 0));
        bitrixEndDate = bitrixEndOfDay;
        dateType = 'month';
    } else if (option === 'year') {
        startDate = formatDateString(new Date(year, 0, 1, 0, 0));
        endDate = formatDateString(new Date(year, 11, 31, 23, 59));
        bitrixStartDate = formatBitrixDateString(new Date(year, 0, 1, 0, 0));
        bitrixEndDate = formatBitrixDateString(new Date(year, 11, 31, 23, 59));
        dateType = 'year';
    } else {
        throw new Error("Invalid option. Use 'today', 'week', 'month', or 'year'.");
    }

    return { startDate, endDate, dateType, bitrixStartDate, bitrixEndDate };
}
