import axios from 'axios';
import { API_BASE_URL } from '../constants';


const api = axios.create({
    baseURL: `${API_BASE_URL}/projects`,
});

export const getProjects = async (currentPage?: number, limit?: number, search?: string) => {
    const response = await api.get('/', {
        params: {
            currentPage,
            limit,
            search,
        },
    });
    return response.data;
};

export const getProjectTasks = async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data;
};
