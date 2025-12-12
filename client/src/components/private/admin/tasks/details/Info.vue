<script setup lang="ts">
    import type { TaskData } from '@/composables/useFetchTask'; 
    import { getStartTimeInDays } from '@/reusables';
    import { computed } from 'vue';

    const props = defineProps<{
        task: TaskData;
    }>();

    const createdAtAgo = computed(() => getStartTimeInDays(props.task?.createdAt || ''));
    const updatedAtAgo = computed(() => getStartTimeInDays(props.task?.updatedAt || ''));
</script>

<template>
     <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Task Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Price</p>
                <p class="text-3xl font-bold text-gray-900">${{ task.price }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-2">Skills Required</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in task.skills"
                    :key="skill"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Project</p>
                <router-link
                  :to="`/admin/projects/${task.project.id}`"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <OhVueIcon name="bi-folder-fill" class="h-4 w-4" />
                  <span class="font-medium">{{ task.project.name }}</span>
                </router-link>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Created</p>
                  <p class="text-sm text-gray-900">{{ createdAtAgo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                  <p class="text-sm text-gray-900">{{ updatedAtAgo }}</p>
                </div>
              </div>
            </div>
          </div>
</template>