<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { Table, AcceptBid, Item } from '@/components/private/admin/bids';
import { useFetchBids } from '@/composables/useFetchBids';
import { acceptBid } from '@/api/private/admin/bids';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useToast } from '@/composables/useToast';
import { Modal } from '@/components/ui';

const { success: showSuccessToast, error: showErrorToast } = useToast();
const queryClient = useQueryClient();
// Pagination state
const currentPage = ref(1);
const limit = ref(10);

// Reset page when page size changes
watch(limit, () => {
  currentPage.value = 1;
});

// Fetch bids using composable
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

// BIDS ACTIONS
const isAcceptingBidModalOpen = ref(false);
const isViewingBidModalOpen = ref(false);
const selectedBidId = ref<string | null>(null);
  
const selectedBid = reactive<{
  id: string;
  message: string;
  freelancerNames: string;
  taskName: string;
}>({
  id: '',
  message: '',
  freelancerNames: '',
  taskName: '',
});

const { mutate: acceptBidMutation, isPending: isAcceptingBidPending } = useMutation({
  mutationFn: (endDate: string) => acceptBid(selectedBidId.value as string, endDate),
  onSuccess: (response) => {
    showSuccessToast(response?.message || 'Bid accepted successfully');
    queryClient.invalidateQueries({ queryKey: ['bids'] });
    closeAcceptBidModal();
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to accept bid');
  },
});

const handleAcceptBid = (endDate: string) => {
  acceptBidMutation( endDate );
};

const openAcceptBidModal = (bidId: string) => {
 const bid = bids.value.find((b) => b.id === bidId);
 if (bid) {
  selectedBidId.value = bid.id;
  selectedBid.id = bid.id;
  selectedBid.message = bid.message;
  selectedBid.freelancerNames = bid.freelancer?.user.names || '';
  selectedBid.taskName = bid.task.name;
  isAcceptingBidModalOpen.value = true;
 }
};

const openViewingBidModal = (bidId: string) => {
  const bid = bids.value.find((b) => b.id === bidId);
  if (bid) {
    selectedBidId.value = bid.id;
    selectedBid.id = bid.id;
    selectedBid.message = bid.message;
    selectedBid.freelancerNames = bid.freelancer?.user.names || '';
    selectedBid.taskName = bid.task.name;
    isViewingBidModalOpen.value = true;
  }
};

const closeAcceptBidModal = () => {
  isAcceptingBidModalOpen.value = false;
  selectedBidId.value = null;
  selectedBid.id = '';
  selectedBid.message = '';
  selectedBid.freelancerNames = '';
  selectedBid.taskName = '';
};

const closeViewingBidModal = () => {
  isViewingBidModalOpen.value = false;
  selectedBidId.value = null;
  selectedBid.id = '';
  selectedBid.message = '';
  selectedBid.freelancerNames = '';
  selectedBid.taskName = '';
};

</script>
  
  <template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Bids</h1>
              <p class="mt-1 text-sm text-gray-600">Manage and view all bids</p>
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
          :formatDate="(d: string) => d"
          @goToPage="goToPage"
          @goToPreviousPage="goToPreviousPage"
          @goToNextPage="goToNextPage"
          @update:limit="(value: number) => (limit = value)"
          @open-accepting-bid-modal="openAcceptBidModal"
          @open-viewing-bid-modal="openViewingBidModal"
        />
        <!-- Guard render too, so the modal can never "flash" open due to transient truthy values -->
        <Modal v-if="isAcceptingBidModalOpen" :isOpen="isAcceptingBidModalOpen" @close="closeAcceptBidModal">
          <AcceptBid
            :bidId="selectedBid.id"
            :bidMessage="selectedBid.message"
            :bidFreelancerName="selectedBid.freelancerNames"
            :bidTaskName="selectedBid.taskName"
            :isAcceptingBidPending="isAcceptingBidPending"
            @acceptBid="handleAcceptBid"
          />
        </Modal>
        <Modal v-if="isViewingBidModalOpen" :isOpen="isViewingBidModalOpen" @close="closeViewingBidModal">
          <Item
            :bidId="selectedBid.id"
            :bidMessage="selectedBid.message"
            :bidFreelancerName="selectedBid.freelancerNames"
            :bidTaskName="selectedBid.taskName"
          />
        </Modal>
      </div>
    </div>
  </template>
  