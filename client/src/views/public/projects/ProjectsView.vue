<script setup lang="ts">
// Mock data for design purposes
const projects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'A comprehensive e-commerce solution with shopping cart, payment integration, and inventory management features.',
    taskCount: 12
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for iOS and Android with real-time synchronization and offline capabilities.',
    taskCount: 8
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Interactive dashboard for visualizing business metrics, user analytics, and performance indicators.',
    taskCount: 15
  },
  {
    id: '4',
    name: 'Content Management System',
    description: 'Modern CMS with rich text editing, media management, and role-based access control.',
    taskCount: 10
  },
  {
    id: '5',
    name: 'API Integration Service',
    description: 'RESTful API service with authentication, rate limiting, and comprehensive documentation.',
    taskCount: 6
  },
  {
    id: '6',
    name: 'UI/UX Design System',
    description: 'Complete design system with component library, style guide, and design tokens for consistent branding.',
    taskCount: 9
  },
  {
    id: '7',
    name: 'AI Chatbot Development',
    description: 'Develop a chatbot using AI to answer questions and provide information.',
    taskCount: 12
  },
  {
    id: '8',
    name: 'Data Entry Automation',
    description: 'Automate data entry tasks to improve efficiency and accuracy.',
    taskCount: 15
  },
  {
    id: '9',
    name: 'Social Media Management',
    description: 'Manage social media accounts to increase engagement and reach.',
    taskCount: 10
  },
  {
    id: '10',
    name: 'Email Marketing Campaign',
    description: 'Create and manage email marketing campaigns to promote products and services.',
    taskCount: 8
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Our Projects
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our active projects and find tasks that match your skills. Each project contains multiple tasks waiting for talented freelancers.
          </p>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Project Card -->
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
        >
          <div class="p-6">
            <!-- Project Name -->
            <h2 class="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">
              {{ project.name }}
            </h2>

            <!-- Project Description -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px] font-medium">
              {{ project.description }}
            </p>

            <!-- Task Count Badge -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <OhVueIcon 
                  name="bi-list-task" 
                  class="h-5 w-5" 
                />
                <span class="text-sm font-medium text-gray-700">
                  {{ project.taskCount }} {{ project.taskCount === 1 ? 'Task' : 'Tasks' }}
                </span>
              </div>
              <button
                class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center space-x-1"
              >
                <span>View Tasks</span>
                <OhVueIcon name="hi-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (if no projects) -->
      <div v-if="projects.length === 0" class="text-center py-12">
        <OhVueIcon name="bi-folder-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
        <p class="text-gray-600">Check back later for new projects and tasks.</p>
      </div>
    </div>
  </div>
</template>