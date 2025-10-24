import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import { toastService } from "../shared/toastr";
import type { AnimeWatchList } from "../shared/interfaces";
import { setWatchlist } from "../store/slices/watchlistSlice";
import { useEffect } from "react";

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);
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
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setWatchlist(query.data));
        }
    }, [query.data, dispatch]);

    return query;
}