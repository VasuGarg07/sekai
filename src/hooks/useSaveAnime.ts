import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem, WatchStatus } from "../shared/interfaces";
import { addWatchlistId } from "../store/slices/watchlistSlice";
import { saveAnimeToWatchlist } from "../shared/firestore";

export function useSaveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (anime: AnimeListItem, watchStatus: WatchStatus = 'plan-to-watch') => {
            return saveAnimeToWatchlist(anime, userId, watchStatus);
        },
        onSuccess: (result) => {
            if (userId && result?.success && result.id) {
                dispatch(addWatchlistId(result.id));
            }
        }
    });
} 