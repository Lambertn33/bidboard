<script setup lang="ts">
import { reactive, computed } from 'vue';
import { Input } from '@/components/ui';
import { AuthForm } from '@/components/public';
import { useRegister } from '@/composables/useRegister';
import type { RegisterDto } from '@/api/public/auth';

const form = reactive<RegisterDto & { password_confirmation: string }>({
  names: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const { registerMutation, isPending, isError, errorMessage } = useRegister();

const passwordsMatch = computed(() => {
  return form.password === form.password_confirmation;
});

const passwordMismatchError = computed(() => {
  if (form.password_confirmation && !passwordsMatch.value) {
    return 'Passwords do not match';
  }
  return '';
});

const isFormValid = computed(() => {
  return form.names.trim() && 
         form.email.trim() && 
         form.password && 
         passwordsMatch.value;
});

const handleRegister = () => {
  if (!isFormValid.value) {
    return;
  }
  
  // Only send the fields that the server expects (exclude password_confirmation)
  const registerData: RegisterDto = {
    names: form.names,
    email: form.email,
    password: form.password,
  };
  
  registerMutation(registerData);
};
</script>

<template>
  <AuthForm
    title="Welcome to TaskBid"
    subtitle="Create an account to get started"
  >
    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- Email Field -->
      <Input
        id="names"
        label="Names"
        preIcon="hi-user"
        type="text"
        placeholder="Enter your names"
        :modelValue="form.names"
        @update:modelValue="form.names = $event"
        :hasPreIcon="true"
        :required="true"
      />
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
      <!-- Password Confirmation Field -->
      <div>
        <Input
          id="password_confirmation"
          label="Password Confirmation"
          preIcon="hi-lock-closed"
          type="password"
          placeholder="Confirm your password"
          :modelValue="form.password_confirmation"
          @update:modelValue="form.password_confirmation = $event"
          :hasPreIcon="true"
          :required="true"
        />
        <!-- Password Mismatch Error -->
        <p v-if="passwordMismatchError" class="mt-1 text-sm text-red-600">
          {{ passwordMismatchError }}
        </p>
      </div>
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
        <span v-if="!isPending">Register</span>
        <span v-else class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Registering...
        </span>
      </button>
    </form>

    <template #footer>
      <p class="text-sm text-gray-600">
        Already have an account?
        <router-link
          to="/login"
          class="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Login
        </router-link>
      </p>
    </template>
  </AuthForm>
</template>

