<script setup lang="ts">
interface ITask {
    id: string;
    name: string;
    description: string;
    status: string;
    project: {
        id: string;
        name: string;
    };
    price: number;
    skills: string[];
}

defineProps<{
    task: ITask;
}>();
</script>

<template>
    <div
        class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
        <div class="p-8">
            <!-- Header Row -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {{ task.name }}
                        </h2>
                        <span
                            class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
                            :class="task.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-700 border border-gray-200'"
                        >
                            {{ task.status }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <OhVueIcon name="bi-folder-fill" class="h-4 w-4 text-blue-500" />
                        <span class="font-medium">{{ task.project.name }}</span>
                    </div>
                </div>
                
                <!-- Price -->
                <div class="ml-4 text-right">
                    <div class="text-sm text-gray-500 mb-1">Budget</div>
                    <div class="text-3xl font-bold text-gray-900">${{ task.price }}</div>
                </div>
            </div>

            <!-- Skills and Action -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100">
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="skill in task.skills"
                        :key="skill"
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        {{ skill }}
                    </span>
                </div>
                
                <button
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                >
                    <span>Read Description</span>
                    <OhVueIcon name="hi-arrow-down" class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>

