import { useState, useCallback } from 'react';

const BASE_URL = 'https://nomalytica-back.onrender.com/api/';

export const useFetch = (endpoint?: string) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (relativeUrl?: string, options?: RequestInit) => {
            setIsLoading(true);
            setError(null);
            try {
                const fullUrl = `${BASE_URL}${relativeUrl || endpoint}`;
                const response = await fetch(fullUrl, options);
                if (!response.ok) {
                    setError(`Error: ${response.status} ${response.statusText}`);
                    throw new Error('Failed to fetch data from the server');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        },
        [endpoint],
    );

    return { data, isLoading, error, fetchData };
};
