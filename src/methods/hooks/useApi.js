// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { axiosInstance } from '../../api/axiosInstance';

export const useApi = () => {
    // Состояние для управления загрузкой и ошибками
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Функция для выполнения GET-запросов
    const get = useCallback(async (url, params = {}, config = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(url, { params, ...config });
            return response.data;
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || 'Ошибка при выполнении GET запроса',
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Функция для выполнения POST-запросов
    const post = useCallback(async (url, data = {}, config = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(url, data, config);
            return response.data;
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || 'Ошибка при выполнении POST запроса',
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Функция для выполнения PUT-запросов
    const put = useCallback(async (url, data = {}, config = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(url, data, config);
            return response.data;
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || 'Ошибка при выполнении PUT запроса',
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Функция для выполнения DELETE-запросов
    const del = useCallback(async (url, config = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.delete(url, config);
            return response.data;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Ошибка при выполнении DELETE запроса',
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { get, post, put, del, isLoading, error };
};
