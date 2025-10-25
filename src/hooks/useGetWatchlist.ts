import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import { toastService } from "../shared/toastr";
import type { AnimeWatchList } from "../shared/interfaces";
import { setWatchlist } from "../store/slices/watchlistSlice";
import { useEffect } from "react";

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);
    const { lastFetched } = useAppSelector(state => state.watchlist);
    const dispatch = useAppDispatch();

    const query = useQuery<AnimeWatchList[], Error>({
        queryKey: ["watchlist", user?.uid],
        queryFn: () => {
            if (!user?.uid) {
                toastService.error("You must be logged in for this service");
                return [];
            }

            return fetchUserWatchList(user.uid);
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.uid, // Only run query if user exists
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setWatchlist(query.data));
        }
    }, [query.data, dispatch]);

    const refetch = () => {
        const timeSinceLastFetch = lastFetched ? Date.now() - lastFetched : Infinity;
        if (timeSinceLastFetch < MIN_REFRESH_INTERVAL) return;
        query.refetch();
    };

    return {
        ...query,
        refetch,
    };

}