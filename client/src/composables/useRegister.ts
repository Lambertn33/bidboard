import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/vue-query';

import { register, type RegisterDto } from '@/api/public/auth';
import { useAuth, type UserRole } from './useAuth';

export const useRegister = () => {
  const router = useRouter();
  const { login: setAuthToken } = useAuth();

  const { mutate: registerMutation, isPending, isError, error } = useMutation({
    mutationFn: (data: RegisterDto) => register(data),
    onSuccess: (data) => {
      // Extract access_token from response (structure: { message, data: { user, access_token } })
      const accessToken = data.data?.access_token;
      
      if (!accessToken) {
        router.push('/login');
        return;
      }
      setAuthToken(accessToken);

      try {
        const decoded = jwtDecode<{ role?: UserRole }>(accessToken);
        const userRole = decoded.role;

        if (userRole === 'ADMIN') {
          router.push('/protected/projects');
        } else {
          router.push('/tasks');
        }
      } catch (error) {
        console.error('Failed to decode token for redirect:', error);
        router.push('/');
      }
    },
  });

  // Extract error message based on status code
  // 400: message is typically an array for validation errors
  // Other errors: message might be a string
  const errorMessage = computed(() => {
    if (!error.value) return 'Failed to register. Please try again.';

    const axiosError = error.value as AxiosError<{ message: string | string[] }>;

    if (axiosError.response?.data?.message) {
      const message = axiosError.response.data.message;
      const status = axiosError.response.status;

      // 400: message is typically an array for validation errors
      if (status === 400) {
        return Array.isArray(message) ? message[0] : message;
      }

      // Fallback for other status codes
      return Array.isArray(message) ? message[0] : message;
    }

    return 'Failed to register. Please try again.';
  });

  return {
    registerMutation,
    isPending,
    isError,
    error,
    errorMessage,
  };
};

