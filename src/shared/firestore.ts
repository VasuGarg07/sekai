import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { AnimeListItem, AnimeWatchList, WatchStatus } from "./interfaces";
import { toastService } from "./toastr";
import { fireStore } from "./firebase";
import type { User } from "firebase/auth";
import { cleanAnimeForWatchlist } from "./utilities";

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

export const fetchUserWatchList = async (uid: string) => {
    const ref = collection(fireStore, "users", uid, "watchlist");
    const snapshot = await getDocs(ref);
    const list: AnimeWatchList[] = snapshot.docs
        .map((doc) => doc.data() as AnimeWatchList)
        .sort((a, b) => b.addedAt - a.addedAt);
    return list;
}


export const saveAnimeToWatchlist = async (anime: AnimeListItem, userId?: string, watchStatus: WatchStatus = 'plan-to-watch') => {
    if (!userId) {
        toastService.info("Please Login First");
        return { success: false };
    }

    const docId = anime.id.toString();
    const ref = doc(fireStore, "users", userId, "watchlist", docId);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        toastService.error(`${anime.title_english ?? anime.title_romaji} already exists in watchlist`);
        return { success: false };
    }

    await setDoc(ref, {
        ...cleanAnimeForWatchlist(anime),
        watchStatus,
        addedAt: Date.now()
    })

    toastService.success(`${anime.title_english ?? anime.title_romaji} is added to watchlist`);
    return { success: true, id: docId };
}

export const deleteAnimeFromWatchlist = async (anime: AnimeListItem, uid?: string) => {
    if (!uid) return { success: false };

    const docId = anime.id.toString();
    const ref = doc(fireStore, "users", uid, "watchlist", docId);
    await deleteDoc(ref);
    return { success: true, id: docId };
}

export const updateWatchStatus = async (anime: AnimeListItem, newStatus: WatchStatus, uid?: string) => {
    if (!uid) return { success: false };

    const docId = anime.id.toString();
    const ref = doc(fireStore, "users", uid, "watchlist", docId);
    await updateDoc(ref, {
        watchStatus: newStatus
    });

    return { success: true, id: docId };
}