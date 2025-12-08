<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import Bid from './Bid.vue';

import { IBid } from '@/views/private/admin/dashboard/DashboardView';

interface Props {
    bids?: IBid[];
    loading: boolean;
    error?: Error | null;
}

const props = withDefaults(defineProps<Props>(), {
    bids: () => [],
    error: null,
});

const emit = defineEmits<{
    refetchRecentBids: [];
}>();
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="space-y-4">
    <div
      v-for="i in 5"
      :key="i"
      class="p-4 bg-gray-50 rounded-lg"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div class="h-3 bg-gray-200 rounded w-20 mt-2 animate-pulse"></div>
        </div>
        <div class="ml-4 flex gap-2">
          <div class="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <OhVueIcon name="hi-x-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-red-900 mb-1">Failed to Load Bids</h3>
        <p class="text-xs text-red-700 mb-3">
          {{ error instanceof Error ? error.message : 'An error occurred while loading recent bids.' }}
        </p>
        <button
          v-if="refetchRecentBids"
          @click="refetchRecentBids"
          class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <OhVueIcon name="co-reload" class="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="!bids || bids.length === 0" class="text-center py-8">
    <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
    <h3 class="text-sm font-semibold text-gray-900 mb-1">No Recent Bids</h3>
    <p class="text-xs text-gray-600">No bids have been submitted yet.</p>
  </div>

  <!-- Data State -->
  <div v-else class="space-y-4">
    <Bid v-for="bid in bids" :key="bid.id" :bid="bid" />
  </div>
</template>