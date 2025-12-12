import protectedApi from "../axios";
import { handleAxiosError } from "../utils";


export const getTasks = async (currentPage?: number, limit?: number, search?: string, projectId?: string) => {
    try {
        const response = await protectedApi.get('/tasks', {
            params: {
                currentPage,
                limit,
                search,
                projectId,
            },
        });
        return response.data;
        } catch (error) {
            handleAxiosError(error, 'Failed to fetch tasks');
        }
    };

export const getTaskDetails = async (id: string) => {
    try {
        const response = await protectedApi.get(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch task details');
    }
};