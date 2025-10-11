import { useMutation } from "@tanstack/react-query";
import { deleteAnimeFromWatchlist } from "../shared/firestore";
import type { AnimeListItem } from "../shared/interfaces";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { removeWatchlistId } from "../store/slices/watchlistSlice";

export function useRemoveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (anime: AnimeListItem) => {
            return deleteAnimeFromWatchlist(anime, userId);
        },
        onSuccess: (result) => {
            if (userId && result?.success && result?.id) {
                dispatch(removeWatchlistId(result.id));
            }
        },
        onError: (error) => {
            console.log(error)
        }
    });
}