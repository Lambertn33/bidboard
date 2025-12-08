import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
    baseURL: `${API_BASE_URL}/tasks`,
});

export const getTasks = async (currentPage?: number, limit?: number) => {
    const response = await api.get('/tasks', {
        params: {
            currentPage,
            limit,
        },
    });
    return response.data;
};