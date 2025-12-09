<script setup lang="ts">
import { ref } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data matching API response structure
const projectData = ref({
  id: 'f55a32ca-a68f-4ce6-aeb5-30b62096dd4a',
  name: 'Marketing Blitz',
  description: 'Launch quick marketing assets to boost client reach.',
  tasks: [
    {
      id: '0daa2846-ede3-4280-a5d3-14f84aca9dbc',
      name: 'Marketing Blitz Task 5',
      description: 'Deliverable 5 for Marketing Blitz.',
      status: 'OPEN',
      price: 250,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
    {
      id: '1b3d2968-1611-44c3-8533-46fea9e17f4c',
      name: 'Marketing Blitz Task 2',
      description: 'Deliverable 2 for Marketing Blitz.',
      status: 'OPEN',
      price: 175,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
    {
      id: '61516a4b-e756-47a3-aff7-c8b8cdcef6f6',
      name: 'Marketing Blitz Task 3',
      description: 'Deliverable 3 for Marketing Blitz.',
      status: 'OPEN',
      price: 200,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
    {
      id: 'adce2e0c-a64a-46d2-bd14-53edbd1f38a3',
      name: 'Marketing Blitz Task 4',
      description: 'Deliverable 4 for Marketing Blitz.',
      status: 'OPEN',
      price: 225,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
    {
      id: 'fbcefa69-38cd-4545-af70-a6b79f610db9',
      name: 'Marketing Blitz Task 1',
      description: 'Deliverable 1 for Marketing Blitz.',
      status: 'OPEN',
      price: 150,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
  ],
  _count: {
    tasks: 5,
  },
});

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-link
          to="/protected/projects"
          class="flex items-center gap-2 text-gray-600 mb-4 transition-colors cursor-pointer
          hover:text-blue-600"
        >
          <OhVueIcon name="hi-arrow-left" class="h-5 w-5" />
          <span class="text-sm font-medium">Back to Projects</span>
        </router-link>
        
        <div class="flex items-start justify-between mt-8">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100">
                <OhVueIcon name="bi-folder-fill" class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ projectData.name }}</h1>
              </div>
            </div>
            <p class="mt-3 text-gray-700 max-w-3xl">{{ projectData.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100">
              <OhVueIcon name="bi-list-task" class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Tasks</p>
              <p class="text-2xl font-bold text-gray-900">{{ projectData._count.tasks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Tasks</h2>
            <p class="text-sm text-gray-600 mt-1">All tasks in this project</p>
          </div>
        </div>

        <!-- Tasks List (Scrollable) -->
        <div
          v-if="projectData.tasks.length > 0"
          class="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2"
        >
          <div
            v-for="task in projectData.tasks"
            :key="task.id"
            class="group bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ task.name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide"
                    :class="
                      task.status === 'OPEN'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    "
                  >
                    {{ task.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ task.description }}</p>
              </div>
              
              <div class="ml-4 text-right">
                <p class="text-sm text-gray-500 mb-1">Price</p>
                <p class="text-2xl font-bold text-gray-900">${{ task.price }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span
                v-for="skill in task.skills"
                :key="skill"
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <OhVueIcon name="bi-list-task" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-sm font-semibold text-gray-900 mb-1">No tasks yet</h3>
          <p class="text-sm text-gray-600">Get started by adding your first task to this project.</p>
        </div>
      </div>
    </div>
  </div>
</template>