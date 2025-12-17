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
  <aside class="bg-white/95 rounded-2xl border border-slate-200 shadow-md p-5 self-start space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-bold">Projects</p>
      </div>
      <button
        v-if="projects.length > 0"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
        @click="handleClear"
      >
        Clear
      </button>
    </div>

    <div class="space-y-3">
      <div v-if="isProjectsLoading" class="space-y-2">
        <div class="h-4 bg-slate-100 rounded animate-pulse"></div>
        <div class="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
      </div>

      <div v-else-if="isProjectsError" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
        <div class="flex items-center justify-between">
          <span>Failed to load projects.</span>
          <button class="text-blue-600 font-semibold" @click="handleRetry">Retry</button>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-3">
        No projects available.
      </div>

      <div v-else class="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
        <label
          v-for="project in projects"
          :key="project.id"
          class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-slate-900 rounded-lg px-3 py-2 border border-transparent hover:border-blue-100 transition"
        >
          <input
            type="radio"
            class="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            :value="project.id"
            v-model="selected"
          />
          <span class="line-clamp-2">{{ project.name }}</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-slate-900 rounded-lg px-3 py-2 border border-transparent hover:border-blue-100 transition">
          <input
            type="radio"
            class="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            :value="null"
            v-model="selected"
          />
          <span>All projects</span>
        </label>
      </div>
    </div>
  </aside>
</template>