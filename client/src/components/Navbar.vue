<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            TaskBid
          </span>
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive('/')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            Home
          </router-link>
          <router-link
            to="/projects"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive('/projects')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            Projects
          </router-link>
          <router-link
            to="/tasks"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive('/tasks')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            Tasks
          </router-link>
          <router-link
            to="/register"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive('/register')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            Register
          </router-link>
          <router-link
            to="/login"
            :class="[
              'px-4 py-2 rounded-md text-sm font-semibold transition-colors',
              isActive('/login')
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Login
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
            aria-label="Main menu"
          >
            <OhVueIcon name="hi-menu" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>


