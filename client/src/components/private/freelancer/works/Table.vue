<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import { Pagination } from '@/components/ui';
import { formatDate } from '@/reusables';

interface IFreelancerWork {
  id: string;
  task: {
    id: string;
    name: string;
  };
  payment: {
    status: "UNPAID" | "PAID";
    amount?: number;
  };
  startDate: string;
  endDate: string;
  completionUrl: string | null;
  status: "COMPLETED" | "IN_PROGRESS";
}

const props = defineProps<{
  works: IFreelancerWork[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  limit: number;
}>();

const emits = defineEmits<{
  (e: 'goToPage', page: number): void;
  (e: 'goToPreviousPage'): void;
  (e: 'goToNextPage'): void;
  (e: 'update:limit', value: number): void;
}>();

const goToPage = (page: number) => emits('goToPage', page);
const goToPreviousPage = () => emits('goToPreviousPage');
const goToNextPage = () => emits('goToNextPage');
const updateLimit = (value: number) => emits('update:limit', value);

const getWorkStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-yellow-50 text-yellow-700 border border-yellow-200';
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    UNPAID: 'bg-red-50 text-red-700 border border-red-200',
    PAID: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-red-50 text-red-700 border border-red-200';
};

const formattedAmount = (amount?: number) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Work Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Amount
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="work in works"
            :key="work.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                  <OhVueIcon name="bi-list-task" class="h-5 w-5 text-blue-600" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ work.task.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getWorkStatusColor(work.status)">
                {{ work.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium">
                {{ formatDate(work.startDate) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium">
                {{ formatDate(work.endDate) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getPaymentStatusColor(work.payment.status)">
                {{ work.payment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <OhVueIcon name="hi-currency-dollar" class="h-4 w-4 text-gray-400" />
                <span class="font-semibold text-gray-900">{{ formattedAmount(work.payment.amount) }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-3">
                <router-link
                  :to="`/freelancer/works/${work.id}`"
                  class="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                  title="View work details"
                >
                  <OhVueIcon name="hi-eye" class="h-5 w-5" />
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="works.length === 0" class="text-center py-12">
      <OhVueIcon name="bi-briefcase" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-sm font-semibold text-gray-900 mb-1">No works found</h3>
      <p class="text-sm text-gray-600">You don't have any assigned work at the moment.</p>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="works.length > 0"
      :meta="meta"
      :has-previous-page="hasPreviousPage"
      :has-next-page="hasNextPage"
      :limit="limit"
      @goToPage="goToPage"
      @goToPreviousPage="goToPreviousPage"
      @goToNextPage="goToNextPage"
      @update:limit="updateLimit"
    />
  </div>
</template>

