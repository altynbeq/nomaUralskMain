import { sales1CDataFormer } from '../dataFormers/salesReceiptsDataFormer';
import { sales1CMonthFormer } from '../dataFormers/salesReceiptsMonthFormer';

const username = 'Алтынбек';
const password = '5521';

// Encode credentials to Base64
function encodeBase64(string) {
    return btoa(unescape(encodeURIComponent(string)));
}

const credentials = `${username}:${password}`;
const encodedCredentials = encodeBase64(credentials);

async function fetchDataForRange(api, startDate, endDate) {
    // Decode URL-encoded dates
    const decodedStartDate = decodeURIComponent(startDate).split(' ')[0].replace(/-/g, '');
    const decodedEndDate = decodeURIComponent(endDate).split(' ')[0].replace(/-/g, '');

    const url = `${api}${decodedStartDate}/${decodedEndDate}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedCredentials}`,
        },
    });

    if (!response.ok) {
        console.error('Error fetching sales receipts');
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export async function getSalesReceiptsFront(api, dateRanges) {
    const data = await fetchDataForRange(api, dateRanges.startDate, dateRanges.endDate);
    const shiftDate = (data) => {
        return data.map((item) => {
            // Extract date and time parts from ISO string (YYYY-MM-DDTHH:MM:SS)
            let [datePart, timePart] = item.Дата.split('T');
            let [year, month, day] = datePart.split('-').map(Number);
            let [hours, minutes, seconds] = timePart.slice(0, -1).split(':').map(Number);

            // Check if the time is between 00:00 and 02:00 UTC
            if (hours >= 0 && hours < 2) {
                // Subtract 2 hours
                hours -= 2;

                // If hours go negative, adjust the date
                if (hours < 0) {
                    hours += 24; // Wrap around the hours
                    day -= 1; // Move to the previous day

                    // Handle day and month boundaries
                    if (day < 1) {
                        month -= 1; // Move to the previous month

                        if (month < 1) {
                            month = 12; // Wrap to December
                            year -= 1; // Move to the previous year
                        }

                        // Get the correct number of days in the new month
                        const daysInMonth = new Date(year, month, 0).getDate();
                        day = daysInMonth; // Set to the last day of the month
                    }
                }

                // Format adjusted date parts back to strings
                const pad = (num) => String(num).padStart(2, '0');
                const newDatePart = `${year}-${pad(month)}-${pad(day)}`;
                const newTimePart = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

                // Update item.Дата with the adjusted date in ISO format
                // console.log("Before update item:", item.Дата, item);
                item.Дата = `${newDatePart}T${newTimePart}`;
                // console.log("Updated item:", item.Дата, item);
            }

            return item;
        });
    };

    const formedData = sales1CMonthFormer(shiftDate(data));
    return formedData;
}
