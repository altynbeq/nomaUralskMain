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

        const { bitrixStartDate, bitrixEndDate } = JSON.parse(event.body);

        const webhookUrl =
            'https://zhezkazgan-romantic.bitrix24.kz/rest/20509/qyhraw9d6jnfbksc/crm.deal.list.json';
        const batchSize = 50;
        let allDeals = [];
        let start = 0;

        while (true) {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: {
                        '>=DATE_CREATE': bitrixStartDate,
                        '<=DATE_CREATE': bitrixEndDate,
                        STAGE_ID: 'WON',
                    },
                    select: [
                        'ASSIGNED_BY_ID',
                        'BEGINDATE',
                        'CATEGORY_ID',
                        'CLOSED',
                        'CLOSEDATE',
                        'CONTACT_ID',
                        'CREATED_BY_ID',
                        'CURRENCY_ID',
                        'DATE_CREATE',
                        'DATE_MODIFY',
                        'ID',
                        'IS_MANUAL_OPPORTUNITY',
                        'IS_NEW',
                        'IS_RECURRING',
                        'IS_REPEATED_APPROACH',
                        'IS_RETURN_CUSTOMER',
                        'LAST_ACTIVITY_BY',
                        'LAST_ACTIVITY_TIME',
                        'LEAD_ID',
                        'OPENED',
                        'OPPORTUNITY',
                        'PROBABILITY',
                        'STAGE_ID',
                        'STAGE_SEMANTIC_ID',
                        'TITLE',
                        'TYPE_ID',
                    ],
                    start: start,
                    order: { ID: 'ASC' },
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
                    body: JSON.stringify({ error: `Error fetching deals: ${data.error}` }),
                };
            } else {
                allDeals = allDeals.concat(data.result);
                if (data.result.length < batchSize) {
                    break;
                }
                start += batchSize;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(allDeals),
        };
    } catch (error) {
        console.error('Function error:', error); // Log error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error fetching deals: ${error.message}` }),
        };
    }
};
