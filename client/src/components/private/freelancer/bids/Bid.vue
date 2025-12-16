<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {TextArea} from "@/components/ui";

    const emit = defineEmits<{
      (e: 'makeBid', message: string): void;
    }>();
    
    const props = defineProps<{
      isMakingBidPending: boolean;
      task: {
        name: string | undefined;
        skills: string[] | undefined;
      };
      disabled?: boolean;
      disabledReason?: string;
    }>();

    const form = ref<{
      message: string;
    }>({
      message: '',
    });
    
    const isSubmitDisabled = computed(() => !form.value.message.trim() || !!props.disabled);
    
    const handleSubmit = () => {
      emit('makeBid', form.value.message.trim());
    };
    
    </script>
    
    <template>
      <div class="bg-white rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Make Bid on Task: {{ task?.name }}</h2>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-900">Task Skills</h3>
          <div
              v-for="skill in task?.skills"
              :key="skill"
              class="inline-flex items-center mx-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
            >
              <span>{{ skill }}</span>
            </div>
        </div>
        <div v-if="disabled" class="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          {{ disabledReason || 'You cannot make a bid for this task.' }}
        </div>

        <form class="space-y-5 mt-4" @submit.prevent="handleSubmit" v-if="!disabled">
          <TextArea
            id="message"
            label="Message"
            placeholder="Write a short message..."
            :modelValue="form.message"
            :required="true"
            @update:modelValue="(value: string) => (form.message = value)"
          />

    
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isSubmitDisabled || isMakingBidPending"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isMakingBidPending ? 'Please wait...' : 'Make Bid' }}
            </button>
          </div>
        </form>
      </div>
    </template>