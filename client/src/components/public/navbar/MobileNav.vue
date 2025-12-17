<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';
import { useAuth } from '@/composables/useAuth';
import NavLinks from './NavLinks.vue';

const { isAuthenticated, user, isFreelancer } = useAuth();

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  logout: [];
  close: [];
}>();

const handleLogout = () => {
  emit('logout');
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="md:hidden border-t border-gray-200 py-4">
    <div class="flex flex-col space-y-2">
      <NavLinks :on-link-click="() => emit('close')" />
      
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
</template>

