import { protectedApi } from '../axios';
import { handleAxiosError } from '../utils';

export const payWork = async (workId: string) => {
    try {
        const response = await protectedApi.put(`/works/${workId}/pay`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to pay work');
    }
}