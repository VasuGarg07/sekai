import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnimeFromWatchlist } from "../shared/firestore";
import type { AnimeListItem } from "../shared/interfaces";
import { useAppSelector } from "../store/reduxHooks";
import { toastService } from "../ui/toastService";

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
                queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
                return;
            }

            switch (result.reason) {
                case 'not-logged-in':
                    toastService.info("Please login first.");
                    break;
                case 'error':
                    toastService.error("Failed to remove from watchlist. Please try again.");
                    break;
            }
        },
        onError: () => {
            toastService.error("Something went wrong. Please try again.");
        },
    });
}