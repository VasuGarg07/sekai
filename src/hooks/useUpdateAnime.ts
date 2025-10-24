import { useMutation } from "@tanstack/react-query";
import { updateWatchStatus } from "../shared/firestore";
import type { AnimeWatchList, WatchStatus } from "../shared/interfaces";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { updateWatchlistStatus } from "../store/slices/watchlistSlice";

interface useUpdateAnimeProps {
    anime: AnimeWatchList;
    watchStatus: WatchStatus;
}

export function useUpdateAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async ({ anime, watchStatus }: useUpdateAnimeProps) => {
            return updateWatchStatus(anime, watchStatus, userId);
        },
        onSuccess: (result) => {
            if (userId && result?.success && result?.id && result?.status) {
                dispatch(updateWatchlistStatus({
                    id: result.id,
                    status: result.status
                }));
            }
        },
        onError: (error) => {
            console.log(error)
        }
    });
}