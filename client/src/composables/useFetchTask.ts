import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getTaskDetails } from '@/api/private/common/tasks';



  export interface TaskFreelancer {
    id: string;
    telephone: string;
    user: {
      id: string;
      names: string;
      email: string;
    };
  }
  
  export interface TaskWork {
    id: string;
    completionUrl: string;
    freelancer: TaskFreelancer;
    status: 'IN_PROGRESS' | 'COMPLETED';
  }
  
  export interface TaskBid {
    id: string;
    message: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    freelancer: TaskFreelancer;
  }
  
  export interface TaskData {
    id: string;
    name: string;
    description: string;
    status: 'OPEN' | 'ASSIGNED' | 'COMPLETED';
    price: number;
    skills: string[];
    createdAt: string;
    updatedAt: string;
    project: {
      id: string;
      name: string;
    };
    work: TaskWork | null;
    bids: TaskBid[];
  }

  export interface ITaskResponse {
    data: TaskData;
  }

export const useFetchTask = (taskId: MaybeRef<string | null>) => {
  const taskIdValue = computed(() => unref(taskId) || '');
  
  const {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
  } = useQuery<ITaskResponse>({
    queryKey: computed(() => ['task', taskIdValue.value]),
    queryFn: () => getTaskDetails(taskIdValue.value) as Promise<ITaskResponse>,
    enabled: computed(() => Boolean(taskIdValue.value)),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const taskData = computed(() => (data.value as ITaskResponse | undefined)?.data);

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load task details. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load task details. Please try again.';
  });

  return {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
    taskData,
    errorMessage,
  };
};
