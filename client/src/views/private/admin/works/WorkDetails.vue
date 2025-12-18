<script setup lang="ts">
import { computed, ref } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useRoute } from 'vue-router';
import { getStartTimeInDays, formatDate } from '@/reusables';

// Mock data - replace with actual API call later
const mockWorkData = {
  id: "f3720cf0-b9d7-4d7c-8d5c-eb41f3d53979",
  startDate: "2025-12-17T19:08:39.541Z",
  endDate: "2025-12-27T00:00:00.000Z",
  completionUrl: null,
  status: "IN_PROGRESS",
  task: {
    id: "d1378a50-cae2-4257-89ec-0e3e83fd083d",
    name: "Data Cleanup Task 3",
    description: "Deliverable 3 for Data Cleanup."
  },
  freelancer: {
    id: "4169208f-659c-4696-a9ae-54c5b479e4a4",
    telephone: "+250785292979",
    user: {
      id: "442d9e96-5a04-4562-9167-ffca095c830f",
      names: "Nsengimana Lambert",
      email: "lamb@gmail.com"
    }
  }
};

const route = useRoute();
const work = ref(mockWorkData);
const isPending = ref(false);
const isError = ref(false);
const errorMessage = ref('');

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const formattedStatus = computed(() => {
  return work.value.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed';
});

const startDateAgo = computed(() => getStartTimeInDays(work.value.startDate));
const endDateAgo = computed(() => getStartTimeInDays(work.value.endDate));
const formattedStartDate = computed(() => formatDate(work.value.startDate));
const formattedEndDate = computed(() => formatDate(work.value.endDate));

const refetch = () => {
  // TODO: Implement actual refetch logic
  console.log('Refetching work data...');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-link
          to="/admin/works"
          class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer hover:text-blue-600"
        >
          <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
          <span class="text-sm font-medium">Back to Works</span>
        </router-link>

        <div class="flex items-start justify-between mt-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-100">
                <OhVueIcon name="bi-briefcase-fill" class="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div v-if="isPending" class="h-8 w-48 rounded-md bg-gray-200 animate-pulse"></div>
                <h1 v-else class="text-3xl font-bold text-gray-900">{{ work.task.name }}</h1>
              </div>
              <span
                v-if="!isPending && work.status"
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                :class="getStatusColor(work.status)"
              >
                {{ formattedStatus }}
              </span>
            </div>
            <p class="mt-3 text-gray-700 max-w-3xl">
              <span v-if="isPending" class="inline-block h-4 w-80 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ work.task.description }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isPending" class="space-y-4">
        <div class="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-64 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
            <div class="h-48 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="h-48 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 max-w-3xl">
        <OhVueIcon name="hi-exclamation-circle" class="h-6 w-6 text-red-600 flex-shrink-0" />
        <div class="flex-1">
          <h3 class="text-base font-semibold text-red-900 mb-1">Failed to load work</h3>
          <p class="text-sm text-red-700 mb-3">{{ errorMessage || 'An error occurred while loading work data.' }}</p>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            @click="refetch"
          >
            <OhVueIcon name="co-reload" class="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>

      <!-- Data State -->
      <div v-else-if="work" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Work Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Work Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Work Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  :class="getStatusColor(work.status)"
                >
                  {{ formattedStatus }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Start Date</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formattedStartDate }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ startDateAgo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">End Date</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formattedEndDate }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ endDateAgo }}</p>
                </div>
              </div>

              <div v-if="work.completionUrl" class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-500 mb-2">Completion URL</p>
                <a
                  :href="work.completionUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  <OhVueIcon name="hi-link" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ work.completionUrl }}</span>
                </a>
              </div>
              <div v-else class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-500 mb-1">Completion URL</p>
                <p class="text-sm text-gray-400 italic">Not yet provided</p>
              </div>
            </div>
          </div>

          <!-- Task Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Task Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Task Name</p>
                <p class="text-lg font-semibold text-gray-900">{{ work.task.name }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p class="text-sm text-gray-700">{{ work.task.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Freelancer & Stats -->
        <div class="space-y-6">
          <!-- Freelancer Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Freelancer</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Name</p>
                <p class="text-base font-semibold text-gray-900">{{ work.freelancer.user.names }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Email</p>
                <div class="flex items-center gap-2">
                  <OhVueIcon name="hi-mail" class="h-4 w-4 text-gray-400" />
                  <a
                    :href="`mailto:${work.freelancer.user.email}`"
                    class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {{ work.freelancer.user.email }}
                  </a>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Telephone</p>
                <div class="flex items-center gap-2">
                  <OhVueIcon name="hi-phone" class="h-4 w-4 text-gray-400" />
                  <a
                    :href="`tel:${work.freelancer.telephone}`"
                    class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {{ work.freelancer.telephone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback for no data -->
      <div v-else class="text-center text-gray-600">No work data available.</div>
    </div>
  </div>
</template>

