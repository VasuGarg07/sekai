import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import type { AnimeWatchList } from "../shared/interfaces";
import { useEffect } from "react";
import { syncWatchlistIfStale } from "../shared/syncWatchlist";

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);
    const lastSyncedAt = useAppSelector(state => state.preferences.lastSyncedAt) as number | undefined;
    const queryClient = useQueryClient();

    const query = useQuery<AnimeWatchList[], Error>({
        queryKey: ["watchlist", user?.uid],
        queryFn: () => fetchUserWatchList(user!.uid),
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.uid,
    });

    useEffect(() => {
        if (!user?.uid || !query.data?.length) return;

        syncWatchlistIfStale(user.uid, query.data, lastSyncedAt).then(() => {
            queryClient.invalidateQueries({ queryKey: ["watchlist", user.uid] });
        });
    }, [user?.uid, query.dataUpdatedAt]);

    const refetch = () => {
        const timeSinceLastFetch = query.dataUpdatedAt
            ? Date.now() - query.dataUpdatedAt
            : Infinity;
        if (timeSinceLastFetch < MIN_REFRESH_INTERVAL) return;
        query.refetch();
    };

    return {
        ...query,
        refetch, // must come after spread so it overrides query.refetch
    };
}