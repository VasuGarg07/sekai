import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem, WatchStatus } from "../shared/interfaces";
import { saveAnimeToWatchlist } from "../shared/firestore";
import { toastService } from "../ui/toastService";

export function useSaveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const defaultStatus = useAppSelector(state => state.preferences.default_watch_status) as WatchStatus;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (anime: AnimeListItem) => {
            return saveAnimeToWatchlist(anime, userId, defaultStatus);
        },
        onSuccess: (result, anime) => {
            const title = anime.title_english ?? anime.title_romaji ?? "Anime";

            if (result.success) {
                toastService.success(`${title} added to watchlist.`);
                queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
                return;
            }

            switch (result.reason) {
                case 'not-logged-in':
                    toastService.info("Please login first.");
                    break;
                case 'already-exists':
                    toastService.error(`${title} is already in your watchlist.`);
                    break;
                case 'limit-reached':
                    toastService.error("Watchlist limit reached. Please remove some items first.");
                    break;
                case 'error':
                    toastService.error("Something went wrong. Please try again.");
                    break;
            }
        },
        onError: () => {
            toastService.error("Something went wrong. Please try again.");
        },
    });
}