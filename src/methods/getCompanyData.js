export async function getCompanyData(companyId) {
    const url = 'https://nomalytica-back.onrender.com/api/users/';

    try {
        const response = await fetch(url + companyId);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
