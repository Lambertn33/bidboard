<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import type { AxiosError } from 'axios';

import { login } from '@/api/public/auth';
import { useMutation } from '@tanstack/vue-query';
import { Input } from '@/components/ui';
import { AuthForm } from '@/components/public';
import { useAuth, type UserRole } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login: setAuthToken } = useAuth();

interface LoginDto {
  email: string;
  password: string;
}

const form = reactive({
  email: '',
  password: '',
});

const { mutate: loginMutation, isPending, isError, error } = useMutation({
  mutationFn: (data: LoginDto) => login(data),
  onSuccess: (data) => {
    setAuthToken(data.access_token);
    
    try {
      const decoded = jwtDecode<{ role?: UserRole }>(data.access_token);
      const userRole = decoded.role;
      
      const redirectPath = route.query.redirect as string | undefined;
      
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        if (userRole === 'ADMIN') {
          router.push('/protected/projects');
        } else {
          router.push('/tasks');
        }
      }
    } catch (error) {
      console.error('Failed to decode token for redirect:', error);
      router.push('/');
    }
  },
});

const handleLogin = () => {
  loginMutation(form);
};

const errorMessage = computed(() => {
  if (!error.value) return 'Invalid email or password. Please try again.';
  
  const axiosError = error.value as AxiosError<{ message: string | string[] }>;
  
  if (axiosError.response?.data?.message) {
    const message = axiosError.response.data.message;
    const status = axiosError.response.status;
    
    if (status === 401) {
      return typeof message === 'string' ? message : message[0];
    }
    
    if (status === 400) {
      return Array.isArray(message) ? message[0] : message;
    }
    
    return Array.isArray(message) ? message[0] : message;
  }
  
  return 'Invalid email or password. Please try again.';
});
</script>

<template>
  <AuthForm
    title="Welcome Back"
    subtitle="Sign in to your account to continue"
  >
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

      <!-- Error Message -->
      <div v-if="isError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isPending"
        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="!isPending">Sign In</span>
        <span v-else class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Signing in...
        </span>
      </button>
    </form>

    <template #footer>
      <p class="text-sm text-gray-600">
        Don't have an account yet?
        <router-link
          to="/register"
          class="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign up
        </router-link>
      </p>
    </template>
  </AuthForm>
</template>

