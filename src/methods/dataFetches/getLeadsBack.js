export async function getLeadsBack(id) {
    const url = `https://nomalytica-back.onrender.com/api/users/${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
