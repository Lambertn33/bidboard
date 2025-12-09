<script setup lang="ts">
import { computed } from 'vue';

interface Project {
  id: string;
  name: string;
}

const props = defineProps<{
  projects: Project[];
  isProjectsLoading: boolean;
  isProjectsError: boolean;
  selectedProjectId: string | null;
}>();

const emits = defineEmits<{
  (e: 'update:selectedProjectId', value: string | null): void;
  (e: 'clear'): void;
  (e: 'refetchProjects'): void;
}>();

const selected = computed({
  get: () => props.selectedProjectId,
  set: (value: string | null) => emits('update:selectedProjectId', value),
});

const handleClear = () => emits('clear');
const handleRetry = () => emits('refetchProjects');
</script>

<template>
  <aside class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 self-start">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
      <button
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        @click="handleClear"
      >
        Clear
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <p class="text-sm font-semibold text-gray-800 mb-2">Projects</p>
        <div v-if="isProjectsLoading" class="space-y-2">
          <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          <div class="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
        </div>
        <div v-else-if="isProjectsError" class="text-sm text-red-600">
          Failed to load projects.
          <button class="text-blue-600 font-medium ml-1" @click="handleRetry">Retry</button>
        </div>
        <div v-else class="space-y-2 max-h-64 overflow-y-auto pr-1">
          <label
            v-for="project in projects"
            :key="project.id"
            class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
          >
            <input
              type="radio"
              class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              :value="project.id"
              v-model="selected"
            />
            <span class="line-clamp-2">{{ project.name }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
            <input
              type="radio"
              class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              :value="null"
              v-model="selected"
            />
            <span>All projects</span>
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>