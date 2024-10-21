import { sales1CDataFormer } from "../dataFormers/salesReceiptsDataFormer";
import { sales1CMonthFormer } from '../dataFormers/salesReceiptsMonthFormer'

const username = 'Алтынбек';
const password = '5521';

// Encode credentials to Base64
function encodeBase64(string) {
    return btoa(unescape(encodeURIComponent(string)));
}

const credentials = `${username}:${password}`;
const encodedCredentials = encodeBase64(credentials);

 
async function fetchDataForRange(api, startDate, endDate){
    // Decode URL-encoded dates
    const decodedStartDate = decodeURIComponent(startDate).split(' ')[0].replace(/-/g, '');
    const decodedEndDate = decodeURIComponent(endDate).split(' ')[0].replace(/-/g, '');

    const url = `${api}${decodedStartDate}/${decodedEndDate}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`
        }
    });

    if (!response.ok) {
        console.error('Error fetching sales receipts');
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export async function getSalesReceiptsFront(api, dateRanges) {
        const data = await fetchDataForRange(api, dateRanges.startDate, dateRanges.endDate);
        const formedData = sales1CMonthFormer(data);
        return formedData;
}
