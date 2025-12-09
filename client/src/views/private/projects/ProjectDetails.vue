<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { getProjectTasks } from '@/api/public/projects';

const route = useRoute();

interface IProjectTask {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  skills: string[];
}

interface IProjectData {
  id: string;
  name: string;
  description: string;
  tasks: IProjectTask[];
  _count: {
    tasks: number;
  };
}

interface IProjectResponse {
  data: IProjectData;
}

const { isPending, isError, data, error, refetch } = useQuery<IProjectResponse>({
  queryKey: ['project', route.params.id],
  queryFn: () => getProjectTasks(route.params.id as string) as Promise<IProjectResponse>,
});

// Extract project data from API response
const projectData = computed(() => (data.value as IProjectResponse | undefined)?.data);

// Computed properties for easier access
const projectName = computed(() => projectData.value?.name || '');
const projectDescription = computed(() => projectData.value?.description || '');
const tasks = computed(() => projectData.value?.tasks || []);
const tasksCount = computed(() => projectData.value?._count?.tasks || 0);

// Error message
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

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-link
          to="/protected/projects"
          class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer
          hover:text-blue-600"
        >
          <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
          <span class="text-sm font-medium">Back to Projects</span>
        </router-link>
        
        <!-- Loading State -->
        <div v-if="isPending" class="py-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-100 animate-pulse"></div>
            <div class="h-8 w-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div class="h-4 w-96 bg-gray-100 rounded animate-pulse mt-3"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="py-8">
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-2">
              <OhVueIcon name="hi-exclamation-circle" class="h-6 w-6 text-red-600" />
              <h3 class="text-lg font-semibold text-red-900">Error Loading Project</h3>
            </div>
            <p class="text-red-700 mb-4">{{ errorMessage }}</p>
            <button
              @click="() => refetch()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Data State -->
        <div v-else-if="projectData" class="flex items-start justify-between mt-8">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100">
                <OhVueIcon name="bi-folder-fill" class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ projectName }}</h1>
              </div>
            </div>
            <p class="mt-3 text-gray-700 max-w-3xl">{{ projectDescription }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!isPending && !isError && projectData" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100">
              <OhVueIcon name="bi-list-task" class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Tasks</p>
              <p class="text-2xl font-bold text-gray-900">{{ tasksCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Tasks</h2>
            <p class="text-sm text-gray-600 mt-1">All tasks in this project</p>
          </div>
        </div>

        <!-- Loading State for Tasks -->
        <div v-if="isPending" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-gray-50 rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div class="flex gap-2">
              <div class="h-6 bg-gray-200 rounded w-20"></div>
              <div class="h-6 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>

        <!-- Tasks List (Scrollable) -->
        <div
          v-else-if="tasks.length > 0"
          class="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2"
        >
          <div
            v-for="task in tasks"
            :key="task.id"
            class="group bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ task.name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide"
                    :class="
                      task.status === 'OPEN'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    "
                  >
                    {{ task.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ task.description }}</p>
              </div>
              
              <div class="ml-4 text-right">
                <p class="text-sm text-gray-500 mb-1">Price</p>
                <p class="text-2xl font-bold text-gray-900">${{ task.price }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span
                v-for="skill in task.skills"
                :key="skill"
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <OhVueIcon name="bi-list-task" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">No tasks yet</h3>
          <p class="text-sm text-gray-600">Get started by adding your first task to this project.</p>
        </div>
      </div>
    </div>
  </div>
</template>