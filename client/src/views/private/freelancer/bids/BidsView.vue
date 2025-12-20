<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { Table } from '@/components/private/freelancer/bids';
import { useFetchBids } from '@/composables/useFetchBids';
import { Modal } from '@/components/ui';

// Pagination state
const currentPage = ref(1);
const limit = ref(10);

// Reset page when page size changes
watch(limit, () => {
  currentPage.value = 1;
});

// Fetch bids using composable (should return only freelancer's bids)
const {
  bids,
  meta,
  isPending: isFetchingBids,
  isFetching: isBidsRefetching,
  isError: isFetchingBidsError,
  errorMessage: fetchBidsErrorMessage,
  refetch: refetchBids,
} = useFetchBids({
  currentPage,
  limit,
});

// Pagination helpers
const hasPreviousPage = computed(() => meta.value.currentPage > 1);
const hasNextPage = computed(() => meta.value.currentPage < meta.value.totalPages);

// Pagination handlers
const goToPage = (page: number) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    currentPage.value = page;
  }
};

const goToPreviousPage = () => {
  if (hasPreviousPage.value) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
  }
};

// View bid details
const isViewingBidModalOpen = ref(false);
const selectedBid = ref<any>(null);

const viewBid = (bidId: string) => {
  const bid = bids.value.find((b) => b.id === bidId);
  if (bid) {
    selectedBid.value = bid;
    isViewingBidModalOpen.value = true;
  }
};

const closeViewingBidModal = () => {
  isViewingBidModalOpen.value = false;
  selectedBid.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Bids</h1>
            <p class="mt-1 text-sm text-gray-600">View and manage all your bids</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isFetchingBids || isBidsRefetching" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-sm text-gray-600">Loading bids...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="isFetchingBidsError" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <OhVueIcon name="hi-exclamation-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">Failed to load bids</h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ fetchBidsErrorMessage }}
          </p>
          <button
            @click="refetchBids()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <OhVueIcon name="hi-refresh" class="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>

      <!-- Table -->
      <Table
        v-else
        :bids="bids"
        :meta="meta"
        :has-previous-page="hasPreviousPage"
        :has-next-page="hasNextPage"
        :limit="limit"
        @goToPage="goToPage"
        @goToPreviousPage="goToPreviousPage"
        @goToNextPage="goToNextPage"
        @update:limit="(value: number) => (limit = value)"
        @view-bid="viewBid"
      />

      <!-- View Bid Modal -->
      <Modal v-if="isViewingBidModalOpen && selectedBid" :isOpen="isViewingBidModalOpen" @close="closeViewingBidModal">
        <div class="bg-white rounded-xl p-6 max-w-2xl">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Bid Details</h2>
          </div>

          <div class="space-y-6">
            <!-- Task Information -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Task</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                    <OhVueIcon name="bi-list-task" class="h-5 w-5 text-blue-600" />
                  </div>
                  <div class="flex items-center">
                    <p class="text-lg font-semibold text-gray-900">{{ selectedBid.task.name }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bid Message -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Your Message</h3>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedBid.message }}</p>
              </div>
            </div>

            <!-- Bid Status -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <div class="flex items-center gap-3">
                <span
                  class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  :class="{
                    'bg-yellow-50 text-yellow-700 border border-yellow-200': selectedBid.status === 'PENDING',
                    'bg-green-50 text-green-700 border border-green-200': selectedBid.status === 'ACCEPTED',
                    'bg-red-50 text-red-700 border border-red-200': selectedBid.status === 'REJECTED',
                  }"
                >
                  {{ selectedBid.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
