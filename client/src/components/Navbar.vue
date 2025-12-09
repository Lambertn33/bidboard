<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const { isAuthenticated, isAdmin, isFreelancer, user, logout: logoutUser } = useAuth();
const isMobileMenuOpen = ref(false);

const isActive = (path: string) => {
  return route.path === path;
};

const navigationLinks = computed(() => {
  if (!isAuthenticated.value) {
    return [
      { path: '/', label: 'Home' },
      { path: '/tasks', label: 'Tasks' },
      { path: '/register', label: 'Register' },
      { path: '/login', label: 'Login' },
    ];
  }
  if (isAdmin.value) {
    return [
      { path: '/protected/dashboard', label: 'Dashboard' },
      { path: '/protected/projects', label: 'Projects' },
      { path: '/protected/tasks', label: 'Tasks' },
      { path: '/protected/bids', label: 'Bids' },
      { path: '/protected/works', label: 'Works' },
    ];
  }
  if (isFreelancer.value) {
    return [
      { path: '/tasks', label: 'Tasks' },
      { path: '/protected/tasks', label: ' My Assigned Tasks' },
      { path: '/protected/bids', label: ' My Bids' },
      { path: '/protected/works', label: ' My Works' },
    ];
  }
  return [];
});

const handleLogout = () => {
  logoutUser();
  router.push('/');
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
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
        <div class="hidden md:flex items-center space-x-4">
          <router-link
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(link.path)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            {{ link.label }}
          </router-link>
          
          <!-- User Info & Logout (when authenticated) -->
          <div v-if="isAuthenticated" class="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
            <span class="text-sm text-gray-700">{{ user?.names || user?.email }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            type="button"
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
            aria-label="Main menu"
          >
            <OhVueIcon :name="isMobileMenuOpen ? 'hi-x' : 'hi-menu'" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
        <div class="flex flex-col space-y-2">
          <router-link
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            @click="isMobileMenuOpen = false"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(link.path)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            {{ link.label }}
          </router-link>
          
          <!-- User Info & Logout (when authenticated) -->
          <div v-if="isAuthenticated" class="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
            <span class="px-3 py-2 text-sm text-gray-700">{{ user?.names || user?.email }}</span>
            <button
              @click="handleLogout"
              class="mx-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


