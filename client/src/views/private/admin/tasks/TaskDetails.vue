<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { getStartTimeInDays } from '@/reusables';
import { useFetchTask } from '@/composables/useFetchTask';
import { useRoute } from 'vue-router';

const route = useRoute();

const { isPending, isError, taskData, errorMessage, refetch } = useFetchTask(route.params.id as string);

const task = computed(() => taskData.value);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    ASSIGNED: 'bg-blue-50 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const getBidStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const createdAtAgo = computed(() => getStartTimeInDays(task.value?.createdAt || ''));
const updatedAtAgo = computed(() => getStartTimeInDays(task.value?.updatedAt || ''));

const totalBids = computed(() => task.value?.bids.length ?? 0);
const pendingBidsCount = computed(
  () => task.value?.bids.filter((b) => b.status === 'PENDING').length ?? 0,
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-link
          to="/admin/tasks"
          class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer hover:text-blue-600"
        >
          <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
          <span class="text-sm font-medium">Back to Tasks</span>
        </router-link>

        <div class="flex items-start justify-between mt-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100">
                <OhVueIcon name="bi-list-task" class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div v-if="isPending" class="h-8 w-48 rounded-md bg-gray-200 animate-pulse"></div>
                <h1 v-else class="text-3xl font-bold text-gray-900">{{ task?.name }}</h1>
              </div>
              <span
                v-if="!isPending && task?.status"
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                :class="getStatusColor(task?.status || '')"
              >
                {{ task?.status }}
              </span>
            </div>
            <p class="mt-3 text-gray-700 max-w-3xl">
              <span v-if="isPending" class="inline-block h-4 w-80 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ task?.description }}</span>
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
            <div class="h-64 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="h-48 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="isError"
        class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 max-w-3xl"
      >
        <OhVueIcon name="hi-exclamation-circle" class="h-6 w-6 text-red-600 flex-shrink-0" />
        <div class="flex-1">
          <h3 class="text-base font-semibold text-red-900 mb-1">Failed to load task</h3>
          <p class="text-sm text-red-700 mb-3">{{ errorMessage }}</p>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            @click="() => refetch()"
          >
            <OhVueIcon name="co-reload" class="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>

      <!-- Data State -->
      <div v-else-if="task" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Task Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Task Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Task Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Price</p>
                <p class="text-3xl font-bold text-gray-900">${{ task.price }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-2">Skills Required</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in task.skills"
                    :key="skill"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Project</p>
                <router-link
                  :to="`/admin/projects/${task.project.id}`"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <OhVueIcon name="bi-folder-fill" class="h-4 w-4" />
                  <span class="font-medium">{{ task.project.name }}</span>
                </router-link>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Created</p>
                  <p class="text-sm text-gray-900">{{ createdAtAgo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                  <p class="text-sm text-gray-900">{{ updatedAtAgo }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Assignment Card (if work exists) -->
          <div v-if="task.work" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Assigned Work</h2>
              <span
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                :class="getStatusColor(task.work.status)"
              >
                {{ task.work.status }}
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Freelancer</p>
                <div class="mt-2 space-y-2">
                  <p class="text-sm font-semibold text-gray-900">{{ task.work.freelancer.user.names }}</p>
                  <p class="text-sm text-gray-600">{{ task.work.freelancer.user.email }}</p>
                  <p class="text-sm text-gray-600">{{ task.work.freelancer.telephone }}</p>
                </div>
              </div>

              <div v-if="task.work.completionUrl">
                <p class="text-sm font-medium text-gray-500 mb-2">Completion URL</p>
                <a
                  :href="task.work.completionUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  <OhVueIcon name="hi-link" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ task.work.completionUrl }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Bids Section -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Bids</h2>
              <span class="text-sm text-gray-600">{{ totalBids }} bid(s)</span>
            </div>

            <div v-if="task.bids.length === 0" class="text-center py-12">
              <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 class="text-sm font-semibold text-gray-900 mb-1">No Bids Yet</h3>
              <p class="text-sm text-gray-600">No freelancers have submitted bids for this task.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="bid in task.bids"
                :key="bid.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                        :class="getBidStatusColor(bid.status)"
                      >
                        {{ bid.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1">
                      by
                      <span class="font-medium text-gray-900">{{ bid.freelancer.user.names }}</span>
                    </p>
                    <p class="text-sm text-gray-700 mt-2">{{ bid.message }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div class="text-xs text-gray-500">
                    <p>{{ bid.freelancer.user.email }}</p>
                    <p v-if="bid.freelancer.telephone">{{ bid.freelancer.telephone }}</p>
                  </div>
                  <div v-if="bid.status === 'PENDING'" class="flex gap-2">
                    <button
                      class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <OhVueIcon name="hi-check-circle" class="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <OhVueIcon name="hi-x" class="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Total Bids</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalBids }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Pending Bids</p>
                <p class="text-2xl font-bold text-yellow-600">
                  {{ pendingBidsCount }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  :class="getStatusColor(task.status)"
                >
                  {{ task.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback for no data -->
      <div v-else class="text-center text-gray-600">No task data available.</div>
    </div>
  </div>
</template>