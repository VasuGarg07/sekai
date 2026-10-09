import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import { hydrateWatchlist } from "../shared/watchlistHydration";
import { toastService } from "../ui/toastService";

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["watchlist", user?.uid],
        // Firestore gives the saved entries; AniList fills in up-to-date details for them
        queryFn: async ({ pageParam }: { pageParam?: QueryDocumentSnapshot }) => {
            const page = await fetchUserWatchList(user!.uid, pageParam);
            const { items, refreshFailed } = await hydrateWatchlist(page.data);
            return { data: items, lastDoc: page.lastDoc, refreshFailed };
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.uid,
    });

    const pages = query.data?.pages;
    const watchlistItems = useMemo(() => pages?.flatMap(page => page.data) ?? [], [pages]);

    const refreshFailed = pages?.some(page => page.refreshFailed) ?? false;
    useEffect(() => {
        if (refreshFailed) {
            toastService.warning("Couldn't load the latest details from AniList. Showing saved info.");
        }
    }, [refreshFailed]);

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
