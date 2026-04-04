import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,   // 5 Min
            gcTime: 10 * 60 * 1000,     // 10 Min
            retry: (failureCount, error: unknown) => {
                const msg = error instanceof Error ? error.message : '';
                if (msg.includes('Rate limited')) return failureCount < 3;
                if (msg.includes('Server error')) return failureCount < 2;
                return false;
            },
            retryDelay: (attemptIndex) => {
                return Math.min(1000 * 2 ** attemptIndex, 4000);
            },
        },
        mutations: {
            retry: 1,
        },
    },
});