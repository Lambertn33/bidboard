<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

const props = defineProps<{
  isPending: boolean;
  taskName: string;
  taskDescription: string;
  workStatus: "IN_PROGRESS" | "COMPLETED";
}>();

const formattedStatus = computed(() => {
  return props.workStatus === 'IN_PROGRESS' ? 'In Progress' : 'Completed';
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};
</script>

<template>
  <div class="bg-white border-b border-gray-200 sticky top-16 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-link
        to="/freelancer/works"
        class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer hover:text-blue-600"
      >
        <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
        <span class="text-sm font-medium">Back to Works</span>
      </router-link>

      <div class="flex items-start justify-between mt-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-100">
              <OhVueIcon name="bi-briefcase-fill" class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div v-if="isPending" class="h-8 w-48 rounded-md bg-gray-200 animate-pulse"></div>
              <h1 v-else class="text-3xl font-bold text-gray-900">{{ taskName }}</h1>
            </div>
            <span
              v-if="!isPending && workStatus"
              class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
              :class="getStatusColor(workStatus)"
            >
              {{ formattedStatus }}
            </span>
          </div>
          <p class="mt-3 text-gray-700 max-w-3xl">
            <span v-if="isPending" class="inline-block h-4 w-80 bg-gray-200 rounded animate-pulse"></span>
            <span v-else>{{ taskDescription }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

