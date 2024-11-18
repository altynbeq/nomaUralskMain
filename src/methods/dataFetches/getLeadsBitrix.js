import { leadsDataFormer } from '../dataFormers/bitrix/leadsDataFormer';
import { leadsMonthDataFormer } from '../dataFormers/bitrix/leadsMonthDataFormer';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchLeadsForRange = async ({ bitrixStartDate, bitrixEndDates }) => {
    const webhookUrl =
        'https://romantic-uralsk.bitrix24.kz/rest/164016/42x8fer22r9hfhwk/crm.lead.list.json';
    let allLeads = [];
    let start = 0;
    const batchSize = 50; // Number of items to fetch per request
    let hasMoreLeads = true;

    try {
        while (hasMoreLeads) {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: {
                        '>=DATE_CREATE': bitrixStartDate,
                        '<=DATE_CREATE': bitrixEndDates,
                        '!STATUS_ID': 'JUNK',
                    },
                    // select: [
                    //   'ASSIGNED_BY_ID', 'CREATED_BY_ID', 'HAS_EMAIL', 'ID', 'IS_MANUAL_OPPORTUNITY', 'IS_RETURN_CUSTOMER',
                    //   'LAST_ACTIVITY_BY', 'LAST_ACTIVITY_TIME', 'NAME', 'OPENED', 'SOURCE_ID', 'STATUS_ID', 'TITLE'
                    // ],
                    start: start,
                    order: { ID: 'ASC' }, // Ensure consistent ordering for pagination
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                hasMoreLeads = false;
                console.error('Error fetching leads:', data.error);
                break;
            } else {
                allLeads = allLeads.concat(data.result);

                if (data.result.length < batchSize) {
                    hasMoreLeads = false;
                    break; // If the number of results is less than the batch size, we've fetched all leads
                }

                // Delay the next request
                await delay(100); // Add a 1 second delay between each request
                start += batchSize;
            }
        }
        return allLeads;
    } catch (error) {
        console.error('Error fetching leads:', error);
        return []; // Return an empty array in case of error
    }
};

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function convertMonthToBitrixDates(monthName, year) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const monthIndex = months.indexOf(monthName);

    if (monthIndex === -1) {
        throw new Error('Invalid month name');
    }

    const startDate = new Date(year, monthIndex, 1); // First day of the month
    const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month

    // Convert start and end dates to the desired format
    const bitrixStartDate = formatDate(startDate) + ' 00:00';
    const bitrixEndDate = formatDate(endDate) + ' 23:59';

    return {
        bitrixStartDate,
        bitrixEndDate,
    };
}

export async function fetchLeads(dateRanges, dateSaved) {
    // Convert dateSaved string to a Date object
    // const savedDate = new Date(dateSaved);

    // if (dateRanges[0] && typeof dateRanges != 'string') {
    //   // Fetch the data for each period separately
    //   const [dayLeads, weekLeads, monthLeads] = await Promise.all([
    //     fetchLeadsForRange(dateRanges[0]),
    //     fetchLeadsForRange(dateRanges[1]),
    //     fetchLeadsForRange(dateRanges[2])
    //   ]);

    //   // Process the data for statistics
    //   const dayStats = leadsDataFormer(dayLeads);
    //   const weekStats = leadsDataFormer(weekLeads);
    //   const monthStats = leadsMonthDataFormer(monthLeads);

    //   return {
    //     leadsDay: dayStats,
    //     leadsWeek: weekStats,
    //     leadsMonth: monthStats
    //   };
    // } else {
    const dateProp = !dateRanges.bitrixStartDate
        ? convertMonthToBitrixDates(dateRanges, 2024)
        : dateRanges;

    const leadsData = await fetchLeadsForRange(dateProp);
    const formedData = leadsMonthDataFormer(leadsData);
    // console.log("LeadsFormedData", formedData);
    return formedData;
    // }
}
