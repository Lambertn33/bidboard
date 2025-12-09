<script setup lang="ts">
    defineProps<{
        label: string;
        tasksCount: number;
    }>();

</script>

<template>
     <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100">
              <OhVueIcon name="bi-list-task" class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ tasksCount }}</p>
            </div>
          </div>
        </div>
      </div>
</template>