<script setup lang="ts">
interface AuthFormProps {
  title: string;
  subtitle: string;
}

defineProps<AuthFormProps>();
</script>

<template>
  <div class="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-16">
    <div class="max-w-md w-full">
      <!-- Auth Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">{{ title }}</h1>
          <p class="text-blue-100 text-sm">{{ subtitle }}</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <!-- Default slot for form content -->
          <slot />
          
          <!-- Footer slot -->
          <div class="mt-8 text-center">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

