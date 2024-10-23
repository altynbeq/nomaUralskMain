import { kkmReceiptsDataFormer } from "../dataFormers/kkmDataFormer";

// Auth info
const username = 'Алтынбек';
const password  = '5521';

// Encode credentials to Base64 using TextEncoder
const encoder = new TextEncoder();
const credentials  = `${username}:${password}`;
const utf8Credentials = encoder.encode(credentials);

// Function to convert ArrayBuffer to Base64
function base64ArrayBuffer(arrayBuffer){
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const encodedCredentials = base64ArrayBuffer(utf8Credentials);

async function fetchDataForRange(api,startDate, endDate){
    const decodedStartDate = decodeURIComponent(startDate).split(' ')[0].replace(/-/g, '');
    const decodedEndDate = decodeURIComponent(endDate).split(' ')[0].replace(/-/g, '');

    const url = `${api}${decodedStartDate}/${decodedEndDate}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`
        }
    })

    if (!response && !response.ok) {
        console.error('Error fetching KKM list');
        throw new Error('Network response was not ok');
    }
    let res = await response;
    console.log("=>(getKKM.js:44) res", res);

    return await response.json();
}

export async function getKKMReceiptsFront(api, dateRanges) {
    //if dateRanges has more than one date
    const data = await fetchDataForRange(api, dateRanges.startDate, dateRanges.endDate);
    const formedKKMData = kkmReceiptsDataFormer(data);
    if(formedKKMData) {
        return formedKKMData;
    }
    // if (Array.isArray(dateRanges)) {
    //     const [dayRange, weekRange, monthRange] = dateRanges;

    //     const [dayData, weekData, monthData] = await Promise.all([
    //         fetchDataForRange(dayRange.startDate, dayRange.endDate),
    //         fetchDataForRange(weekRange.startDate, weekRange.endDate),
    //         fetchDataForRange(monthRange.startDate, monthRange.endDate),
    //     ]);
    //     const final = {
    //         monthFormedKKM: kkmReceiptsDataFormer(monthData),
    //         weekFormedKKM: kkmReceiptsDataFormer(weekData),
    //         dayFormedKKM: kkmReceiptsDataFormer(dayData)
    //     };
    //     return final; 
    // } else {
    //     // if request for one time period
    //     const data = await fetchDataForRange(dateRanges.startDate, dateRanges.endDate);

    //     const formedKKMData = kkmReceiptsDataFormer(data);
    //     return formedKKMData;
    // }
}
