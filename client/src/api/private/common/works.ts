import { protectedApi } from '../axios';
import { handleAxiosError } from '../utils';

export const getWorks = async (currentPage?: number, limit?: number) => {
    try {
        const response = await protectedApi.get('/works', {
            params: {
                currentPage,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch works');
    }
}

export const getWorkDetails = async (workId: string) => {
    try {
        const response = await protectedApi.get(`/works/${workId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch work details');
    }
}