import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import type { QueryDocumentSnapshot } from "firebase/firestore";

// TODO: Hook in syncWatchlist.ts hook

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["watchlist", user?.uid],
        queryFn: ({ pageParam }: { pageParam?: QueryDocumentSnapshot }) => fetchUserWatchList(user!.uid, pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.uid,
    });

    const watchlistItems = query.data?.pages.flatMap(page => page.data) ?? [];
    const refresh = () => {
        if (!user?.uid) return;

        queryClient.invalidateQueries({
            queryKey: ["watchlist", user?.uid]
        });
    }

    return {
        ...query,
        watchlistItems,
        refresh
    }
}