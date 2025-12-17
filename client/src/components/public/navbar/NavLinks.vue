<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const { isAuthenticated, isAdmin, isFreelancer } = useAuth();

interface NavLink {
  path: string;
  label: string;
}


const isActive = (path: string) => {
  return route.path === path;
};

const navigationLinks = computed<NavLink[]>(() => {
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
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/projects', label: 'Projects' },
      { path: '/admin/tasks', label: 'Tasks' },
      { path: '/admin/bids', label: 'Bids' },
      { path: '/admin/works', label: 'Works' },
    ];
  }
  if (isFreelancer.value) {
    return [
      { path: '/tasks', label: 'Tasks' },
      { path: '/freelancer/tasks', label: ' My Assigned Tasks' },
      { path: '/freelancer/bids', label: ' My Bids' },
      { path: '/freelancer/works', label: ' My Works' },
    ];
  }
  return [];
});

</script>

<template>
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
</template>

