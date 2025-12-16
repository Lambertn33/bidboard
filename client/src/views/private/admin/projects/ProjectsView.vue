<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { createProject, updateProject } from '@/api/private/admin/projects';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Create, Table, Edit } from '@/components/private/admin/projects';
import { Modal, Search } from '@/components/ui';
import { getStartTimeInDays } from '@/reusables';
import { useToast } from '@/composables/useToast';
import { useFetchProject } from '@/composables/useFetchProject';
import { useFetchProjects } from '@/composables/useFetchProjects';

const { success: showSuccessToast, error: showErrorToast } = useToast();
const queryClient = useQueryClient();

// Pagination and search state
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

// Fetch projects using composable
const {
  projects,
  meta,
} = useFetchProjects({
  currentPage,
  limit,
  search: debouncedSearch,
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

// CREATE NEW PROJECT MODAL AND EDIT PROJECT MODAL
const isCreatingProjectModalOpen = ref(false);
const isEditingProjectModalOpen = ref(false);

// Selected project id for editing
const selectedProjectId = ref<string | null>(null);

// Fetch project data when editing (reactive to selectedProjectId)
const {
  isPending: isFetchingProject,
  isFetching: isProjectRefetching,
  isError: isFetchProjectError,
  projectData,
  errorMessage: fetchProjectErrorMessage,
  refetch: refetchProject,
} = useFetchProject(selectedProjectId);


const openEditingProjectModal = (projectId: string) => {
  selectedProjectId.value = projectId;
  isEditingProjectModalOpen.value = true;
};

const closeEditingProjectModal = () => {
  isEditingProjectModalOpen.value = false;
  selectedProjectId.value = null;
};

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

const { mutate: updateProjectMutation, isPending: isUpdatingProjectPending } = useMutation({
  mutationFn: (payload: { name: string; description: string }) => updateProject(selectedProjectId.value as string, payload),
  onSuccess: (response) => {
    showSuccessToast(response?.message || 'Project updated successfully');
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    if (selectedProjectId.value) {
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId.value] });
      refetchProject();
    }
    closeEditingProjectModal();
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to update project. Please try again.');
  }
});

const handleCreateProject = (payload: { name: string; description: string }) => {
  createProjectMutation(payload);
};

const handleEditProject = (payload: { name: string; description: string }) => {
  updateProjectMutation(payload);
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
        @open-editing-modal="(projectId: string) => openEditingProjectModal(projectId as string)"
      />
    </div>
  </div>

  <Modal
    :isOpen="isCreatingProjectModalOpen"
    @close="closeCreatingProjectModal"
  >
    <Create 
    @create-project="handleCreateProject"
    :isCreatingProjectPending="isCreatingProjectPending"
    />
  </Modal>

  <Modal
    :isOpen="isEditingProjectModalOpen"
    @close="closeEditingProjectModal"
  >
    <div class="space-y-3">
      <div v-if="isFetchingProject || isProjectRefetching" class="text-sm text-gray-500">Loading project...</div>
      <div v-else-if="isFetchProjectError" class="text-sm text-red-600">
        {{ fetchProjectErrorMessage }}
        <button class="ml-2 text-blue-600 underline" @click="() => refetchProject()">Retry</button>
      </div>
      <div v-else-if="projectData">
      <Edit
        :project="projectData"
        :isUpdatingProjectPending="isUpdatingProjectPending"
        @edit-project="handleEditProject"
       />
        <!-- Placeholder for future Edit form -->
      </div>
      <div v-else class="text-sm text-gray-500">Select a project to edit.</div>
    </div>
  </Modal>
  

</template>
