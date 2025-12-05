<script setup lang="ts">
import type { IFeature } from '@/interfaces/home/IFeature';

const props = defineProps<{
  features: IFeature[];
}>();

</script>

<template>
  <section 
    class="py-20 relative bg-cover bg-center bg-no-repeat bg-image"
  >
    <!-- Overlay for better text readability -->
    <div class="absolute inset-0 bg-white/20 backdrop-blur-xs opacity-80"></div>
    
    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose TaskBid?</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          A platform designed for seamless collaboration between admins and freelancers
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in props.features" :key="index" class="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" :class="feature.iconBgColor">
            <OhVueIcon :name="feature.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.bg-image {
  background-image: url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
}
</style>