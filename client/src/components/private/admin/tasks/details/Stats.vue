<script lang="ts" setup>
    
    defineProps<{
        totalBids: number;
        pendingBidsCount: number;
        rejectedBidsCount: number;
        taskStatus: 'OPEN' | 'ASSIGNED' | 'COMPLETED';
    }>();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            OPEN: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            ASSIGNED: 'bg-blue-50 text-blue-700 border border-blue-200',
            COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200',
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
    };

</script>

<template>
      <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Total Bids</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalBids }}</p>
              </div>
              <div v-if="taskStatus === 'OPEN'">
                <p class="text-sm text-gray-500 mb-1">Pending Bids</p>
                <p class="text-2xl font-bold text-yellow-600">
                  {{ pendingBidsCount }}
                </p>
              </div>
              <div v-if="taskStatus === 'OPEN'">
                <p class="text-sm text-gray-500 mb-1">Rejected Bids</p>
                <p class="text-2xl font-bold text-red-600">
                  {{ rejectedBidsCount }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  :class="getStatusColor(taskStatus)"
                >
                  {{ taskStatus }}
                </span>
              </div>
            </div>
          </div>
        </div>
</template>