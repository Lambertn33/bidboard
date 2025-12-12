<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import Pagination from './Pagination.vue';

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

const props = defineProps<{
  tasks: ITask[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  limit: number;
}>();

const emits = defineEmits<{
  (e: 'goToPage', page: number): void;
  (e: 'goToPreviousPage'): void;
  (e: 'goToNextPage'): void;
  (e: 'update:limit', value: number): void;
  (e: 'open-editing-modal', taskId: string): void;
}>();

const goToPage = (page: number) => emits('goToPage', page);
const goToPreviousPage = () => emits('goToPreviousPage');
const goToNextPage = () => emits('goToNextPage');
const updateLimit = (value: number) => emits('update:limit', value);
const openEditingModal = (taskId: string) => emits('open-editing-modal', taskId as string);

const getTaskStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    ASSIGNED: 'bg-blue-50 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 border border-gray-200';
};
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Description
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Price
                </th>

                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Status
                </th>

                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="task in tasks"
                :key="task.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                      <OhVueIcon name="bi-folder-fill" class="h-5 w-5 text-blue-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ task.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 max-w-md truncate" :title="task.description">
                    {{ task.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getTaskStatusColor(task.status)">
                    {{ task.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-900">
                    <span class="font-medium">${{ task.price }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <router-link :to="`/admin/projects/${task.project.id}`" class="text-blue-600 hover:text-blue-900 transition-colors">
                    {{ task.project.name }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-3">
                    <router-link :to="`/admin/tasks/${task.id}`" class="text-blue-600 hover:text-blue-900 transition-colors">
                      <OhVueIcon name="hi-eye" class="h-5 w-5" />
                    </router-link>
                    <button v-if="task.status === 'OPEN'" class="text-gray-600 hover:text-gray-900 transition-colors" @click="openEditingModal(task.id)">
                      <OhVueIcon name="hi-pencil" class="h-5 w-5" />
                    </button>
                    <button v-if="task.status === 'OPEN'" class="text-gray-600 hover:text-gray-900 transition-colors">
                      <OhVueIcon name="hi-trash" class="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="tasks.length === 0" class="text-center py-12">
          <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">No tasks found</h3>
          <p class="text-sm text-gray-600">Try adjusting your search query.</p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="tasks.length > 0"
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