import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getWorkDetails } from '@/api/private/common/works';



  export interface WorkFreelancer {
    id: string;
    telephone: string;
    user: {
      id: string;
      names: string;
      email: string;
    };
  }

  export interface WorkTask {
    id: string;
    name: string;
    description: string;
  }

  export interface WorkPayment {
    amount: number;
    status: "UNPAID" | "PAID";
    updatedAt: string;
  }
  
  export interface WorkData {
    id: string;
    completionUrl: string | null;
    freelancer?: WorkFreelancer;
    status: 'IN_PROGRESS' | 'COMPLETED';
    startDate: string;
    endDate: string;
    task: WorkTask;
    payment: WorkPayment;
  }

  export interface IWorkResponse {
    data: WorkData;
  }

export const useFetchWork = (workId: MaybeRef<string | null>) => {
  const workIdValue = computed(() => unref(workId) || '');
  
  const {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
  } = useQuery<IWorkResponse>({
    queryKey: computed(() => ['work', workIdValue.value]),
    queryFn: () => getWorkDetails(workIdValue.value) as Promise<IWorkResponse>,
    enabled: computed(() => Boolean(workIdValue.value)),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const workData = computed(() => (data.value as IWorkResponse | undefined)?.data);

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load work details. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load work details. Please try again.';
  });

  return {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
    workData,
    errorMessage,
  };
};
