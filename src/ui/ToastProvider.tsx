import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { toastService } from './toastService';
import type { ToastType } from '../shared/interfaces';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => {
            const updated = [...prev, newToast];
            if (updated.length > 3) {
                const removedToast = prev[0];
                const timeout = timeoutsRef.current.get(removedToast.id);
                if (timeout) {
                    clearTimeout(timeout);
                    timeoutsRef.current.delete(removedToast.id);
                }
            }
            return updated.slice(-3);
        });

        const timeout = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            timeoutsRef.current.delete(id);
        }, 5000);

        timeoutsRef.current.set(id, timeout);
    }, []);

    const removeToast = (id: string) => {
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    useEffect(() => {
        toastService._setAddToast(addToast);
    }, [addToast]);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            timeoutsRef.current.clear();
        };
    }, []);

    return (
        <>
            {children}
            {toasts.length > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </div>
            )}
        </>
    );
}

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const config = {
        success: { color: 'bg-green-500' },
        error: { color: 'bg-red-500' },
        warning: { color: 'bg-yellow-500' },
        info: { color: 'bg-blue-500' },
    } as const;

    const { color } = config[toast.type];

    return (
        <div className="animate-slide-up pointer-events-auto">
            <div className="bg-zinc-800 border border-zinc-700 rounded-full shadow-lg flex items-center gap-3 pl-4 pr-2 py-2.5 min-w-70 max-w-100">
                <div className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} />
                <span className="text-sm text-white flex-1 truncate">{toast.message}</span>
                <button
                    onClick={onClose}
                    type="button"
                    className="text-zinc-400 hover:text-white transition-colors shrink-0 p-1 hover:bg-zinc-800 rounded-full"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};