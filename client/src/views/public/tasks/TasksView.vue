<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';

import { getTasks } from '@/api/public/tasks';
import { getProjects, getProjectTasks } from '@/api/public/projects';
import { Loading, Error, List } from '@/components/public/tasks';
import Search from '@/components/public/tasks/Search.vue';
import Sidebar from '@/components/public/tasks/Sidebar.vue';

const searchQuery = ref('');
const debouncedSearch = ref('');
const selectedProjectId = ref<string | null>(null);

// Fetch projects for filtering
const {
  isPending: isProjectsLoading,
  isError: isProjectsError,
  data: projectsData,
  error: projectsError,
  refetch: refetchProjects,
} = useQuery({
  queryKey: ['projects'],
  queryFn: () => getProjects(),
});

// Debounce search input
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = searchQuery.value.trim();
  }, 300);
});

// Fetch tasks for a project (only when a project is selected, no pagination)
const isProjectTasksEnabled = computed(() => !!selectedProjectId.value);
const {
  isPending: isProjectTasksLoading,
  isError: isProjectTasksError,
  data: projectTasksData,
  error: projectTasksError,
  refetch: refetchProjectTasks,
} = useQuery({
  queryKey: computed(() => ['project-tasks', selectedProjectId.value]),
  queryFn: () => getProjectTasks(selectedProjectId.value || ''),
  enabled: isProjectTasksEnabled,
});

// Infinite tasks query with filters (only when no project is selected)
const {
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
  isError,
  refetch,
} = useInfiniteQuery({
  queryKey: computed(() => ['tasks', debouncedSearch.value]),
  queryFn: ({ pageParam = 1 }) =>
    getTasks(pageParam, 10, debouncedSearch.value),
  getNextPageParam: (lastPage) => {
    const { meta } = lastPage;
    if (meta.currentPage < meta.totalPages) {
      return meta.currentPage + 1;
    }
    return undefined;
  },
  initialPageParam: 1,
  keepPreviousData: true,
  enabled: computed(() => !selectedProjectId.value),
});

// Flatten all pages into a single array
const allTasks = computed(() => {
  if (!data.value) return [];
  return data.value.pages.flatMap((page) => page.data || []);
});

const displayTasks = computed(() => {
  if (selectedProjectId.value) {
    // Extract tasks from project data and add project info
    const projectData = projectTasksData.value?.data;
    if (!projectData) return [];
    
    return (projectData.tasks || []).map((task: any) => ({
      ...task,
      project: {
        id: projectData.id,
        name: projectData.name,
      },
    }));
  }
  return allTasks.value;
});

const isListLoading = computed(() =>
  selectedProjectId.value ? isProjectTasksLoading.value : isPending.value
);

const isListError = computed(() =>
  selectedProjectId.value ? isProjectTasksError.value : isError.value
);

const listErrorMessage = computed(() => {
  const err = selectedProjectId.value ? projectTasksError.value : error.value;
  return err instanceof Error ? err.message : 'Failed to load tasks. Please try again later.';
});

const listRefetch = () => (selectedProjectId.value ? refetchProjectTasks() : refetch());

const showLoadMore = computed(() => !selectedProjectId.value && isFetchingNextPage.value);
const showEndOfList = computed(
  () => !selectedProjectId.value && !hasNextPage.value && allTasks.value.length > 0
);

// Scroll detection for infinite scroll (only when no project is selected)
const handleScroll = () => {
  // Do not trigger infinite scroll when a project is selected
  if (selectedProjectId.value) return;

  if (isFetchingNextPage.value || !hasNextPage.value) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 5) {
    fetchNextPage();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const projects = computed(() => projectsData?.value?.data ?? []);

const clearFilters = () => {
  searchQuery.value = '';
  selectedProjectId.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-1">Available Tasks</h1>
          <p class="text-gray-600">Browse tasks and filter by project or keywords.</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        <!-- Sidebar Filters -->
        <div class="sticky top-24">
          <Sidebar
            :projects="projects"
            :is-projects-loading="isProjectsLoading"
            :is-projects-error="isProjectsError"
            v-model:selectedProjectId="selectedProjectId"
            @clear="clearFilters"
            @refetchProjects="refetchProjects"
          />
        </div>

        <!-- Main column -->
        <div class="flex flex-col gap-4">
          <!-- Search -->
          <div class="sticky top-24 z-10">
            <Search
              v-model:searchQuery="searchQuery"
              @search="refetch"
            />
          </div>

          <!-- Tasks (scrollable area) -->
          <div class="space-y-6 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
            <Loading v-if="isListLoading" :count="5" />

            <Error
              v-else-if="isListError"
              :error="listErrorMessage"
              @refetch="listRefetch"
            />

            <div v-else-if="displayTasks.length > 0" class="space-y-4">
              <List :tasks="displayTasks" />

              <div v-if="showLoadMore" class="text-center">
                <div class="inline-flex items-center gap-2 text-gray-600">
                  <div class="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm font-medium">Loading more tasks...</span>
                </div>
              </div>

              <div v-else-if="showEndOfList" class="text-center text-sm text-gray-500">
                You've reached the end of the list
              </div>
            </div>

            <div v-else class="text-center py-20">
              <div class="bg-white rounded-2xl p-12 shadow-sm">
                <OhVueIcon name="bi-folder-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h3>
                <p class="text-gray-600">Try adjusting your search or filters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
