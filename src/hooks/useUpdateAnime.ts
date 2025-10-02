import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWatchStatus } from "../shared/firestore";
import type { AnimeWatchList, WatchStatus } from "../shared/interfaces";
import { useAppSelector } from "../store/reduxHooks";

interface useUpdateAnimeProps {
    anime: AnimeWatchList;
    watchStatus: WatchStatus;
}

export function useUpdateAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ anime, watchStatus }: useUpdateAnimeProps) => {
            return updateWatchStatus(anime, watchStatus, userId);
        },
        onSuccess: (result) => {
            if (userId && result?.success && result?.id) {
                queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
            }
        },
        onError: (error) => {
            console.log(error)
        }
    });
}