<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import Work from './Work.vue';

interface IWork {
    id: string;
    task: {
        id: string;
        name: string;
    };
    freelancer: {
        id: string;
        telephone: string;
        user: {
            id: string;
            names: string;
        };
    };
    startDate: string;
    endDate: string;
    completionUrl: string | null;
    status: "COMPLETED" | "IN_PROGRESS";
    createdAt: string;
  }

interface Props {
    works?: IWork[];
    loading: boolean;
    error?: Error | null;
}

const props = withDefaults(defineProps<Props>(), {
    works: () => [],
    error: null,
});

const emit = defineEmits<{
    (e: 'refetchRecentWorks'): void;
}>();
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="space-y-4">
    <div
      v-for="i in 4"
      :key="i"
      class="p-4 bg-gray-50 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
          <div class="flex items-center gap-4 mt-2">
            <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div class="h-3 bg-gray-200 rounded w-20 mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <OhVueIcon name="hi-x-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-red-900 mb-1">Failed to Load Works</h3>
        <p class="text-xs text-red-700 mb-3">
          {{ error instanceof Error ? error.message : 'An error occurred while loading recent works.' }}
        </p>
        <button
          @click="$emit('refetchRecentWorks')"
          class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <OhVueIcon name="co-reload" class="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="!works || works.length === 0" class="text-center py-8">
    <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
    <h3 class="text-sm font-semibold text-gray-900 mb-1">No Recent Works</h3>
    <p class="text-xs text-gray-600">No works have been submitted yet.</p>
  </div>

  <!-- Data State -->
  <div v-else class="space-y-4">
    <Work v-for="work in works" :key="work.id" :work="work" />
  </div>
</template>