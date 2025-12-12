import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getProjects } from '@/api/public/projects';

export interface IProject {
  id: string;
  name: string;
  description: string;
  _count: {
    tasks: number;
  };
  createdAt: string;
}

export interface IProjectsResponse {
  data: IProject[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

interface UseFetchProjectsParams {
  currentPage?: MaybeRef<number>;
  limit?: MaybeRef<number>;
  search?: MaybeRef<string>;
  enabled?: MaybeRef<boolean>;
}

export const useFetchProjects = (params: UseFetchProjectsParams = {}) => {
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
  } = useQuery<IProjectsResponse>({
    queryKey: computed(() => ['projects', currentPageValue.value, limitValue.value, searchValue.value]),
    queryFn: () => getProjects(currentPageValue.value, limitValue.value, searchValue.value),
    enabled: enabledValue,
    placeholderData: (previousData) => previousData,
  });

  // Computed properties from API response
  const projects = computed(() => (data.value as IProjectsResponse | undefined)?.data ?? []);
  const meta = computed(() => {
    const responseMeta = (data.value as IProjectsResponse | undefined)?.meta;
    if (responseMeta) return responseMeta;
    
    return {
      total: projects.value.length,
      currentPage: currentPageValue.value ?? 1,
      limit: limitValue.value ?? projects.value.length,
      totalPages: 1,
    };
  });

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load projects. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load projects. Please try again.';
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
    projects,
    meta,
    
    // Error
    errorMessage,
  };
};
