<script setup lang="ts">
import { getTasks } from '@/api/public/tasks';
import { useQuery } from '@tanstack/vue-query';
import { Loading, Error, List } from '@/components/public/tasks';

const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Available Tasks
          </h1>
          <p class="text-gray-600">
            Browse through available tasks and find opportunities that match your skills.
          </p>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <Loading v-if="isPending" :count="5" />

      <!-- Error State -->
      <Error
        v-else-if="isError"
        :error="error instanceof Error ? error.message : 'Failed to load tasks. Please try again later.'"
        @refetch="refetch"
      />

      <!-- Data State -->
      <List v-else-if="data?.data && data.data.length > 0" :tasks="data.data" />

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-white rounded-2xl p-12 shadow-sm">
          <OhVueIcon name="bi-folder-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h3>
          <p class="text-gray-600">Check back later for new tasks.</p>
        </div>
      </div>
    </div>
    </div>
</template>
