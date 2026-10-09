import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem, WatchStatus } from "../shared/interfaces";
import { saveAnimeToWatchlist } from "../shared/firestore";
import { toastService } from "../ui/toastService";
import { MAX_USER_DOCUMENTS } from "../shared/constants";
import { updateCachedWatchlistIds } from "./useWatchlistSet";

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
                updateCachedWatchlistIds(queryClient, userId, { add: anime.id });
                queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
                return;
            }

            switch (result.reason) {
                case 'not-logged-in':
                    toastService.info("Log in to add anime to your watchlist.");
                    break;
                case 'already-exists':
                    toastService.info(`${title} is already in your watchlist.`);
                    break;
                case 'limit-reached':
                    toastService.error(`Your watchlist is full (${MAX_USER_DOCUMENTS.toLocaleString()} titles). Remove some to add more.`);
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