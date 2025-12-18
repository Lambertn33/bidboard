<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { formatDate, getStartTimeInDays } from '@/reusables';

const props = defineProps<{
  paymentAmount: number;
  paymentStatus: "UNPAID" | "PAID";
  paymentUpdatedAt: string;
}>();

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.paymentAmount);
});

const formattedDate = computed(() => formatDate(props.paymentUpdatedAt));
const dateAgo = computed(() => getStartTimeInDays(props.paymentUpdatedAt));

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    UNPAID: 'bg-red-50 text-red-700 border border-red-200',
    PAID: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const formattedStatus = computed(() => {
  return props.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid';
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">Payment</h3>
      <span
        class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
        :class="getPaymentStatusColor(paymentStatus)"
      >
        {{ formattedStatus }}
      </span>
    </div>

    <div class="space-y-4">
      <div>
        <p class="text-sm font-medium text-gray-500 mb-1">Amount</p>
        <p class="text-3xl font-bold text-gray-900">{{ formattedAmount }}</p>
      </div>

      <div class="pt-4 border-t border-gray-200" v-if="paymentStatus === 'PAID'">
        <p class="text-sm font-medium text-gray-500 mb-1">Paid on</p>
        <div class="flex items-center gap-2">
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ formattedDate }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

