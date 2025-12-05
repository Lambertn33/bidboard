<script setup lang="ts">
import { getProjects } from '@/api/public/projects';
import { useQuery } from '@tanstack/vue-query';

import { Loader, Error, List } from '@/components/public/projects';

const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
});
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
      <!-- Loading State -->
      <Loader v-if="isPending" :count="6" />

      <!-- Error State -->
      <Error
        v-else-if="isError"
        :error="error instanceof Error ? error.message : 'Failed to load projects. Please try again later.'" 
        @refetch="refetch" />

      <!-- Data State -->
      <List v-else-if="data?.data" :projects="data?.data" />

      <!-- Empty State (if no projects) -->
      <div v-else class="text-center py-12">
        <OhVueIcon name="bi-folder-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
        <p class="text-gray-600">Check back later for new projects and tasks.</p>
      </div>
    </div>
  </div>
</template>