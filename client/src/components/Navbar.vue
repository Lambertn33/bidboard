<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { OhVueIcon } from 'oh-vue-icons';
import { Logo, NavLinks, UserDropdown, MobileNav } from '@/components/public/navbar';

const router = useRouter();
const { isAuthenticated, logout: logoutUser } = useAuth();
const isMobileMenuOpen = ref(false);

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
        <Logo />

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <NavLinks />
          
          <!-- User Dropdown (when authenticated) -->
          <UserDropdown v-if="isAuthenticated" @logout="handleLogout" />
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

      <!-- Mobile Navigation -->
      <MobileNav 
        :is-open="isMobileMenuOpen" 
        @logout="handleLogout"
        @close="isMobileMenuOpen = false"
      />
    </div>
  </nav>
</template>


