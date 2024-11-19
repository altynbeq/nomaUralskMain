import { useState, useCallback } from 'react';

const BASE_URL = 'https://nomalytica-back.onrender.com/api/';

export const useFetch = <T = unknown>(endpoint?: string) => {
    const [data, setData] = useState<T | null>(null);
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
                    const errorMessage = `Error: ${response.status} ${response.statusText}`;
                    setError(errorMessage);
                    throw new Error(errorMessage);
                }
                const result: T = await response.json();
                setData(result);
                return result;
            } catch (err) {
                setError((err as Error).message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [endpoint],
    );

    return { data, isLoading, error, fetchData };
};
