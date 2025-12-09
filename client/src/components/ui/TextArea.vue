<script setup lang="ts">
    import { computed } from 'vue';
    
    interface TextAreaProps {
      label: string;
      placeholder: string;
      modelValue: string;
      required: boolean;
      id: string;
    }
    
    const props = defineProps<TextAreaProps>();
    
    const emit = defineEmits<{
      (e: 'update:modelValue', value: string): void;
    }>();
    
    const textAreaClass = computed(() => {
      return [
        'block w-full',
        'py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder-gray-400',
      ];
    });
    
    const handleTextArea = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
    };
    </script>
    
    <template>
        <div>
            <label :for="id" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ label }}
            </label>
            <div class="relative">
                <textarea
                    :id="id"
                    :value="modelValue"
                    @input="handleTextArea"
                    :required="required"
                    :placeholder="placeholder"
                    :class="textAreaClass"
                    rows="4"
                />
    
            </div>
        </div>
    </template>