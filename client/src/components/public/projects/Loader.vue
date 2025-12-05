<script setup lang="ts">

defineProps<{
    count: number;
}>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-pulse"
        >
          <div class="p-6">
            <div class="h-7 bg-gray-200 rounded mb-3"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="h-5 bg-gray-200 rounded w-24"></div>
              <div class="h-5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
</template>