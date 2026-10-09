import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiClient';

const MAX_RATE_LIMIT_RETRIES = 3;
const MAX_TRANSIENT_RETRIES = 2;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,   // 5 Min
            gcTime: 10 * 60 * 1000,     // 10 Min
            // Only retry failures that can succeed on a second try
            retry: (failureCount, error: unknown) => {
                if (!(error instanceof ApiError)) return false;
                if (error.isRateLimited) return failureCount < MAX_RATE_LIMIT_RETRIES;
                if (error.isServerError || error.isNetworkError) return failureCount < MAX_TRANSIENT_RETRIES;
                return false;
            },
            retryDelay: (attemptIndex, error: unknown) => {
                // Rate limits need a longer back-off than flaky network/server errors
                const base = error instanceof ApiError && error.isRateLimited ? 2000 : 1000;
                return Math.min(base * 2 ** attemptIndex, 8000);
            },
        },
        mutations: {
            retry: 1,
        },
    },
});
