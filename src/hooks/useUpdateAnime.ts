import { useMutation } from "@tanstack/react-query";
import { updateWatchStatus } from "../shared/firestore";
import type { AnimeWatchList, WatchStatus } from "../shared/interfaces";
import { useAppSelector } from "../store/reduxHooks";

interface useUpdateAnimeProps {
    anime: AnimeWatchList;
    watchStatus: WatchStatus;
}

export function useUpdateAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);

    return useMutation({
        mutationFn: async ({ anime, watchStatus }: useUpdateAnimeProps) => {
            return updateWatchStatus(anime, watchStatus, userId);
        },
        onSuccess: (result) => {
            console.log(result);
        },
        onError: (error) => {
            console.log(error)
        }
    });
}