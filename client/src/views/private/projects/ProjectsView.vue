<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { getProjects } from '@/api/public/projects';
import { createProject } from '@/api/private/admin/projects';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { Create, Table, Search } from '@/components/private/admin/projects';
import { Modal } from '@/components/ui';
import { getStartTimeInDays } from '@/reusables';
import { useToast } from '@/composables/useToast';

const { success: showSuccessToast, error: showErrorToast } = useToast();
const queryClient = useQueryClient();


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
const { data } = useQuery<IProjectsResponse>({
  queryKey: computed(() => ['projects', currentPage.value, limit.value, debouncedSearch.value]),
  queryFn: () => getProjects(currentPage.value, limit.value, debouncedSearch.value),
  placeholderData: (previousData) => previousData,
});

// Computed properties from API response
const projects = computed(() => (data.value as IProjectsResponse | undefined)?.data ?? []);
const meta = computed(() => (data.value as IProjectsResponse | undefined)?.meta ?? {
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

// CREATE NEW PROJECT MODAL
const isCreatingProjectModalOpen = ref(false);

const openCreatingProjectModal = () => {
  isCreatingProjectModalOpen.value = true;
};

const closeCreatingProjectModal = () => {
  isCreatingProjectModalOpen.value = false;
};

const { mutate: createProjectMutation, isPending: isCreatingProjectPending } = useMutation({
  mutationFn: (payload: { name: string; description: string }) => createProject(payload),
  onSuccess: (response) => {
    closeCreatingProjectModal();
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    showSuccessToast(response?.message || 'Project created successfully');
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to create project. Please try again.');
  }  
});

const handleCreateProject = (payload: { name: string; description: string }) => {
  createProjectMutation(payload);
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
          <button @click="openCreatingProjectModal" class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
        :format-date="getStartTimeInDays"
        @goToPage="goToPage"
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        @update:limit="(value: number) => limit = value"
      />
    </div>
  </div>

  <Modal
    :isOpen="isCreatingProjectModalOpen"
    @close="closeCreatingProjectModal"
  >
    <Create 
    @create-task="handleCreateProject"
    :isCreatingProjectPending="isCreatingProjectPending"
    />
  </Modal>
  

</template>
