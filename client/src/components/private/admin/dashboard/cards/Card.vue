<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
  icon: string;
  iconColor: string;
}>();
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600">{{ title }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="iconColor">
                <OhVueIcon :name="icon" class="w-6 h-6 text-black" />
            </div>
        </div>
    </div>
</template>