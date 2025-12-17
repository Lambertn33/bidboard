<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const { isAuthenticated, isAdmin, isFreelancer, user, logout: logoutUser } = useAuth();
const isMobileMenuOpen = ref(false);
const isUserDropdownOpen = ref(false);
const userDropdownRef = ref<HTMLElement | null>(null);

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

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

const handleLogout = () => {
  logoutUser();
  router.push('/');
  isMobileMenuOpen.value = false;
  isUserDropdownOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    isUserDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
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
          
          <!-- User Dropdown (when authenticated) -->
          <div v-if="isAuthenticated" class="relative ml-4 pl-4 border-l border-gray-200" ref="userDropdownRef">
            <button
            @click="toggleUserDropdown"
            class="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <span class="text-sm text-gray-700 hover:text-blue-600"><b>{{ user?.names}}</b></span>
              <OhVueIcon name="hi-user" class="h-5 w-5" />
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isUserDropdownOpen"
                class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-semibold text-gray-900">{{ user?.names || user?.email }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ user?.email }}</p>
                </div>
                
                <div class="py-2">
                  <div class="px-4 py-2 text-sm text-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500">Role:</span>
                      <span class="font-bold">{{ user?.role }}</span>
                    </div>
                  </div>
                  
                  <div v-if="isFreelancer && user?.telephone" class="px-4 py-2 text-sm text-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500">Telephone:</span>
                      <span class="font-bold">{{ user.telephone }}</span>
                    </div>
                  </div>
                  
                  <div v-if="isFreelancer && user?.balance !== undefined" class="px-4 py-2 text-sm text-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500">Balance:</span>
                      <span class="font-bold text-green-600">${{ user.balance }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 pt-2">
                  <button
                    @click="handleLogout"
                    class="w-full cursor-pointer px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left flex items-center space-x-2"
                  >
                    <OhVueIcon name="hi-logout" class="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </Transition>
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
          
          <!-- User Info & Logout (when authenticated) - Mobile -->
          <div v-if="isAuthenticated" class="pt-2 border-t border-gray-200 mt-2">
            <div class="px-3 py-3 bg-gray-50 rounded-lg mb-2">
              <p class="text-sm font-semibold text-gray-900">{{ user?.names || user?.email }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ user?.email }}</p>
            </div>
            
            <div class="px-3 py-2 space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Role:</span>
                <span class="font-bold">{{ user?.role }}</span>
              </div>
              
              <div v-if="isFreelancer && user?.telephone" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Telephone:</span>
                <span class="font-bold">{{ user.telephone }}</span>
              </div>
              
              <div v-if="isFreelancer && user?.balance !== undefined" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Balance:</span>
                <span class="font-bold text-green-600">${{ user.balance }}</span>
              </div>
            </div>
            
            <button
              @click="handleLogout"
              class="w-full cursor-pointer mx-3 mt-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <OhVueIcon name="hi-logout" class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


