<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useFetchTask } from '@/composables/useFetchTask';
import { useRoute } from 'vue-router';

import { DetailsLoading, DetailsError, DetailsInfo, DetailsBids, DetailsWork, DetailsStats } from '@/components/private/admin/tasks';

const route = useRoute();

const { isPending, isError, taskData, errorMessage, refetch } = useFetchTask(route.params.id as string);

const task = computed(() => taskData.value);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    ASSIGNED: 'bg-blue-50 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};


const totalBids = computed(() => task.value?.bids.length ?? 0);
const pendingBidsCount = computed(
  () => task.value?.bids.filter((b) => b.status === 'PENDING').length ?? 0,
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-link
          to="/admin/tasks"
          class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer hover:text-blue-600"
        >
          <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
          <span class="text-sm font-medium">Back to Tasks</span>
        </router-link>

        <div class="flex items-start justify-between mt-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100">
                <OhVueIcon name="bi-list-task" class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div v-if="isPending" class="h-8 w-48 rounded-md bg-gray-200 animate-pulse"></div>
                <h1 v-else class="text-3xl font-bold text-gray-900">{{ task?.name }}</h1>
              </div>
              <span
                v-if="!isPending && task?.status"
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                :class="getStatusColor(task?.status || '')"
              >
                {{ task?.status }}
              </span>
            </div>
            <p class="mt-3 text-gray-700 max-w-3xl">
              <span v-if="isPending" class="inline-block h-4 w-80 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ task?.description }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <DetailsLoading v-if="isPending" />

      <!-- Error State -->
      <DetailsError v-else-if="isError" :errorMessage="errorMessage" @refetch="refetch" />

      <!-- Data State -->
      <div v-else-if="task" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Task Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Task Information Card -->
          <DetailsInfo v-if="task" :task="task" />

          <!-- Work Assignment Card (if work exists) -->
          <DetailsWork v-if="task.work" :work="task.work" />

          <!-- Bids Section -->
          <DetailsBids v-if="task" :bids="task.bids" />
        </div>

        <!-- Right Column: Stats -->
        <DetailsStats v-if="task" :totalBids="totalBids" :pendingBidsCount="pendingBidsCount" :taskStatus="task.status" />
      </div>

      <!-- Fallback for no data -->
      <div v-else class="text-center text-gray-600">No task data available.</div>
    </div>
  </div>
</template>