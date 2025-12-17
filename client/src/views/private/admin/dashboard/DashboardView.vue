<script setup lang="ts">
  import { computed } from 'vue';
  import { useQuery } from "@tanstack/vue-query";
  import { OhVueIcon } from 'oh-vue-icons';

  import { getDashboardOverview, getRecentTasks, getRecentWorks, getRecentBids } from '@/api/private/admin/dashboard';
  import { AdminDashboardCards, AdminDashboardTasks, AdminDashboardWorks, AdminDashboardBids } from '@/components/private';

  const { isPending: isOverviewLoading, isError: isOverviewError, data: overviewData, error: overviewError} = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => getDashboardOverview(),
  });

  const { isPending: isRecentTasksLoading, data: recentTasksData, error: recentTasksError, refetch: refetchRecentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: () => getRecentTasks(),
  });

  const { isPending: isRecentWorksLoading, data: recentWorksData, error: recentWorksError, refetch: refetchRecentWorks } = useQuery({
    queryKey: ['recent-works'],
    queryFn: () => getRecentWorks(),
  });

  const { isPending: isRecentBidsLoading, data: recentBidsData, error: recentBidsError, refetch: refetchRecentBids } = useQuery({
    queryKey: ['recent-bids'],
    queryFn: () => getRecentBids(),
  });

  interface IBid {
    id: string;
    message: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    task: {
        id: string;
        name: string;
    };
    freelancer: {
        id: string;
        telephone: string;
        user: {
            id: string;
            names: string;
        };
    };
    createdAt: string;
  }

  interface ITask {
    id: string;
    name: string;
    status: "OPEN" | "ASSIGNED" | "COMPLETED";
    project: {
        id: string;
        name: string;
    };
    price: number;
    _count: {
      bids: number;
    };
  }

  interface IWork {
    id: string;
    task: {
        id: string;
        name: string;
    };
    freelancer: {
        id: string;
        telephone: string;
        user: {
            id: string;
            names: string;
        };
    };
    startDate: string;
    endDate: string;
    completionUrl: string | null;
    status: "COMPLETED" | "IN_PROGRESS";
    createdAt: string;
  }
  // Map API data to component format
  const recentTasks = computed(() => {
    if (!recentTasksData.value) return [];
    return recentTasksData.value.map((task: ITask) => ({
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

  // Map API data to component format for works
  const recentWorks = computed(() => {
    if (!recentWorksData.value) return [];
    return recentWorksData.value.map((work: IWork) => ({
      id: work.id,
      task: {
        id: work.task.id,
        name: work.task.name,
      },
      freelancer: {
        id: work.freelancer.id,
        telephone: work.freelancer.telephone,
        user: {
          id: work.freelancer.user.id,
          names: work.freelancer.user.names,
        },
      },
      startDate: work.startDate,
      endDate: work.endDate,
      completionUrl: work.completionUrl,
      status: work.status,
      createdAt: work.createdAt,
    }));
  });

  // Map API data to component format for bids
  const recentBids = computed(() => {
    if (!recentBidsData.value) return [];
    return recentBidsData.value.map((bid: IBid) => ({
      id: bid.id,
      message: bid.message,
      status: bid.status,
      task: {
        id: bid.task.id,
        name: bid.task.name,
      },
      freelancer: {
        id: bid.freelancer.id,
        telephone: bid.freelancer.telephone,
        user: {
          id: bid.freelancer.user.id,
          names: bid.freelancer.user.names,
        },
      },
      createdAt: bid.createdAt,
    }));
  });

  // Computed stats from API data or fallback to defaults
  const stats = computed(() => {
    if (overviewData.value) {
      return {
        totalProjects: overviewData.value.totalProjects ?? 0,
        activeTasks: overviewData.value.totalActiveTasks ?? 0,
        assignedTasks: overviewData.value.totalAssignedTasks ?? 0,
        completedTasks: overviewData.value.totalCompletedTasks ?? 0,
        pendingBids: overviewData.value.totalPendingBids ?? 0,
        completedWorks: overviewData.value.totalCompletedWorks ?? 0,
        totalPaid: overviewData.value.totalPaid ?? 0,
        activeFreelancers: overviewData.value.totalActiveFreelancers ?? 0,
      };
    }
    return {
      totalProjects: 0,
      activeTasks: 0,
      assignedTasks: 0,
      completedTasks: 0,
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
        title: 'Assigned Tasks',
        value: stats.value.assignedTasks,
        icon: 'hi-clipboard-list',
        iconColor: 'bg-green-100',
      },
      {
        title: 'Completed Tasks',
        value: stats.value.completedTasks,
        icon: 'hi-check-circle',
        iconColor: 'bg-green-100',
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
                <router-link to="/admin/tasks" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </router-link>
              </div>
            </div>
            <div class="p-6 flex-1 overflow-y-auto">
              <AdminDashboardTasks
                :tasks="recentTasks"
                :loading="isRecentTasksLoading"
                :error="recentTasksError"
                @refetchRecentTasks="refetchRecentTasks()"
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
                <router-link to="/admin/works" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </router-link>
              </div>
            </div>
            <div class="p-6 flex-1 overflow-y-auto">
              <AdminDashboardWorks
                :works="recentWorks"
                :loading="isRecentWorksLoading"
                :error="recentWorksError"
                @refetchRecentWorks="refetchRecentWorks()"
              />
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
              <router-link to="/admin/bids" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <AdminDashboardBids
              :bids="recentBids"
              :loading="isRecentBidsLoading"
              :error="recentBidsError"
              @refetchRecentBids="refetchRecentBids()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
