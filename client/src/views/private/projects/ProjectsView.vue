<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { getProjects } from '@/api/public/projects';
import { useQuery } from '@tanstack/vue-query';
import Pagination from '@/components/private/admin/projects/Pagination.vue';
import Table from '@/components/private/admin/projects/Table.vue';
import Search from '@/components/private/admin/projects/Search.vue';

interface IProject {
  id: string;
  name: string;
  description: string;
  _count: {
    tasks: number;
  };
  createdAt: string;
}

interface IProjectsResponse {
  data: IProject[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

// Pagination and search state (used for API calls)
const currentPage = ref(1);
const limit = ref(10);
const searchQuery = ref('');
const debouncedSearch = ref('');

// Debounce search input before triggering queries
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    debouncedSearch.value = searchQuery.value.trim();
  }, 300);
});

// Reset page when page size changes
watch(limit, () => {
  currentPage.value = 1;
});

// Fetch projects from API with pagination and search
const {
  isPending,
  isError,
  data,
  error,
  refetch,
} = useQuery<IProjectsResponse>({
  queryKey: computed(() => ['projects', currentPage.value, limit.value, debouncedSearch.value]),
  queryFn: () => getProjects(currentPage.value, limit.value, debouncedSearch.value),
  keepPreviousData: true,
});

// Computed properties from API response
const projects = computed(() => data.value?.data ?? []);
const meta = computed(() => data.value?.meta ?? {
  total: 0,
  currentPage: currentPage.value,
  limit: limit.value,
  totalPages: 1,
});

// Pagination helpers
const hasPreviousPage = computed(() => meta.value.currentPage > 1);
const hasNextPage = computed(() => meta.value.currentPage < meta.value.totalPages);

// Pagination handlers
const goToPage = (page: number) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    currentPage.value = page;
  }
};

const goToPreviousPage = () => {
  if (hasPreviousPage.value) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
  }
};

// Format date nicely
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
            <p class="mt-1 text-sm text-gray-600">Manage and view all your projects</p>
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <OhVueIcon name="hi-plus" class="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <Search v-model:searchQuery="searchQuery" />

      <!-- Table -->
      <Table
        :projects="projects"
        :meta="meta"
        :has-previous-page="hasPreviousPage"
        :has-next-page="hasNextPage"
        :limit="limit"
        :format-date="formatDate"
        @goToPage="goToPage"
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        @update:limit="value => limit = value"
      />
    </div>
  </div>
</template>
