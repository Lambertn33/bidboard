import { protectedApi } from '../axios';
import { handleAxiosError } from '../utils';

export const getBids = async (currentPage?: number, limit?: number) => {
    try {
        const response = await protectedApi.get('/bids', {
            params: {
                currentPage,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch bids');
    }
}