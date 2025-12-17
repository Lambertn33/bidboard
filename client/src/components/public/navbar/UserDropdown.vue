<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useAuth } from '@/composables/useAuth';

const { user, isFreelancer, logout: logoutUser } = useAuth();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  logout: [];
}>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = () => {
  emit('logout');
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
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
  <div class="relative ml-4 pl-4 border-l border-gray-200" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none"
    >
      <span class="text-sm text-gray-700 hover:text-blue-600"><b>{{ user?.names }}</b></span>
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
        v-if="isOpen"
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
</template>

