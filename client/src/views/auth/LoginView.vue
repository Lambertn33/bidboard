<script setup lang="ts">
import { computed, reactive } from 'vue';
import { Input } from '@/components/ui';
import { AuthForm } from '@/components/public';
import { useLogin } from '@/composables/useLogin';
import type { LoginDto } from '@/api/public/auth';

const form = reactive<LoginDto>({
  email: '',
  password: '',
});

const isFormValid = computed(() => {
  const email = form.email.trim();
  const password = form.password.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return Boolean(password) && isEmailValid;
});

const invalidEmailError = computed(() => {
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return 'Invalid email address';
  }
  return '';
});

const { loginMutation, isPending, isError, errorMessage } = useLogin();

const handleLogin = () => {
  loginMutation(form);
};
</script>

<template>
  <AuthForm
    title="Welcome Back"
    subtitle="Sign in to your account to continue"
  >
    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email Field -->
      <div>
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
        <p v-if="invalidEmailError" class="mt-1 text-sm text-red-600 font-bold">
          {{ invalidEmailError }}
        </p>
      </div>
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
      <div v-if="isError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-bold text-center">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isPending || !isFormValid"
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

