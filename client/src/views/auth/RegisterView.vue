<script setup lang="ts">
import { reactive, computed } from 'vue';
import { Input } from '@/components/ui';
import { AuthForm } from '@/components/public';
import { useRegister } from '@/composables/useRegister';
import type { RegisterDto } from '@/api/public/auth';

const form = reactive<RegisterDto & { password_confirmation: string }>({
  names: '',
  email: '',
  telephone: '',
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

const passwordLengthError = computed(() => {
  if (form.password.trim() && form.password.trim().length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return '';
});

const invalidEmailError = computed(() => {
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return 'Invalid email address';
  }
  return '';
});

const invalidTelephoneError = computed(() => {
  if (form.telephone.trim() && !/^(\+2507)\d{8}$/.test(form.telephone)) {
    return 'Invalid telephone number';
  }
  return '';
});

const isFormValid = computed(() => {
  const names = form.names.trim();
  const email = form.email.trim();
  const password = form.password.trim();
  const passwordConfirmation = form.password_confirmation.trim();
  const isPasswordValid = password.length >= 8;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isTelephoneValid = /^(\+2507)\d{8}$/.test(form.telephone);

  return Boolean(names) && 
         Boolean(email) && 
         Boolean(password) && 
         Boolean(passwordConfirmation) && 
         isEmailValid &&
         passwordsMatch.value &&
         isPasswordValid &&
         isTelephoneValid;
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
    telephone: form.telephone,
  };
  
  registerMutation(registerData);
};
</script>

<template>
  <AuthForm
    title="Welcome to TaskBid"
    subtitle="Create an account to get started"
    width="max-w-xl"
  >
    <form @submit.prevent="handleRegister" class="space-y-6">
      <!--  Field -->
      <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
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
          </div>
        <!-- Telephone Field -->
          <div class="flex-1">
            <Input
              id="telephone"
              label="Telephone"
              preIcon="hi-phone"
              type="tel"
              placeholder="Enter Telephone (+2507...)"
              :modelValue="form.telephone"
              @update:modelValue="form.telephone = $event"
              :hasPreIcon="true"
              :required="true"
            />
            <p v-if="invalidTelephoneError" class="mt-1 text-sm text-red-600 font-bold">
              {{ invalidTelephoneError }}
            </p>   
          </div>
      </div>
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
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Password Field -->
        <div class="flex-1">
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
          <p v-if="passwordLengthError" class="mt-1 text-sm text-red-600 font-bold">
            {{ passwordLengthError }}
          </p>
        </div>
        <!-- Password Confirmation Field -->
        <div class="flex-1">
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
          <p v-if="passwordMismatchError" class="mt-1 text-sm text-red-600 font-bold">
            {{ passwordMismatchError }}
          </p>
        </div>
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

