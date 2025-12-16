import { protectedApi } from '../axios';
import { handleAxiosError } from '../utils';

export const makeBid = async (taskId: string, message: string) => {
    try {
        const response = await protectedApi.post('/bids', {
            taskId,
            message,
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to make bid. Please try again.');
    }
}