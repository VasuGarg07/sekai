import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import type { AnimeListItem, WatchStatus } from "./interfaces";
import { toastService } from "./toastr";
import { fireStore } from "./firebase";
import type { User } from "firebase/auth";

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

export const registerProfile = async (user?: User) => {
    if (!user) return;

    const ref = doc(fireStore, "profiles", user.uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) return;

    await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
    })
}

export const fetchWatchlistIds = async (uid: string) => {
    const ref = collection(fireStore, "users", uid, "watchlist");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => doc.id);
};