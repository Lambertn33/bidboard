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