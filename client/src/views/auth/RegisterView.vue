<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { OhVueIcon } from 'oh-vue-icons';

import { Input } from '@/components/ui';

const router = useRouter();

const form = reactive({
  names: '',
  email: '',
  password: '',
});

const handleRegister = () => {
  console.log('Register clicked', form.names, form.email, form.password);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-16">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">Welcome to TaskBid</h1>
          <p class="text-blue-100 text-sm">Create an account to get started</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Names Field -->
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

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Register
            </button>
          </form>
          <!-- Sign Up Link -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <router-link
                to="/login"
                class="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Login
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

