import { protectedApi } from '../axios';
import { handleAxiosError } from '../utils';

export const acceptBid = async (bidId: string, endDate: string) => {
    try {
        const response = await protectedApi.put(`/bids/${bidId}/accept`, {
            endDate,
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to accept bid. Please try again.');
    }
}

export const rejectBid = async (bidId: string) => {
    try {
        const response = await protectedApi.put(`/bids/${bidId}/reject`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to reject bid. Please try again.');
    }
}