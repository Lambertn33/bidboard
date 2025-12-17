<script setup lang="ts">
    import { OhVueIcon } from 'oh-vue-icons';
    import { Pagination } from '@/components/ui';
    
    interface IBid {
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
      freelancer: {
        id: string;
        telephone: string;
        user: {
          id: string;
          names: string;
          email: string;
        };
      } | null;
    }
    
    const props = defineProps<{
      bids: IBid[];
      meta: {
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
      };
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      limit: number;
      formatDate: (date: string) => string;
      isRejectingBidPending: boolean;
    }>();
    
    const emits = defineEmits<{
      (e: 'goToPage', page: number): void;
      (e: 'goToPreviousPage'): void;
      (e: 'goToNextPage'): void;
      (e: 'update:limit', value: number): void;
      (e: 'open-editing-modal', projectId: string): void;
      (e: 'open-accepting-bid-modal', bidId: string): void;
      (e: 'open-viewing-bid-modal', bidId: string): void;
      (e: 'reject-bid', bidId: string): void;
    }>();
    
    const goToPage = (page: number) => emits('goToPage', page);
    const goToPreviousPage = () => emits('goToPreviousPage');
    const goToNextPage = () => emits('goToNextPage');
    const updateLimit = (value: number) => emits('update:limit', value);
    const openAcceptingBidModal = (bidId: string) => emits('open-accepting-bid-modal', bidId);
    const openViewingBidModal = (bidId: string) => emits('open-viewing-bid-modal', bidId);
    const rejectBid = (bidId: string) => emits('reject-bid', bidId);

    const getBidStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
            REJECTED: 'bg-red-50 text-red-700 border border-red-200',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 border border-gray-200';
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
                      Bid Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bid Freelancer
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
                          <OhVueIcon name="bi-folder-fill" class="h-5 w-5 text-blue-600" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ bid.task.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getBidStatusColor(bid.status)">
                            {{ bid.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                          <OhVueIcon name="hi-user" class="h-5 w-5 text-blue-600" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ bid.freelancer?.user.names || '—' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-3">
                    <router-link to="" class="text-blue-600 hover:text-blue-900 transition-colors" @click="openViewingBidModal(bid.id)">
                      <OhVueIcon name="hi-eye" class="h-5 w-5" />
                    </router-link>
                    <button v-if="bid.status === 'PENDING'" class="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" @click="openAcceptingBidModal(bid.id)">
                      <OhVueIcon name="io-shield-checkmark-sharp" class="h-5 w-5 text-green-500" />
                    </button>
                    <button v-if="bid.status === 'PENDING'" class="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" @click="rejectBid(bid.id)">
                      <OhVueIcon name="io-close-circle-outline" class="h-5 w-5 text-red-500" />
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
              <p class="text-sm text-gray-600">Try adjusting your search query.</p>
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