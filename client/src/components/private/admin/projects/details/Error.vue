<script setup lang="ts">
    defineProps<{
        errorMessage: string;
    }>();

    defineEmits<{
        refetch: [];
    }>();
</script>

<template>
    <div class="py-8">
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-2">
              <OhVueIcon name="hi-exclamation-circle" class="h-6 w-6 text-red-600" />
              <h3 class="text-lg font-semibold text-red-900">Error Loading Project</h3>
            </div>
            <p class="text-red-700 mb-4">{{ errorMessage }}</p>
            <button
              @click="$emit('refetch')"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
</template>