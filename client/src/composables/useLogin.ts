import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/vue-query';

import { login, type LoginDto } from '@/api/public/auth';
import { useAuth, type UserRole } from './useAuth';

export const useLogin = () => {
  const router = useRouter();
  const route = useRoute();
  const { login: setAuthToken } = useAuth();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: (data) => {
      // Store token using useAuth composable
      setAuthToken(data.access_token);

      try {
        // Decode token to get user role immediately
        const decoded = jwtDecode<{ role?: UserRole }>(data.access_token);
        const userRole = decoded.role;

        // Get redirect path from query params (if user was redirected from protected route)
        const redirectPath = route.query.redirect as string | undefined;

        if (redirectPath) {
          // If there's a redirect query param, use it
          router.push(redirectPath);
        } else {
          // Otherwise, redirect based on role
          if (userRole === 'ADMIN') {
            router.push('/protected/projects');
          } else {
            // Redirect freelancers to tasks page
            router.push('/tasks');
          }
        }
      } catch (error) {
        console.error('Failed to decode token for redirect:', error);
        // Fallback to home if decoding fails
        router.push('/');
      }
    },
  });

  // Extract error message based on status code
  // 401: message is a string
  // 400: message is an array
  const errorMessage = computed(() => {
    if (!error.value) return 'Invalid email or password. Please try again.';

    const axiosError = error.value as AxiosError<{ message: string | string[] }>;

    if (axiosError.response?.data?.message) {
      const message = axiosError.response.data.message;
      const status = axiosError.response.status;

      // 401: message is a string
      if (status === 401) {
        return typeof message === 'string' ? message : message[0];
      }

      // 400: message is an array
      if (status === 400) {
        return Array.isArray(message) ? message[0] : message;
      }

      // Fallback for other status codes
      return Array.isArray(message) ? message[0] : message;
    }

    return 'Invalid email or password. Please try again.';
  });

  return {
    loginMutation,
    isPending,
    isError,
    error,
    errorMessage,
  };
};
