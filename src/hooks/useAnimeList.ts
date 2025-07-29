import { useQuery } from '@tanstack/react-query';
import type { AnimeListResponse } from '../shared/interfaces';
import jikanClient from '../shared/jikanClient';
import { toastService } from '../shared/toastr';

type UseAnimeListOptions = {
    path: string;                           // e.g. '/top/anime'
    params?: Record<string, any>;           // query params (converted to ?key=value)
    queryKey?: string[];                    // optional override for cache key
    toastOnError?: boolean;                 // toggle error toast
};

type UseAnimeListReturn = {
    isLoading: boolean;
    response?: AnimeListResponse;
    errorMessage?: string;
    retry: () => void;
};

export const useAnimeList = ({
    path,
    params = {},
    queryKey,
    toastOnError = true,
}: UseAnimeListOptions): UseAnimeListReturn => {
    const searchParams = new URLSearchParams(params).toString();
    const fullPath = searchParams ? `${path}?${searchParams}` : path;

    const query = useQuery<AnimeListResponse, Error>({
        queryKey: queryKey ?? [path, searchParams],
        queryFn: async () => {
            const { data } = await jikanClient.get(fullPath);
            return data;
        },
        retry: false,
    });

    if (query.isError && toastOnError) {
        toastService.error(`Failed to load data: ${query.error.message}`);
        console.error(query.error);
    }

    return {
        isLoading: query.isLoading,
        response: query.data,
        errorMessage: query.isError ? query.error.message : undefined,
        retry: query.refetch,
    };
};
