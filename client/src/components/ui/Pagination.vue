<script setup lang="ts">
    import { OhVueIcon } from 'oh-vue-icons';
    
    const props = defineProps<{
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      meta: {
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
      };
      limit: number;
    }>();
    
    const emits = defineEmits<{
      (e: 'goToPage', page: number): void;
      (e: 'goToPreviousPage'): void;
      (e: 'goToNextPage'): void;
      (e: 'update:limit', value: number): void;
    }>();
    
    const goToPage = (page: number) => {
      emits('goToPage', page);
    };
    
    const handleLimitChange = (event: Event) => {
      const value = Number((event.target as HTMLSelectElement).value);
      emits('update:limit', value);
    };
    </script>
    
    <template>
      <div v-if="meta.total > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="$emit('goToPreviousPage')"
              :disabled="!hasPreviousPage"
              :class="[
                'px-4 py-2 border border-gray-300 rounded-md text-sm font-medium',
                hasPreviousPage
                  ? 'bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              Previous
            </button>
            <button
              @click="$emit('goToNextPage')"
              :disabled="!hasNextPage"
              :class="[
                'px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ml-3',
                hasNextPage
                  ? 'bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (meta.currentPage - 1) * meta.limit + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(meta.currentPage * meta.limit, meta.total) }}</span>
                of
                <span class="font-medium">{{ meta.total }}</span>
                results
              </p>
              <div class="flex items-center gap-2">
                <label for="items-per-page" class="text-sm text-gray-700">Show:</label>
                <select
                  id="items-per-page"
                  :value="limit"
                  @change="handleLimitChange"
                  class="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1.5 px-3 border bg-white"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="$emit('goToPreviousPage')"
                  :disabled="!hasPreviousPage"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
                    hasPreviousPage
                      ? 'bg-white text-gray-500 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <OhVueIcon name="hi-chevron-left" class="h-5 w-5" />
                </button>
    
                <template v-for="page in meta.totalPages" :key="page">
                  <button
                    v-if="page === 1 || page === meta.totalPages || (page >= meta.currentPage - 1 && page <= meta.currentPage + 1)"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === meta.currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else-if="page === meta.currentPage - 2 || page === meta.currentPage + 2"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>
    
                <button
                  @click="$emit('goToNextPage')"
                  :disabled="!hasNextPage"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
                    hasNextPage
                      ? 'bg-white text-gray-500 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <OhVueIcon name="hi-chevron-right" class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </template>