<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

defineOptions({
  inheritAttrs: false,
});

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  modelValue: string;
  required: boolean;
  id: string;
  hasPreIcon: boolean;
  preIcon?: string;
}

const props = defineProps<InputProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputClass = computed(() => {
  return [
    'block w-full',
    props.hasPreIcon ? 'pl-10' : 'pl-3',
    'py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400',
  ];
});

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
    <div>
        <label :for="id" class="block text-sm font-semibold text-gray-700 mb-2">
            {{ label }}
        </label>
        <div class="relative">
            <div v-if="hasPreIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <OhVueIcon :name="preIcon" class="h-5 w-5 text-gray-400" />
            </div>
            <input
                v-bind="$attrs"
                :id="id"
                :value="modelValue"
                @input="handleInput"
                :type="type"
                :required="required"
                :placeholder="placeholder"
                :class="inputClass"
            />

        </div>
    </div>
</template>