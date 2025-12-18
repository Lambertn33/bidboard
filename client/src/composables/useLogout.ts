import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { logout } from '@/api/public/auth';
import { useAuth } from './useAuth';

export const useLogout = () => {
  const router = useRouter();
  const { logout: clearAuth, sessionId } = useAuth();

  const { mutate: logoutMutation, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      const currentSessionId = sessionId.value;
      if (!currentSessionId) {
        // If no sessionId, just clear local auth (for cases where sessionId might be missing)
        clearAuth();
        return { message: 'Logged out successfully' };
      }
      return logout(currentSessionId);
    },
    onSuccess: () => {
      // Clear local auth state after successful API call
      clearAuth();
      // Redirect to home page
      router.replace('/');
    },
    onError: () => {
      // Even if API call fails, clear local auth state
      // This handles cases where the session might already be deleted or expired
      clearAuth();
      router.replace('/');
    },
  });

  const errorMessage = computed(() => {
    if (!error.value) return null;

    const axiosError = error.value as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || 'Failed to logout. Please try again.';
  });

  return {
    logoutMutation,
    isPending,
    isError,
    error,
    errorMessage,
  };
};

