import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getBids } from '@/api/private/common/bids';

export interface IBidFreelancer {
  id: string;
  telephone: string;
  user: {
    id: string;
    names: string;
    email: string;
  };
}

export interface IBid {
  id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  task: {
    id: string;
    name: string;
    description: string;
    status: 'OPEN' | 'ASSIGNED' | 'COMPLETED';
    price: number;
    project: {
      id: string;
      name: string;
    };
    freelancer?: IBidFreelancer | null;
  };
}

export interface IBidsResponse {
  data: IBid[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

interface UseFetchBidsParams {
  currentPage?: MaybeRef<number>;
  limit?: MaybeRef<number>;
  search?: MaybeRef<string>;
  enabled?: MaybeRef<boolean>;
}

export const useFetchBids = (params: UseFetchBidsParams = {}) => {
  const currentPageValue = computed(() => {
    const value = unref(params.currentPage);
    return value !== undefined ? value : undefined;
  });
  const limitValue = computed(() => {
    const value = unref(params.limit);
    return value !== undefined ? value : undefined;
  });
  const searchValue = computed(() => {
    const value = unref(params.search);
    return value && value.trim() ? value.trim() : undefined;
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
  } = useQuery<IBidsResponse>({
    queryKey: computed(() => ['bids', currentPageValue.value, limitValue.value, searchValue.value]),
    queryFn: () => getBids(currentPageValue.value, limitValue.value),
    enabled: enabledValue,
    placeholderData: (previousData) => previousData,
  });

  // Computed properties from API response
  const bids = computed(() => (data.value as IBidsResponse | undefined)?.data ?? []);
  const meta = computed(() => {
    const responseMeta = (data.value as IBidsResponse | undefined)?.meta;
    if (responseMeta) return responseMeta;
    
    return {
      total: bids.value.length,
      currentPage: currentPageValue.value ?? 1,
      limit: limitValue.value ?? bids.value.length,
      totalPages: 1,
    };
  });

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load bids. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load bids. Please try again.';
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
    bids,
    meta,
    
    // Error
    errorMessage,
  };
};
