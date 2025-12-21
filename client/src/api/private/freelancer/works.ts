
import { handleAxiosError } from '../utils';
import { protectedApi } from '../axios';    


export const submitWork = async (workId: string, completionUrl: string) => {
try {
    const response = await protectedApi.put(`/works/${workId}/complete`, { completionUrl });
    return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to submit work');
    }
};