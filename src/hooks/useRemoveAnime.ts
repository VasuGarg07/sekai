import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnimeFromWatchlist } from "../shared/firestore";
import type { AnimeListItem } from "../shared/interfaces";
import { useAppSelector } from "../store/reduxHooks";
import { toastService } from "../ui/toastService";
import { updateCachedWatchlistIds } from "./useWatchlistSet";

export function useRemoveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (anime: AnimeListItem) => {
            return deleteAnimeFromWatchlist(anime, userId);
        },
        onSuccess: (result, anime) => {
            const title = anime.title_english ?? anime.title_romaji ?? "Anime";

            if (result.success) {
                toastService.success(`${title} removed from watchlist.`);
                updateCachedWatchlistIds(queryClient, userId, { remove: anime.id });
                queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
                return;
            }

            switch (result.reason) {
                case 'not-logged-in':
                    toastService.info("Log in to manage your watchlist.");
                    break;
                case 'error':
                    toastService.error("Couldn't remove it from your watchlist. Please try again.");
                    break;
            }
        },
        onError: () => {
            toastService.error("Something went wrong. Please try again.");
        },
    });
}