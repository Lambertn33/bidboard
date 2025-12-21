<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {Input} from "@/components/ui";

    
    const emit = defineEmits<{
      (e: 'submitWork', workCompletionUrl: string): void;
    }>();
    
    const props = defineProps<{
      isSubmittingWorkPending: boolean;
    }>();
    
    const form = ref<{
    workCompletionUrl: string;
    }>({
      workCompletionUrl: '',
    });
    
    const isSubmitDisabled = computed(() => !form.value.workCompletionUrl.trim());
    
    const handleSubmit = () => {
      emit('submitWork', form.value.workCompletionUrl.trim());
    };

    </script>
    
    <template>
      <div class="bg-white rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Submit Work</h2>
          </div>
        </div>
    
        <form class="space-y-5" @submit.prevent="handleSubmit">
            <Input
              id="work-completion-url"
              label="Completion URL"
              type="url"
              placeholder="Enter completion URL"
              :modelValue="form.workCompletionUrl"
              :required="true"
              :hasPreIcon="true"
              preIcon="hi-link"
              @update:modelValue="(value: string) => (form.workCompletionUrl = value)"
            />
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isSubmitDisabled || isSubmittingWorkPending"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmittingWorkPending ? 'Please wait...' : 'Submit Work' }}
            </button>
          </div>
        </form>
      </div>
    </template>