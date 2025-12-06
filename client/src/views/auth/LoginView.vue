<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { OhVueIcon } from 'oh-vue-icons';

import { Input } from '@/components/ui';

const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);

const handleLogin = () => {
  console.log('Login clicked', form.email, form.password);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-16">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p class="text-blue-100 text-sm">Sign in to your account to continue</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Field -->
            <Input
              id="email"
              label="Email Address"
              preIcon="hi-mail"
              type="email"
              placeholder="Enter your email"
              :modelValue="form.email"
              @update:modelValue="form.email = $event"
              :hasPreIcon="true"
              :required="true"
            />
            <!-- Password Field -->
            <Input
              id="password"
              label="Password"
              preIcon="hi-lock-closed"
              type="password"
              placeholder="Enter your password"
              :modelValue="form.password"
              @update:modelValue="form.password = $event"
              :hasPreIcon="true"
              :required="true"
            />

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!isLoading">Sign In</span>
              <span v-else class="flex items-center gap-2">
                <div class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            </button>
          </form>
          <!-- Sign Up Link -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <router-link
                to="/register"
                class="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

