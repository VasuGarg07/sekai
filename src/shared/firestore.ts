import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AnimeListItem, WatchStatus } from "./interfaces";
import { toastService } from "./toastr";
import { fireStore } from "./firebase";

export const saveAnimeToWatchlist = async (anime: AnimeListItem, userId?: string, watchStatus: WatchStatus = 'plan-to-watch') => {
    if (!userId) {
        return toastService.info("Please Login First");
    }

    const ref = doc(fireStore, "users", userId, "watchlist", anime.id.toString());
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        return toastService.error(`${anime.title_english ?? anime.title_romaji} already exists in watchlist`);
    }

    await setDoc(ref, {
        ...anime,
        status: watchStatus,
        addedAt: Date.now()
    })

    return toastService.success(`${anime.title_english ?? anime.title_romaji} is added to watchlist`);
}