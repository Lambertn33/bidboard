<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import Pagination from './Pagination.vue';

interface IProject {
  id: string;
  name: string;
  description: string;
  _count: {
    tasks: number;
  };
  createdAt: string;
}

const props = defineProps<{
  projects: IProject[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  limit: number;
  formatDate: (date: string) => string;
}>();

const emits = defineEmits<{
  (e: 'goToPage', page: number): void;
  (e: 'goToPreviousPage'): void;
  (e: 'goToNextPage'): void;
  (e: 'update:limit', value: number): void;
}>();

const goToPage = (page: number) => emits('goToPage', page);
const goToPreviousPage = () => emits('goToPreviousPage');
const goToNextPage = () => emits('goToNextPage');
const updateLimit = (value: number) => emits('update:limit', value);
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="project in projects"
                :key="project.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                      <OhVueIcon name="bi-folder-fill" class="h-5 w-5 text-blue-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 max-w-md truncate" :title="project.description">
                    {{ project.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-900">
                    <OhVueIcon name="bi-list-task" class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="font-medium">{{ project._count.tasks }}</span>
                    <span class="text-gray-500 ml-1">{{ project._count.tasks === 1 ? 'task' : 'tasks' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(project.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button class="text-blue-600 hover:text-blue-900 transition-colors">
                      <OhVueIcon name="hi-eye" class="h-5 w-5" />
                    </button>
                    <button class="text-gray-600 hover:text-gray-900 transition-colors">
                      <OhVueIcon name="hi-pencil" class="h-5 w-5" />
                    </button>
                    <button class="text-red-600 hover:text-red-900 transition-colors">
                      <OhVueIcon name="hi-trash" class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="projects.length === 0" class="text-center py-12">
          <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">No projects found</h3>
          <p class="text-sm text-gray-600">Try adjusting your search query.</p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="projects.length > 0"
          :meta="meta"
          :has-previous-page="hasPreviousPage"
          :has-next-page="hasNextPage"
          :limit="limit"
          @goToPage="goToPage"
          @goToPreviousPage="goToPreviousPage"
          @goToNextPage="goToNextPage"
          @update:limit="updateLimit"
        />
      </div>
</template>