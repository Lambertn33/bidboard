<script setup lang="ts">

</script>

<template>
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Join TaskBid today and start connecting with opportunities
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/register" class="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            <span class="text-blue-600">Sign Up as Freelancer</span>
          </router-link>
        </div>
      </div>
    </section>
</template>