exports.handler = async function (event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    try {
        // Ensure event.body is not empty and parse JSON
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No request body provided' }),
            };
        }

        const { date } = JSON.parse(event.body);

        const webhookUrl =
            'https://zhezkazgan-romantic.bitrix24.kz/rest/20509/hp29cpcrgqrsfh2f/crm.lead.list.json';
        let allLeads = [];
        let start = 0;
        const batchSize = 50; // Number of items to fetch per request

        while (true) {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: {
                        '>=DATE_CREATE': date.bitrixStartDate,
                        '<=DATE_CREATE': date.bitrixEndDates,
                    },
                    start: start,
                    order: { ID: 'ASC' }, // Ensure consistent ordering for pagination
                }),
            });

            if (!response.ok) {
                return {
                    statusCode: response.status,
                    body: JSON.stringify({ error: `HTTP error! Status: ${response.status}` }),
                };
            }

            const data = await response.json();

            if (data.error) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: `Error fetching leads: ${data.error}` }),
                };
            } else {
                allLeads = allLeads.concat(data.result);
                if (data.result.length < batchSize) {
                    break;
                }
                start += batchSize;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ leads: allLeads }),
        };
    } catch (error) {
        console.error('Function error:', error); // Log error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error fetching leads: ${error.message}` }),
        };
    }
};
