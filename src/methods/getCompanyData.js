import { axiosInstance } from '../api/axiosInstance';

export async function getCompanyData(companyId) {
    try {
        const response = await axiosInstance.get(`/users/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
