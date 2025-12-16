<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getTasks } from '@/api/private/common/tasks';
import { Table, Search, Create } from '@/components/private/admin/tasks';
import { Modal } from '@/components/ui';
import { useFetchProjects } from '@/composables/useFetchProjects';
import { createTask } from '@/api/private/admin/tasks';
import { useToast } from '@/composables/useToast';

const { success: showSuccessToast, error: showErrorToast } = useToast();
const queryClient = useQueryClient();

  interface ITask {
    id: string;
    name: string;
    description: string;
    status: "OPEN" | "ASSIGNED" | "COMPLETED";
    price: number;
    skills: string[];
    project: {
      id: string;
      name: string;
    };
  }

  interface ITaskResponse {
    data: ITask[];
    meta: {
      total: number;
      currentPage: number;
      limit: number;
      totalPages: number;
    };
  }

  interface ICreateTaskPayload {
    name: string;
    description: string;
    project_id: string | null;
    price: number;
    skills: string[];
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

// Fetch tasks from API with pagination and search
const { data } = useQuery<ITaskResponse>({
  queryKey: computed(() => ['tasks', currentPage.value, limit.value, debouncedSearch.value]),
  queryFn: () => getTasks(currentPage.value, limit.value, debouncedSearch.value),
  placeholderData: (previousData) => previousData,
});

// Computed properties from API response
const tasks = computed(() => (data.value as ITaskResponse | undefined)?.data ?? []);
const meta = computed(() => (data.value as ITaskResponse | undefined)?.meta ?? {
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

// CREATE NEW TASK MODAL AND EDIT TASK MODAL
const isCreatingTaskModalOpen = ref(false);

const openCreatingTaskModal = () => {
  isCreatingTaskModalOpen.value = true;
};

const closeCreatingTaskModal = () => {
  isCreatingTaskModalOpen.value = false;
};

// Fetch projects from API for dropdown (only when modal is open)
const { projects } = useFetchProjects({
  enabled: isCreatingTaskModalOpen,
});

const { mutate: createTaskMutation, isPending: isCreatingTaskPending } = useMutation({
  mutationFn: (payload: ICreateTaskPayload) => createTask(payload),
  onSuccess: (response) => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    closeCreatingTaskModal();
    showSuccessToast(response?.message || 'Task created successfully');
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to create task. Please try again.');
  },
});

const handleCreateTask = (payload: { name: string; description: string; project_id: string | null; price: number; skills: string[] }) => {
  createTaskMutation(payload);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
            <p class="mt-1 text-sm text-gray-600">Manage and view all your tasks</p>
          </div>
          <button @click="openCreatingTaskModal" class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <OhVueIcon name="hi-plus" class="w-5 h-5" />
            <span>New Task</span>
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
        :tasks="tasks"
        :meta="meta"
        :has-previous-page="hasPreviousPage"
        :has-next-page="hasNextPage"
        :limit="limit"
        @goToPage="goToPage"
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        @update:limit="(value: number) => limit = value"
        @open-editing-modal="() => {}"
      />
    </div>
  </div>

  <Modal
    :isOpen="isCreatingTaskModalOpen"
    @close="closeCreatingTaskModal"
  >
    <Create 
      @create-task="handleCreateTask"
      :isCreatingTaskPending="isCreatingTaskPending"
      :projects="projects"
    />
  </Modal>
</template>