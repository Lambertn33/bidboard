<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import { useRoute } from 'vue-router';
import {
  DetailsCard,
  DetailsLoading,
  DetailsTasksLoading,
  DetailsTasksList,
  DetailsError,
} from '@/components/private/admin/projects';
import { useFetchProject } from '@/composables/useFetchProject';

const route = useRoute();

const {
  isPending,
  isError,
  projectData,
  projectName,
  projectDescription,
  tasks,
  tasksCount,
  errorMessage,
  refetch,
} = useFetchProject(route.params.id as string);
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
        <DetailsLoading v-if="isPending" />

        <!-- Error State -->
       <DetailsError v-else-if="isError" :errorMessage="errorMessage" @refetch="refetch" />

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
      <DetailsCard label="Total Tasks" :tasksCount="tasksCount" />
      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Tasks</h2>
            <p class="text-sm text-gray-600 mt-1">All tasks in this project</p>
          </div>
        </div>

        <!-- Loading State for Tasks -->
        <DetailsTasksLoading v-if="isPending" :count="3" />

        <!-- Tasks List (Scrollable) -->
        <DetailsTasksList v-else-if="tasks.length > 0" :tasks="tasks" />

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