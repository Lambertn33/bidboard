<script setup lang="ts">
defineProps<{
    error: string;
}>();
</script>

<template>
    <div class="text-center py-12">
        <OhVueIcon name="bi-exclamation-triangle" class="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Projects</h3>
        <p class="text-gray-600 mb-4">
          {{ error }}
        </p>
        <button
          @click="$emit('refetch')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
</template>