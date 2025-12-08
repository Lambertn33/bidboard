<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

interface IProject {
  id: string;
  name: string;
  description: string;
  _count: {
    tasks: number;
  };
  createdAt: string;
}

interface IProjectsResponse {
  data: IProject[];
  meta: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

// Mock data matching API response structure
const mockProjects: IProject[] = [
  {
    id: '11e94fe7-1bc7-4d00-880f-12d92888fd1f',
    name: 'Data Cleanup',
    description: 'Micro data tasks for admin insights.',
    _count: { tasks: 5 },
    createdAt: '2025-12-04T14:50:38.296Z',
  },
  {
    id: '8ab09e17-4a5b-49b4-9f6a-c9fee044555d',
    name: 'Web Revamp',
    description: 'Frontend refresh tasks for client sites.',
    _count: { tasks: 5 },
    createdAt: '2025-12-04T14:50:38.293Z',
  },
  {
    id: 'f55a32ca-a68f-4ce6-aeb5-30b62096dd4a',
    name: 'Marketing Blitz',
    description: 'Launch quick marketing assets to boost client reach.',
    _count: { tasks: 5 },
    createdAt: '2025-12-04T14:50:38.288Z',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Mobile App Development',
    description: 'Build cross-platform mobile applications for iOS and Android.',
    _count: { tasks: 15 },
    createdAt: '2025-12-03T10:00:00.000Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'API Integration',
    description: 'Integrate third-party APIs and webhook systems.',
    _count: { tasks: 6 },
    createdAt: '2025-12-02T13:00:00.000Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Database Optimization',
    description: 'Optimize database queries and improve performance.',
    _count: { tasks: 10 },
    createdAt: '2025-12-01T10:00:00.000Z',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    name: 'UI/UX Redesign',
    description: 'Redesign user interfaces for better user experience.',
    _count: { tasks: 9 },
    createdAt: '2025-11-30T09:30:00.000Z',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    name: 'Security Audit',
    description: 'Conduct security audits and implement security measures.',
    _count: { tasks: 7 },
    createdAt: '2025-11-29T14:00:00.000Z',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    name: 'Content Management',
    description: 'Manage and organize content across multiple platforms.',
    _count: { tasks: 11 },
    createdAt: '2025-11-28T10:15:00.000Z',
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    name: 'E-commerce Platform',
    description: 'Develop and maintain e-commerce solutions.',
    _count: { tasks: 20 },
    createdAt: '2025-11-27T08:00:00.000Z',
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    name: 'Cloud Migration',
    description: 'Migrate infrastructure to cloud platforms.',
    _count: { tasks: 14 },
    createdAt: '2025-11-26T11:30:00.000Z',
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    name: 'Analytics Dashboard',
    description: 'Build analytics dashboards for data visualization.',
    _count: { tasks: 8 },
    createdAt: '2025-11-25T12:00:00.000Z',
  },
];

// Pagination and search state (will be used for API calls)
const currentPage = ref(1);
const limit = ref(10);
const searchQuery = ref('');

// Mock function to simulate API call with server-side pagination
// This will be replaced with actual API call later
const getMockProjects = (page: number, pageLimit: number, search: string): IProjectsResponse => {
  // Simulate server-side filtering
  let filtered = mockProjects;
  if (search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = mockProjects.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  }
  
  // Simulate server-side pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageLimit);
  const start = (page - 1) * pageLimit;
  const end = start + pageLimit;
  const paginated = filtered.slice(start, end);
  
  return {
    data: paginated,
    meta: {
      total,
      currentPage: page,
      limit: pageLimit,
      totalPages,
    },
  };
};

// Current data state (simulating API response)
const projectsData = ref<IProjectsResponse>(getMockProjects(currentPage.value, limit.value, searchQuery.value));

// Computed properties from API response
const projects = computed(() => projectsData.value.data);
const meta = computed(() => projectsData.value.meta);

// Pagination helpers
const hasPreviousPage = computed(() => meta.value.currentPage > 1);
const hasNextPage = computed(() => meta.value.currentPage < meta.value.totalPages);

// Function to fetch projects (simulates API call)
const fetchProjects = () => {
  // In the future, this will be: projectsData.value = await getProjects(currentPage.value, limit.value, searchQuery.value);
  projectsData.value = getMockProjects(currentPage.value, limit.value, searchQuery.value);
};


// Watch for search changes with debounce
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 300); // 300ms debounce
});

// Watch for limit changes - reset to page 1 and fetch
watch(limit, () => {
  currentPage.value = 1;
  fetchProjects();
});

// Pagination handlers
const goToPage = (page: number) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    currentPage.value = page;
    fetchProjects();
  }
};

const goToPreviousPage = () => {
  if (hasPreviousPage.value) {
    currentPage.value--;
    fetchProjects();
  }
};

const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
    fetchProjects();
  }
};

// Reset to first page when search changes
const handleSearch = () => {
  currentPage.value = 1;
  fetchProjects();
};

// Format date nicely
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
            <p class="mt-1 text-sm text-gray-600">Manage and view all your projects</p>
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <OhVueIcon name="hi-plus" class="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <OhVueIcon name="gi-magnifying-glass" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects by name or description..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="project in projects"
                :key="project.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                      <OhVueIcon name="bi-folder-fill" class="h-5 w-5 text-blue-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 max-w-md truncate" :title="project.description">
                    {{ project.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-900">
                    <OhVueIcon name="bi-list-task" class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="font-medium">{{ project._count.tasks }}</span>
                    <span class="text-gray-500 ml-1">{{ project._count.tasks === 1 ? 'task' : 'tasks' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(project.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button class="text-blue-600 hover:text-blue-900 transition-colors">
                      <OhVueIcon name="hi-eye" class="h-5 w-5" />
                    </button>
                    <button class="text-gray-600 hover:text-gray-900 transition-colors">
                      <OhVueIcon name="hi-pencil" class="h-5 w-5" />
                    </button>
                    <button class="text-red-600 hover:text-red-900 transition-colors">
                      <OhVueIcon name="hi-trash" class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="projects.length === 0" class="text-center py-12">
          <OhVueIcon name="bi-folder-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">No projects found</h3>
          <p class="text-sm text-gray-600">Try adjusting your search query.</p>
        </div>

        <!-- Pagination -->
        <div v-if="projects.length > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="goToPreviousPage"
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
                @click="goToNextPage"
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
                    v-model.number="limit"
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
                    @click="goToPreviousPage"
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
                    @click="goToNextPage"
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
      </div>
    </div>
  </div>
</template>
