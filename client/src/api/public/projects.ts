import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const getProjects = async (currentPage?: number, limit?: number) => {
    const response = await api.get('/projects', {
        params: {
            currentPage,
            limit,
        },
    });
    return response.data;
};