<script setup lang="ts">
defineProps<{
    count?: number;
}>();
</script>

<template>
    <div class="space-y-6">
        <div
            v-for="n in (count || 5)"
            :key="n"
            class="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
            <div class="p-8">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="h-7 bg-gray-200 rounded mb-3 w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    </div>
                    <div class="h-16 w-20 bg-gray-200 rounded-lg"></div>
                </div>
                <div class="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                    <div class="h-6 bg-gray-200 rounded-lg w-16"></div>
                    <div class="h-6 bg-gray-200 rounded-lg w-20"></div>
                    <div class="h-6 bg-gray-200 rounded-lg w-24"></div>
                </div>
            </div>
        </div>
    </div>
</template>

