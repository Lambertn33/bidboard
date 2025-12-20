<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import { Pagination } from '@/components/ui';

interface IFreelancerBid {
  id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  task: {
    id: string;
    name: string;
    description: string;
    status: 'OPEN' | 'ASSIGNED' | 'COMPLETED';
    price: number;
    project: {
      id: string;
      name: string;
    };
  };
}

const props = defineProps<{
  bids: IFreelancerBid[];
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
  (e: 'view-bid', bidId: string): void;
}>();

const goToPage = (page: number) => emits('goToPage', page);
const goToPreviousPage = () => emits('goToPreviousPage');
const goToNextPage = () => emits('goToNextPage');
const updateLimit = (value: number) => emits('update:limit', value);
const viewBid = (bidId: string) => emits('view-bid', bidId);

const getBidStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const getTaskStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: 'bg-blue-50 text-blue-700 border border-blue-200',
    ASSIGNED: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
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
              Project
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bid Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="bid in bids"
            :key="bid.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                  <OhVueIcon name="bi-list-task" class="h-5 w-5 text-blue-600" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ bid.task.name }}</div>
                  <div class="text-xs text-gray-500 truncate max-w-xs">{{ bid.task.description }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-purple-100">
                  <OhVueIcon name="bi-folder-fill" class="h-4 w-4 text-purple-600" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ bid.task.project.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getBidStatusColor(bid.status)">
                {{ bid.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getTaskStatusColor(bid.task.status)">
                {{ bid.task.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <OhVueIcon name="hi-currency-dollar" class="h-4 w-4 text-gray-400" />
                <span class="font-semibold text-gray-900">${{ bid.task.price }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-3">
                <button
                  @click="viewBid(bid.id)"
                  class="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                  title="View bid details"
                >
                  <OhVueIcon name="hi-eye" class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="bids.length === 0" class="text-center py-12">
      <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-sm font-semibold text-gray-900 mb-1">No bids found</h3>
      <p class="text-sm text-gray-600">You haven't placed any bids yet.</p>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="bids.length > 0"
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

