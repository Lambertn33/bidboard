<script setup lang="ts">
import type { TaskBid } from '@/composables/useFetchTask';
import { computed } from 'vue';

const props = defineProps<{
    bids: TaskBid[];
}>();

const totalBids = computed(() => props.bids.length);

const getBidStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};
</script>

<template>
         <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Bids</h2>
              <span class="text-sm text-gray-600">{{ totalBids }} bid(s)</span>
            </div>

            <div v-if="bids.length === 0" class="text-center py-12">
              <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 class="text-sm font-semibold text-gray-900 mb-1">No Bids Yet</h3>
              <p class="text-sm text-gray-600">No freelancers have submitted bids for this task.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="bid in bids"
                :key="bid.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                        :class="getBidStatusColor(bid.status)"
                      >
                        {{ bid.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1">
                      by
                      <span class="font-medium text-gray-900">{{ bid.freelancer.user.names }}</span>
                    </p>
                    <p class="text-sm text-gray-700 mt-2">{{ bid.message }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div class="text-xs text-gray-500">
                    <p>{{ bid.freelancer.user.email }}</p>
                    <p v-if="bid.freelancer.telephone">{{ bid.freelancer.telephone }}</p>
                  </div>
                  <div v-if="bid.status === 'PENDING'" class="flex gap-2">
                    <button
                      class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <OhVueIcon name="hi-check-circle" class="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <OhVueIcon name="hi-x" class="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
</template>