import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getWorks } from '@/api/private/common/works';

interface IWorkFreelancer {
  user: {
    names: string;
  };
}

interface IWorkTask {
  id: string;
  name: string;
}

interface IWork {
  id: string;
  freelancer: IWorkFreelancer | null;
  task: IWorkTask;
  completionUrl: string | null;
  startDate: string;
  endDate: string;
  status: "COMPLETED" | "IN_PROGRESS";
}

export interface IWorksResponse {
  data: IWork[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

interface UseFetchWorksParams {
  currentPage?: MaybeRef<number>;
  limit?: MaybeRef<number>;
  enabled?: MaybeRef<boolean>;
}

export const useFetchWorks = (params: UseFetchWorksParams = {}) => {
  const currentPageValue = computed(() => {
    const value = unref(params.currentPage);
    return value !== undefined ? value : undefined;
  });
  const limitValue = computed(() => {
    const value = unref(params.limit);
    return value !== undefined ? value : undefined;
  });
  const enabledValue = computed(() => unref(params.enabled) ?? true);

  // Fetch projects from API with pagination and search
  const {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
  } = useQuery<IWorksResponse>({
    queryKey: computed(() => ['works', currentPageValue.value, limitValue.value]),
    queryFn: () => getWorks(currentPageValue.value, limitValue.value),
    enabled: enabledValue,
    placeholderData: (previousData) => previousData,
  });

  // Computed properties from API response
  const works = computed(() => (data.value as IWorksResponse | undefined)?.data ?? []);
  const meta = computed(() => {
    const responseMeta = (data.value as IWorksResponse | undefined)?.meta;
    if (responseMeta) return responseMeta;
    
    return {
      total: works.value.length,
      currentPage: currentPageValue.value ?? 1,
      limit: limitValue.value ?? works.value.length,
      totalPages: 1,
    };
  });

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load works. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load works. Please try again.';
  });

  return {
    // Query state
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
    
    // Computed data
    works,
    meta,
    
    // Error
    errorMessage,
  };
};
