<script lang="ts" setup>
    import { computed } from 'vue';
    import type { TaskWork } from '@/composables/useFetchTask';
import { getStartTimeInDays } from '@/reusables';

    const props = defineProps<{
        work: TaskWork;
    }>();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200',
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
    };

    const formattedStatus = computed(() => props.work.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed');

    const timeAgo = computed(() => getStartTimeInDays(props.work.startDate));

    const endDate = computed(() => getStartTimeInDays(props.work.endDate));
</script>

<template>
     <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Assigned Work</h2>
              <span
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                :class="getStatusColor(work.status)"
              >
                {{ formattedStatus }}
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Freelancer</p>
                <div class="mt-2 space-y-2">
                  <p class="text-sm font-semibold text-gray-900">{{ work.freelancer.user.names }}</p>
                  <p class="text-sm text-gray-600">{{ work.freelancer.user.email }}</p>
                  <p class="text-sm text-gray-600">{{ work.freelancer.telephone }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-bold text-gray-500 mb-1">Start Date</p>
                  <p class="text-sm text-gray-600">{{ timeAgo }}</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-500 mb-1">End Date</p>
                  <p class="text-sm text-gray-600">{{ endDate }}</p>
                </div>
               </div>

              <div v-if="work.completionUrl">
                <p class="text-sm font-medium text-gray-500 mb-2">Completion URL</p>
                <a
                  :href="work.completionUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  <OhVueIcon name="hi-link" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ work.completionUrl }}</span>
                </a>
              </div>
            </div>
          </div>
</template>