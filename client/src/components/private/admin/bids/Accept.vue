<script setup lang="ts">
    import { computed, ref } from 'vue';

    import {DateInput} from "@/components/ui";

    const emit = defineEmits<{
      (e: 'acceptBid', payload: { bidId: string; endDate: string }): void;
    }>();
    
    const form = ref<{
      endDate: string;
    }>({
      endDate: '',
    });

    const isSubmitDisabled = computed(() => !form.value.endDate.trim());

    const minDate = computed(() => new Date().toISOString().split('T')[0]);

    const props = defineProps<{
      bidId: string;
      bidMessage: string;
      bidFreelancerName: string;
      bidTaskName: string;
      isAcceptingBidPending: boolean;
    }>();
    
    
    
    const handleSubmit = () => {
      emit('acceptBid', {
        bidId: props.bidId,
        endDate: form.value.endDate,
      });
      // Don't reset here - wait for success from parent
    };
    
    const handleReset = () => {
      form.value = { endDate: '' };
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
            <h2 class="text-xl font-bold text-gray-900">Accept Bid for Task: {{ bidTaskName }}</h2>
            <p class="text-sm text-gray-600 mb-2">
                by 
                <span class="font-bold text-gray-900">
                    {{ bidFreelancerName }}
                </span>
            </p>
          </div>
        </div>

        <div class="flex flex-col items-start gap-1 border border-gray-200 p-4 rounded-lg bg-gray-50 mb-8">
            <span class="font-medium text-gray-600">Message:</span>
            <p class="font-bold text-gray-900">
                {{ bidMessage }}
            </p>
        </div>
    
        <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="flex-1">
            <DateInput
                id="end-date"
                label="Select Task End Date"
                :modelValue="form.endDate"
                :required="true"
                :minDate="minDate"
                :hasPreIcon="false"
                @update:modelValue="(value: string) => (form.endDate = value)"
            />
            </div>

    
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isAcceptingBidPending || isSubmitDisabled"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isAcceptingBidPending ? 'Please wait...' : 'Accept Bid' }}
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