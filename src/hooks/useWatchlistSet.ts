import { useMemo } from "react";
import { useGetWatchlist } from "./useGetWatchlist";

export function useWatchlistSet(): Set<number> {
    const { watchlistItems } = useGetWatchlist();
    return useMemo(
        () => new Set(watchlistItems.map(item => item.id)),
        [watchlistItems]
    );
}