import { computed, type MaybeRef, unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getProjectTasks } from '@/api/public/projects';

export interface IProjectTask {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  skills: string[];
}

export interface IProjectData {
  id: string;
  name: string;
  description: string;
  tasks: IProjectTask[];
  _count: {
    tasks: number;
  };
}

export interface IProjectResponse {
  data: IProjectData;
}

export const useFetchProject = (projectId: MaybeRef<string | null>) => {
  const projectIdValue = computed(() => unref(projectId) || '');
  
  const {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
  } = useQuery<IProjectResponse>({
    queryKey: computed(() => ['project', projectIdValue.value]),
    queryFn: () => getProjectTasks(projectIdValue.value) as Promise<IProjectResponse>,
    enabled: computed(() => Boolean(projectIdValue.value)),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const projectData = computed(() => (data.value as IProjectResponse | undefined)?.data);
  const projectName = computed(() => projectData.value?.name || '');
  const projectDescription = computed(() => projectData.value?.description || '');
  const tasks = computed(() => projectData.value?.tasks || []);
  const tasksCount = computed(() => projectData.value?._count?.tasks || 0);

  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to load project details. Please try again.';

    const axiosError = error.value as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return 'Failed to load project details. Please try again.';
  });

  return {
    isPending,
    isError,
    isFetching,
    data,
    error,
    refetch,
    projectData,
    projectName,
    projectDescription,
    tasks,
    tasksCount,
    errorMessage,
  };
};
