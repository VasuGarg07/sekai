import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import { fetchUserWatchList } from "../shared/firestore";
import { toastService } from "../shared/toastr";
import type { AnimeWatchList } from "../shared/interfaces";

export function useGetWatchlist() {
    const { user } = useAppSelector(state => state.auth);

    return useQuery<AnimeWatchList[], Error>({
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
}