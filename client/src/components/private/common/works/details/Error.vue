<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';

defineProps<{
  errorMessage: string;
}>();

defineEmits<{
  (e: 'refetch'): void;
}>();
</script>

<template>
  <div class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 max-w-3xl">
    <OhVueIcon name="hi-exclamation-circle" class="h-6 w-6 text-red-600 flex-shrink-0" />
    <div class="flex-1">
      <h3 class="text-base font-semibold text-red-900 mb-1">Failed to load work</h3>
      <p class="text-sm text-red-700 mb-3">{{ errorMessage || 'An error occurred while loading work data.' }}</p>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        @click="$emit('refetch')"
      >
        <OhVueIcon name="co-reload" class="h-4 w-4" />
        Retry
      </button>
    </div>
  </div>
</template>

