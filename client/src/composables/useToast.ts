import { toast, type ToastOptions } from 'vue3-toastify';

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  theme: 'colored',
  transition: 'slide',
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', options?: ToastOptions) => {
    const toastOptions = { ...defaultOptions, ...options };
    toast[type](message, toastOptions);
  };

  return {
    success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
    error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
    warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
    info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
  };
};

