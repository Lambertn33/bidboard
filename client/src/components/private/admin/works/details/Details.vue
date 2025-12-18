<script setup lang="ts">
import { formatDate, getStartTimeInDays } from '@/reusables';
import { computed } from 'vue';

    const props = defineProps<{
        workStatus: "IN_PROGRESS" | "COMPLETED";
        workStartDate: string;
        workEndDate: string;
        workCompletionUrl: string | null;
        workTaskName: string;
        workTaskDescription: string;
    }>();

    const formattedStatus = computed(() => {
        return props.workStatus === 'IN_PROGRESS' ? 'In Progress' : 'Completed';
    });

    const formattedStartDate = computed(() => {
        return formatDate(props.workStartDate);
    });

    const formattedEndDate = computed(() => {
        return formatDate(props.workEndDate);
    });

    const startDateAgo = computed(() => {
        return getStartTimeInDays(props.workStartDate);
    });

    const endDateAgo = computed(() => {
        return getStartTimeInDays(props.workEndDate);
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
    <div class="lg:col-span-2 space-y-6">
          <!-- Work Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Work Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  :class="getStatusColor(workStatus)"
                >
                  {{ formattedStatus }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Start Date</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formattedStartDate }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ startDateAgo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">End Date</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formattedEndDate }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ endDateAgo }}</p>
                </div>
              </div>

              <div v-if="workCompletionUrl" class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-500 mb-2">Completion URL</p>
                <a
                  :href="workCompletionUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  <OhVueIcon name="hi-link" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ workCompletionUrl }}</span>
                </a>
              </div>
              <div v-else class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-500 mb-1">Completion URL</p>
                <p class="text-sm text-gray-400 italic">Not yet provided</p>
              </div>
            </div>
          </div>

          <!-- Task Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Task Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Task Name</p>
                <p class="text-lg font-semibold text-gray-900">{{ workTaskName }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p class="text-sm text-gray-700">{{ workTaskDescription }}</p>
              </div>
            </div>
          </div>
        </div>
</template>