<script setup lang="ts">

defineProps<{
    count: number;
}>();
</script>

<template>
    <div class="space-y-4">
        <div
            v-for="i in count"
            :key="i"
            class="bg-gray-50 rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div class="flex gap-2">
              <div class="h-6 bg-gray-200 rounded w-20"></div>
              <div class="h-6 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    </div>
</template>