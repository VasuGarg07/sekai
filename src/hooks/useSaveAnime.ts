import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem, WatchStatus } from "../shared/interfaces";
import { addItemToWatchlist } from "../store/slices/watchlistSlice";
import { saveAnimeToWatchlist } from "../shared/firestore";

export function useSaveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const defaultStatus = useAppSelector(state => state.preferences.default_watch_status) as WatchStatus;
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (anime: AnimeListItem) => {
            return saveAnimeToWatchlist(anime, userId, defaultStatus);
        },
        onSuccess: (result) => {
            if (userId && result?.success && result.item) {
                dispatch(addItemToWatchlist(result.item));
            }
        }
    });
}