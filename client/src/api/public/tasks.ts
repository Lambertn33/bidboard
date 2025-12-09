import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
    baseURL: `${API_BASE_URL}/tasks`,
});

export const getTasks = async (currentPage?: number, limit?: number, search?: string, projectId?: string) => {
    const response = await api.get('/', {
        params: {
            currentPage,
            limit,
            search,
            projectId,
        },
    });
    return response.data;
};