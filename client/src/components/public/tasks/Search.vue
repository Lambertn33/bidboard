<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

const props = defineProps<{
  searchQuery: string;
}>();

const emits = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'search'): void;
}>();

const model = computed({
  get: () => props.searchQuery,
  set: (value: string) => emits('update:searchQuery', value),
});

const triggerSearch = () => emits('search');
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <OhVueIcon name="gi-magnifying-glass" class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="model"
          type="text"
          placeholder="Search by name, skills, or summary..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  </div>
</template>