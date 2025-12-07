<script setup lang="ts">
// Hardcoded dashboard data
const stats = {
  totalProjects: 12,
  activeTasks: 45,
  pendingBids: 23,
  completedWorks: 128,
  totalPaid: 45230,
  activeFreelancers: 34,
};

const recentTasks = [
  {
    id: '1',
    name: 'Data Cleanup Task 1',
    project: 'Data Cleanup',
    status: 'OPEN',
    price: 120,
    bids: 5,
  },
  {
    id: '2',
    name: 'Web Revamp Task 3',
    project: 'Web Revamp',
    status: 'ASSIGNED',
    price: 250,
    bids: 3,
  },
  {
    id: '3',
    name: 'Marketing Blitz Task 2',
    project: 'Marketing Blitz',
    status: 'COMPLETED',
    price: 200,
    bids: 8,
  },
];

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

const activityFeed = [
  {
    id: '1',
    type: 'work_completed',
    message: 'Work "Data Cleanup Task 1" was completed by John Doe',
    time: '30 minutes ago',
    icon: 'hi-check-circle',
    color: 'text-green-600',
  },
  {
    id: '2',
    type: 'bid_submitted',
    message: 'New bid submitted for "Web Revamp Task 3"',
    time: '1 hour ago',
    icon: 'hi-document-text',
    color: 'text-blue-600',
  },
  {
    id: '3',
    type: 'work_approved',
    message: 'Work "Marketing Blitz Task 2" was approved',
    time: '2 hours ago',
    icon: 'hi-check',
    color: 'text-purple-600',
  },
  {
    id: '4',
    type: 'task_created',
    message: 'New task "Data Cleanup Task 5" was created',
    time: '3 hours ago',
    icon: 'hi-plus-circle',
    color: 'text-orange-600',
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-800',
    ASSIGNED: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    PENDING: 'bg-gray-100 text-gray-800',
    ACCEPTED: 'bg-green-100 text-green-800',
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
          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <OhVueIcon name="hi-plus" class="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Total Projects -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Projects</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalProjects }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="bi-folder-fill" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Active Tasks -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Tasks</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeTasks }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="hi-clipboard-list" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Pending Bids -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Bids</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.pendingBids }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="hi-document-text" class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <!-- Completed Works -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed Works</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.completedWorks }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="hi-check-circle" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Paid</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">KES {{ stats.totalPaid.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="hi-currency-dollar" class="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <!-- Active Freelancers -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Freelancers</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeFreelancers }}</p>
            </div>
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <OhVueIcon name="hi-users" class="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Tasks -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <router-link to="/protected/tasks" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="task in recentTasks"
                  :key="task.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <h3 class="font-medium text-gray-900">{{ task.name }}</h3>
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(task.status)]">
                        {{ task.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ task.project }}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <OhVueIcon name="hi-currency-dollar" class="w-4 h-4" />
                        {{ task.price }}
                      </span>
                      <span class="flex items-center gap-1">
                        <OhVueIcon name="hi-document-text" class="w-4 h-4" />
                        {{ task.bids }} bids
                      </span>
                    </div>
                  </div>
                  <button class="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <OhVueIcon name="hi-chevron-right" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in activityFeed"
                  :key="activity.id"
                  class="flex items-start gap-3"
                >
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <OhVueIcon name="hi-clock" class="w-4 h-4 text-gray-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">{{ activity.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                  </div>
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
