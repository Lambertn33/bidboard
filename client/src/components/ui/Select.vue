<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder?: string;
  modelValue: string | number | null;
  required: boolean;
  id: string;
  options: SelectOption[] | string[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();

const selectClass = computed(() => {
  return [
    'block w-full',
    'pl-3 pr-10',
    'py-3 border border-gray-300 rounded-lg',
    'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'outline-none transition-colors',
    'text-gray-900 bg-white',
    'appearance-none cursor-pointer',
    props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : '',
  ];
});

const normalizedOptions = computed(() => {
  if (props.options.length === 0) return [];
  
  // If options are strings, convert to { value, label } format
  if (typeof props.options[0] === 'string') {
    return (props.options as string[]).map((opt) => ({
      value: opt,
      label: opt,
    }));
  }
  
  return props.options as SelectOption[];
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  
  // Convert to number if the option value is a number
  const selectedOption = normalizedOptions.value.find((opt) => String(opt.value) === value);
  if (selectedOption && typeof selectedOption.value === 'number') {
    emit('update:modelValue', selectedOption.value);
  } else {
    emit('update:modelValue', value || null);
  }
};
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue ?? ''"
        @change="handleChange"
        :required="required"
        :disabled="disabled"
        :class="selectClass"
      >
        <option disabled selected value="">
          {{ placeholder }}
        </option>
        <option
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Dropdown arrow icon -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        :class="disabled ? 'opacity-60' : ''"
      >
        <OhVueIcon name="hi-arrow-down" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </div>
</template>

