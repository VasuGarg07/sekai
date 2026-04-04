import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import type { AnimeWatchList } from "../shared/interfaces";

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);

    const query = useQuery<AnimeWatchList[], Error>({
        queryKey: ["watchlist", user?.uid],
        queryFn: () => fetchUserWatchList(user!.uid),
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.uid,
    });

    const refetch = () => {
        const timeSinceLastFetch = query.dataUpdatedAt
            ? Date.now() - query.dataUpdatedAt
            : Infinity;
        if (timeSinceLastFetch < MIN_REFRESH_INTERVAL) return;
        query.refetch();
    };

    return {
        ...query,
        refetch,
    };
}