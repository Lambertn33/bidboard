import protectedApi from "../axios";
import { handleAxiosError } from "../utils";

export const getTaskDetails = async (id: string) => {
    try {
        const response = await protectedApi.get(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch task details');
    }
};