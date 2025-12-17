<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';

interface ITask {
    id: string;
    name: string;
    status: "OPEN" | "ASSIGNED" | "COMPLETED";
    project: {
        id: string;
        name: string;
    };
    price: number;
    bids: number;
  }

defineProps<{
    task: ITask;
}>();

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      ASSIGNED: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

</script>

<template>
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex-1">
            <div class="flex items-center gap-3">
                <h3 class="font-medium text-gray-900">{{ task.name }} ldld</h3>
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(task.status)]">
                    {{ task.status }}
                </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ task.project.name }}</p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                    <OhVueIcon name="hi-currency-dollar" class="w-4 h-4" />
                    {{ task.price }}
                </span>
                <span class="flex items-center gap-1">
                    <OhVueIcon name="hi-document-text" class="w-4 h-4" />
                    {{ task.bids }} bids
                </span>
            </div>
        </div>
    </div>
</template>