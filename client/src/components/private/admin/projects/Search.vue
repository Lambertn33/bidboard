<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  searchQuery: string;
}>();

const emits = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
}>();

// Create a v-model bridge to emit updates
const model = computed({
  get: () => props.searchQuery,
  set: (value: string) => emits('update:searchQuery', value),
});
</script>

<template>
  <div class="mb-6">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <OhVueIcon name="gi-magnifying-glass" class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="model"
        type="text"
        placeholder="Search projects by name or description..."
        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  </div>
</template>