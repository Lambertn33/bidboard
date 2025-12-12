<script setup lang="ts">
import { computed, ref } from 'vue';
import Input from '@/components/ui/Input.vue';
import TextArea from '@/components/ui/TextArea.vue';

const emit = defineEmits<{
  (e: 'createProject', payload: { name: string; description: string }): void;
}>();

const props = defineProps<{
  isCreatingProjectPending: boolean;
}>();

const form = ref({
  name: '',
  description: '',
});

const isSubmitDisabled = computed(() => !form.value.name.trim() || !form.value.description.trim());

const handleSubmit = () => {
  emit('createProject', {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
  });
  // Don't reset here - wait for success from parent
};

const handleReset = () => {
  form.value = { name: '', description: '' };
};

// Expose reset method to parent component
defineExpose({
  reset: handleReset,
});
</script>

<template>
  <div class="bg-white rounded-2xl p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projects</p>
        <h2 class="text-xl font-bold text-gray-900">Create Project</h2>
      </div>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <Input
        id="project-name"
        label="Project Name"
        type="text"
        placeholder="Enter project name"
        :modelValue="form.name"
        :required="true"
        :hasPreIcon="false"
        @update:modelValue="(value: string) => (form.name = value)"
      />

      <TextArea
        id="project-description"
        label="Description"
        placeholder="Write a short description..."
        :modelValue="form.description"
        :required="false"
        @update:modelValue="(value: string) => (form.description = value)"
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="isSubmitDisabled || isCreatingProjectPending"
          class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ isCreatingProjectPending ? 'Please wait...' : 'Create Project' }}
        </button>
        <button
          type="button"
          class="inline-flex justify-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          @click="handleReset"
        >
          Clear
        </button>
      </div>
    </form>
  </div>
</template>