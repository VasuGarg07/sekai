import type { ToastType } from "../shared/interfaces";

class ToastService {
    private addToast: ((message: string, type: ToastType) => void) | null = null;

    _setAddToast(fn: (message: string, type: ToastType) => void) {
        this.addToast = fn;
    }

    success(message: string) {
        this.addToast?.(message, 'success');
    }

    error(message: string) {
        this.addToast?.(message, 'error');
    }

    warning(message: string) {
        this.addToast?.(message, 'warning');
    }

    info(message: string) {
        this.addToast?.(message, 'info');
    }
}

export const toastService = new ToastService();