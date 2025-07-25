import { toast, type ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
};

export const toastService = {
    success: (message: string) => toast.success(message, defaultOptions),
    error: (message: string) => toast.error(message, defaultOptions),
    warning: (message: string) => toast.warning(message, defaultOptions),
    info: (message: string) => toast.info(message, defaultOptions),
    message: (message: string) => toast(message, defaultOptions)
} as const;