import { useCallback } from "react";
import { useSearchParams } from "react-router";

/**
 * Current results page, stored in the URL as `?page=N`.
 * Keeping it in the URL means it resets naturally when the route changes,
 * survives refresh, and works with the browser Back button.
 */
export function usePageParam(): [number, (page: number) => void] {
    const [searchParams, setSearchParams] = useSearchParams();

    const raw = Number(searchParams.get("page"));
    const page = Number.isInteger(raw) && raw > 0 ? raw : 1;

    const setPage = useCallback((next: number) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if (next <= 1) params.delete("page");
            else params.set("page", String(next));
            return params;
        });
    }, [setSearchParams]);

    return [page, setPage];
}
