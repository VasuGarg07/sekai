import { useQuery, type QueryClient } from "@tanstack/react-query";
import { fetchWatchlistIds } from "../shared/firestore";
import { useAppSelector } from "../store/reduxHooks";

const EMPTY = new Set<number>();

export const watchlistIdsKey = (uid: string | undefined) => ["watchlistIds", uid] as const;

/** Ids of every anime in the user's watchlist (not just the loaded page). Empty when logged out. */
export function useWatchlistSet(): Set<number> {
    const uid = useAppSelector(state => state.auth.user?.uid);

    const { data } = useQuery({
        queryKey: watchlistIdsKey(uid),
        queryFn: async () => new Set(await fetchWatchlistIds(uid!)),
        enabled: !!uid,
        staleTime: 10 * 60 * 1000,
    });

    return data ?? EMPTY;
}

/** Keeps the cached id set in step with a successful add/remove, without re-reading Firestore. */
export function updateCachedWatchlistIds(
    queryClient: QueryClient,
    uid: string | undefined,
    change: { add?: number; remove?: number },
) {
    queryClient.setQueryData<Set<number>>(watchlistIdsKey(uid), (prev) => {
        const next = new Set(prev ?? []);
        if (change.add !== undefined) next.add(change.add);
        if (change.remove !== undefined) next.delete(change.remove);
        return next;
    });
}
