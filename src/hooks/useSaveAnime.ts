import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem, WatchStatus } from "../shared/interfaces";
import { toastService } from "../shared/toastr";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fireStore } from "../shared/firebase";

export function useSaveAnime() {
    const userId = useAppSelector(state => state.auth.user?.uid);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (anime: AnimeListItem, watchStatus: WatchStatus = 'plan-to-watch') => {
            if (!userId) {
                toastService.info("Please Login First");
                return { success: false };
            }

            const ref = doc(fireStore, "users", userId, "watchlist", anime.id.toString());
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                toastService.error(`${anime.title_english ?? anime.title_romaji} already exists in watchlist`);
                return { success: false };
            }

            await setDoc(ref, {
                ...anime,
                watchStatus,
                updatedAt: Date.now()
            })
            toastService.success(`${anime.title_english ?? anime.title_romaji} is added to watchlist`);
            return { success: true };
        },
        onSuccess: (result) => {
            if (userId && result?.success) {
                queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
            }
        }
    })
} 