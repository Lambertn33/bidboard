<script setup lang="ts">
import { IWork } from '../../interfaces/home/IWork';
const props = defineProps<{
  works: IWork[];
}>();
</script>

<template>
        <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to get started and succeed
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="(work, index) in props.works" :key="index" class="text-center">
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{ index + 1 }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ work.title }}</h3>
            <p class="text-gray-600">{{ work.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>
</template>