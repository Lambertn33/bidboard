<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { getTasks } from '@/api/public/tasks';
import { getProjects } from '@/api/public/projects';
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

// Infinite tasks query with filters
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
  queryKey: computed(() => ['tasks', debouncedSearch.value, selectedProjectId.value]),
  queryFn: ({ pageParam = 1 }) =>
    getTasks(pageParam, 10, debouncedSearch.value, selectedProjectId.value || undefined),
  getNextPageParam: (lastPage) => {
    const { meta } = lastPage;
    if (meta.currentPage < meta.totalPages) {
      return meta.currentPage + 1;
    }
    return undefined;
  },
  initialPageParam: 1,
  keepPreviousData: true,
});

// Flatten all pages into a single array
const allTasks = computed(() => {
  if (!data.value) return [];
  return data.value.pages.flatMap((page) => page.data || []);
});

// Scroll detection for infinite scroll
const handleScroll = () => {
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
      <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <!-- Sidebar Filters -->
        <Sidebar
          :projects="projects"
          :is-projects-loading="isProjectsLoading"
          :is-projects-error="isProjectsError"
          v-model:selectedProjectId="selectedProjectId"
          @clear="clearFilters"
          @refetchProjects="refetchProjects"
        />

        <!-- Main column -->
        <div>
          <!-- Search -->
          <Search
            v-model:searchQuery="searchQuery"
            @search="refetch"
          />

          <!-- Tasks -->
          <div class="space-y-6">
            <Loading v-if="isPending" :count="5" />

            <Error
              v-else-if="isError"
              :error="error instanceof Error ? error.message : 'Failed to load tasks. Please try again later.'"
              @refetch="refetch"
            />

            <div v-else-if="allTasks.length > 0" class="space-y-4">
              <List :tasks="allTasks" />

              <div v-if="isFetchingNextPage" class="text-center">
                <div class="inline-flex items-center gap-2 text-gray-600">
                  <div class="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm font-medium">Loading more tasks...</span>
                </div>
              </div>

              <div v-else-if="!hasNextPage && allTasks.length > 0" class="text-center text-sm text-gray-500">
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
