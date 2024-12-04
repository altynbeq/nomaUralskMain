// src/hooks/useApi.js
import { useCallback } from 'react';
import { axiosInstance } from '../../api/axiosInstance';

const useApi = () => {
    // Функция для выполнения GET-запросов
    const get = useCallback(async (url, params = {}, config = {}) => {
        const response = await axiosInstance.get(url, { params, ...config });
        return response.data;
    }, []);

    // Функция для выполнения POST-запросов
    const post = useCallback(async (url, data = {}, config = {}) => {
        const response = await axiosInstance.post(url, data, config);
        return response.data;
    }, []);

    // Функция для выполнения PUT-запросов
    const put = useCallback(async (url, data = {}, config = {}) => {
        const response = await axiosInstance.put(url, data, config);
        return response.data;
    }, []);

    // Функция для выполнения DELETE-запросов
    const del = useCallback(async (url, config = {}) => {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    }, []);

    // Можно добавить другие методы (PATCH, HEAD и т.д.) по необходимости

    return { get, post, put, del };
};

export default useApi;
