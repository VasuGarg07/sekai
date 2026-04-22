import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWatchStatus } from "../shared/firestore";
import type { AnimeWatchList, WatchStatus } from "../shared/interfaces";
import { useAppSelector } from "../store/reduxHooks";
import { toastService } from "../ui/toastService";

interface UpdateAnimeProps {
    anime: AnimeWatchList;
    watchStatus: WatchStatus;
}

export function useUpdateAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ anime, watchStatus }: UpdateAnimeProps) => {
            return updateWatchStatus(anime, watchStatus, userId);
        },
        onSuccess: (result, { anime, watchStatus }) => {
            const title = anime.title_english ?? anime.title_romaji ?? "Anime";

            if (result.success) {
                toastService.success(`${title} updated to ${watchStatus}.`);
                queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
                return;
            }

            switch (result.reason) {
                case 'not-logged-in':
                    toastService.info("Please login first.");
                    break;
                case 'error':
                    toastService.error("Failed to update watch status. Please try again.");
                    break;
            }
        },
        onError: () => {
            toastService.error("Something went wrong. Please try again.");
        },
    });
}