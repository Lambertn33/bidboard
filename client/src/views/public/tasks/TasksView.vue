<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { getTasks } from '@/api/public/tasks';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { Loading, Error, List } from '@/components/public/tasks';

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
    queryKey: ['tasks'],
    queryFn: ({ pageParam = 1 }) => getTasks(pageParam, 10),
    getNextPageParam: (lastPage) => {
        const { meta } = lastPage;
        if (meta.currentPage < meta.totalPages) {
            return meta.currentPage + 1;
        }
        return undefined;
    },
    initialPageParam: 1,
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

    // Trigger when user is 200px from bottom
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
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Available Tasks
          </h1>
          <p class="text-gray-600">
            Browse through available tasks and find opportunities that match your skills.
          </p>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <Loading v-if="isPending" :count="5" />

      <!-- Error State -->
      <Error
        v-else-if="isError"
        :error="error instanceof Error ? error.message : 'Failed to load tasks. Please try again later.'"
        @refetch="refetch"
      />

      <!-- Data State -->
      <div v-else-if="allTasks.length > 0">
        <List :tasks="allTasks" />
        
        <!-- Loading More Indicator -->
        <div v-if="isFetchingNextPage" class="mt-6 text-center">
          <div class="inline-flex items-center gap-2 text-gray-600">
            <div class="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm font-medium">Loading more tasks...</span>
          </div>
        </div>
        
        <!-- End of List Indicator -->
        <div v-else-if="!hasNextPage && allTasks.length > 0" class="mt-6 text-center">
          <p class="text-sm text-gray-500">You've reached the end of the list</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-white rounded-2xl p-12 shadow-sm">
          <OhVueIcon name="bi-folder-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h3>
          <p class="text-gray-600">Check back later for new tasks.</p>
        </div>
      </div>
    </div>
    </div>
</template>
