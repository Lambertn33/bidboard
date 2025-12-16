<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { OhVueIcon } from 'oh-vue-icons';
import { getTasks } from '@/api/private/common/tasks';
import { Table, Search, Create, Edit } from '@/components/private/admin/tasks';
import { Modal } from '@/components/ui';
import { useFetchProjects } from '@/composables/useFetchProjects';
import { createTask, updateTask, deleteTask } from '@/api/private/admin/tasks';
import { useToast } from '@/composables/useToast';
import { useFetchTask } from '@/composables/useFetchTask';

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

  interface IUpdateTaskPayload {
    name: string;
    description: string;
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
const { 
  data, 
  isPending: isFetchingTasks, 
  isError: isFetchingTasksError, 
  error: fetchTasksError,
  refetch: refetchTasks 
} = useQuery<ITaskResponse>({
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


// CREATE TASK MUTATION
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

// EDIT TASK
const isEditingTaskModalOpen = ref(false);

const selectedTaskId = ref<string | null>(null);

const openEditingTaskModal = (taskId: string) => {
  selectedTaskId.value = taskId;
  isEditingTaskModalOpen.value = true;
};

const closeEditingTaskModal = () => {
  isEditingTaskModalOpen.value = false;
  selectedTaskId.value = null;
};

const { 
  isPending: isFetchingTask,
  isFetching: isTaskRefetching,
  isError: isFetchingTaskError,
  taskData: taskToEdit,
  errorMessage: fetchTaskErrorMessage,
  refetch: refetchTask,
 } = useFetchTask(selectedTaskId);

 const { mutate: updateTaskMutation, isPending: isUpdatingTaskPending } = useMutation({
  mutationFn: (payload: IUpdateTaskPayload) => updateTask(selectedTaskId.value as string, payload),
  onSuccess: (response) => {
    showSuccessToast(response?.message || 'Task updated successfully');
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    if (selectedTaskId.value) {
      queryClient.invalidateQueries({ queryKey: ['task', selectedTaskId.value] });
      refetchTask();
    }
    closeEditingTaskModal();
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to update task. Please try again.');
  }
});



const handleCreateTask = (payload: ICreateTaskPayload) => {
  createTaskMutation(payload);
};

  const handleEditTask = (payload: IUpdateTaskPayload) => {
    updateTaskMutation(payload);
  };

  // DELETE TASK
  const { mutate: deleteTaskMutation, isPending: isDeletingTaskPending } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (response) => {
      showSuccessToast(response?.message || 'Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      showErrorToast(error?.message || 'Failed to delete task. Please try again.');
    },
  });

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation(taskId);
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

      <!-- Loading State -->
      <div v-if="isFetchingTasks || isDeletingTaskPending" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-sm text-gray-600">Loading tasks...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="isFetchingTasksError" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <OhVueIcon name="hi-exclamation-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">Failed to load tasks</h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ (fetchTasksError as Error)?.message || 'An error occurred while fetching tasks.' }}
          </p>
          <button
            @click="refetchTasks()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <OhVueIcon name="hi-refresh" class="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>

      <!-- Table -->
      <Table
        v-else
        :tasks="tasks"
        :meta="meta"
        :has-previous-page="hasPreviousPage"
        :has-next-page="hasNextPage"
        :limit="limit"
        @goToPage="goToPage"
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        @update:limit="(value: number) => limit = value"
        @open-editing-modal="openEditingTaskModal"
        @delete-task="handleDeleteTask"
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
  <Modal
    :isOpen="isEditingTaskModalOpen"
    @close="closeEditingTaskModal"
  >
    <div class="space-y-3">
      <div v-if="isFetchingTask || isTaskRefetching" class="text-sm text-gray-500">Loading task...</div>
      <div v-else-if="isFetchingTaskError" class="text-sm text-red-600">
        {{ fetchTaskErrorMessage }}
        <button class="ml-2 text-blue-600 underline" @click="() => refetchTask()">Retry</button>
      </div>
      <div v-else-if="taskToEdit">
      <Edit
        :taskToEdit="taskToEdit"
        :isEditingTaskPending="isUpdatingTaskPending"
        :projects="projects"
        @edit-task="handleEditTask"
       />
        <!-- Placeholder for future Edit form -->
      </div>
      <div v-else class="text-sm text-gray-500">Select a task to edit.</div>
    </div>
  </Modal>
</template>