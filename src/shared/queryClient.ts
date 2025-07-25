import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,   // 5 Min
            gcTime: 10 * 60 * 1000,     // 10 Min
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 429) return failureCount < 3;
                if (error?.response?.status >= 500) return failureCount < 2;
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