<script setup lang="ts">
  import { computed } from 'vue';
  import { useQuery } from "@tanstack/vue-query";
  import { OhVueIcon } from 'oh-vue-icons';

  import { getDashboardOverview, getRecentTasks } from '@/api/private/common/dashboard';
  import { AdminDashboardCards, AdminDashboardTasks } from '@/components/private';

  const { isPending: isOverviewLoading, isError: isOverviewError, data: overviewData, error: overviewError, refetch: refetchOverview } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => getDashboardOverview(),
  });

  const { isPending: isRecentTasksLoading, isError: isRecentTasksError, data: recentTasksData, error: recentTasksError, refetch: refetchRecentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: () => getRecentTasks(),
  });

  // Map API data to component format
  const recentTasks = computed(() => {
    if (!recentTasksData.value) return [];
    return recentTasksData.value.map((task: any) => ({
      id: task.id,
      name: task.name,
      status: task.status,
      project: {
        id: task.project.id,
        name: task.project.name,
      },
      price: task.price,
      bids: task._count?.bids ?? 0,
    }));
  });

  // Computed stats from API data or fallback to defaults
  const stats = computed(() => {
    if (overviewData.value) {
      return {
        totalProjects: overviewData.value.totalProjects ?? 0,
        activeTasks: overviewData.value.totalActiveTasks ?? 0,
        pendingBids: overviewData.value.totalPendingBids ?? 0,
        completedWorks: overviewData.value.totalCompletedWorks ?? 0,
        totalPaid: overviewData.value.totalPaid ?? 0,
        activeFreelancers: overviewData.value.totalActiveFreelancers ?? 0,
      };
    }
    return {
      totalProjects: 0,
      activeTasks: 0,
      pendingBids: 0,
      completedWorks: 0,
      totalPaid: 0,
      activeFreelancers: 0,
    };
  });

  const dashboardCards = computed(() => {
    return [
      {
        title: 'Total Projects',
        value: stats.value.totalProjects,
        icon: 'bi-folder-fill',
        iconColor: 'bg-blue-100',
      },
      {
        title: 'Active Tasks',
        value: stats.value.activeTasks,
        icon: 'hi-clipboard-list',
        iconColor: 'bg-yellow-100',
      },
      {
        title: 'Pending Bids',
        value: stats.value.pendingBids,
        icon: 'hi-clock',
        iconColor: 'bg-red-100',
      },
      {
        title: 'Completed Works',
        value: stats.value.completedWorks,
        icon: 'hi-check-circle',
        iconColor: 'bg-green-100',
      },
      {
        title: 'Total Paid',
        value: stats.value.totalPaid,
        icon: 'hi-currency-dollar',
        iconColor: 'bg-purple-100',
      },
      {
        title: 'Active Freelancers',
        value: stats.value.activeFreelancers,
        icon: 'hi-users',
        iconColor: 'bg-pink-100',
      },
    ];
  });


  const recentBids = [
    {
      id: '1',
      taskName: 'Data Cleanup Task 1',
      freelancerName: 'John Doe',
      message: 'I have extensive experience with data analysis...',
      status: 'PENDING',
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      taskName: 'Web Revamp Task 3',
      freelancerName: 'Jane Smith',
      message: 'I can complete this task within 2 days...',
      status: 'ACCEPTED',
      createdAt: '5 hours ago',
    },
    {
      id: '3',
      taskName: 'Marketing Blitz Task 2',
      freelancerName: 'Mike Johnson',
      message: 'I specialize in marketing assets...',
      status: 'PENDING',
      createdAt: '1 day ago',
    },
  ];

  const recentWorks = [
    {
      id: '1',
      taskName: 'Data Cleanup Task 1',
      freelancerName: 'John Doe',
      status: 'COMPLETED',
      completionUrl: 'https://example.com/work-1',
      price: 120,
      submittedAt: '1 hour ago',
    },
    {
      id: '2',
      taskName: 'Web Revamp Task 3',
      freelancerName: 'Jane Smith',
      status: 'COMPLETED',
      completionUrl: 'https://example.com/work-2',
      price: 250,
      submittedAt: '3 hours ago',
    },
    {
      id: '3',
      taskName: 'Marketing Blitz Task 2',
      freelancerName: 'Mike Johnson',
      status: 'IN_PROGRESS',
      completionUrl: null,
      price: 200,
      submittedAt: '1 day ago',
    },
    {
      id: '4',
      taskName: 'Data Cleanup Task 5',
      freelancerName: 'Sarah Williams',
      status: 'COMPLETED',
      completionUrl: 'https://example.com/work-4',
      price: 220,
      submittedAt: '2 days ago',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      ASSIGNED: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error State -->
      <div v-if="isOverviewError" class="mb-8">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <OhVueIcon name="hi-x-circle" class="w-6 h-6 text-red-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-red-900 mb-1">Failed to Load Dashboard</h3>
              <p class="text-sm text-red-700 mb-4">
                {{ overviewError instanceof Error ? overviewError.message : 'An error occurred while loading dashboard data. Please try again.' }}
              </p>

            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div v-if="!isOverviewError" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AdminDashboardCards
          :cards="dashboardCards"
          :loading="isOverviewLoading"
        />
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Tasks -->
        <div class="lg:col-span-2 max-h-[400px]">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div class="p-6 border-b border-gray-200 flex-shrink-0">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <router-link to="/protected/tasks" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </router-link>
              </div>
            </div>
            <div class="p-6 flex-1 overflow-y-auto">
              <AdminDashboardTasks
                :tasks="recentTasks"
                :loading="isRecentTasksLoading"
                :error="recentTasksError"
                :refetchRecentTasks="() => { refetchRecentTasks(); }"
              />
            </div>
          </div>
        </div>

        <!-- Recent Submitted Works -->
        <div class="lg:col-span-1 max-h-[400px] overflow-y-auto">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div class="p-6 border-b border-gray-200 flex-shrink-0">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Recent Works</h2>
                <router-link to="/protected/works" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </router-link>
              </div>
            </div>
            <div class="p-6 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div
                  v-for="work in recentWorks"
                  :key="work.id"
                  class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-medium text-gray-900 text-sm">{{ work.taskName }}</h3>
                    <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(work.status)]">
                      {{ work.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">by <span class="font-medium">{{ work.freelancerName }}</span></p>
                  <div class="flex items-center gap-4 mb-2 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <OhVueIcon name="hi-currency-dollar" class="w-4 h-4" />
                      {{ work.price }}
                    </span>
                  </div>
                  <div v-if="work.completionUrl" class="mb-2">
                    <a
                      :href="work.completionUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <OhVueIcon name="hi-link" class="w-4 h-4" />
                      View work
                    </a>
                  </div>
                  <p class="text-xs text-gray-500">{{ work.submittedAt }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bids -->
      <div class="mt-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Recent Bids</h2>
              <router-link to="/protected/bids" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="bid in recentBids"
                :key="bid.id"
                class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-medium text-gray-900">{{ bid.taskName }}</h3>
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(bid.status)]">
                        {{ bid.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">by <span class="font-medium">{{ bid.freelancerName }}</span></p>
                    <p class="text-sm text-gray-700 line-clamp-2">{{ bid.message }}</p>
                    <p class="text-xs text-gray-500 mt-2">{{ bid.createdAt }}</p>
                  </div>
                  <div class="ml-4 flex gap-2">
                    <button
                      v-if="bid.status === 'PENDING'"
                      class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      v-if="bid.status === 'PENDING'"
                      class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
