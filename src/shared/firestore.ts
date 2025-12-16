import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { AnimeListItem, AnimeWatchList, UserPreferences, WatchStatus } from "./interfaces";
import { toastService } from "../ui/toastService";
import { fireStore } from "./firebase";
import type { User } from "firebase/auth";
import { cleanAnimeForWatchlist } from "./utilities";
import { DEFAULT_PREFERENCES, MAX_USER_DOCUMENTS } from "./constants";

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

export const registerPreferences = async (uid: string): Promise<UserPreferences> => {
    const ref = doc(fireStore, "preferences", uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
        await setDoc(ref, DEFAULT_PREFERENCES);
        return DEFAULT_PREFERENCES;
    }

    return snapshot.data() as UserPreferences;
};

export const updatePreferences = async (uid: string, updates: Partial<UserPreferences>) => {
    const ref = doc(fireStore, "preferences", uid);
    await updateDoc(ref, updates);
};

export const fetchUserWatchList = async (uid: string) => {
    const ref = collection(fireStore, "users", uid, "watchlist");
    const q = query(ref, orderBy("addedAt", "desc"), limit(MAX_USER_DOCUMENTS)); // Hard limit

    const snapshot = await getDocs(q);
    const list: AnimeWatchList[] = snapshot.docs
        .map((doc) => doc.data() as AnimeWatchList);
    return list;
}

export const saveAnimeToWatchlist = async (
    anime: AnimeListItem,
    userId?: string,
    watchStatus: WatchStatus = 'plan-to-watch',
) => {
    if (!userId) {
        toastService.info("Please Login First");
        return { success: false };
    }

    // Check count with aggregation (FREE - doesn't count toward reads!)
    const ref = collection(fireStore, "users", userId, "watchlist");
    const countSnapshot = await getCountFromServer(ref);

    if (countSnapshot.data().count >= 2000) {
        toastService.error("Watchlist limit reached. Please remove some items first.");
        return { success: false };
    }

    const docId = anime.id.toString();
    const docRef = doc(fireStore, "users", userId, "watchlist", docId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        toastService.error(`${anime.title_english ?? anime.title_romaji} already exists in watchlist`);
        return { success: false };
    }

    const item = {
        ...cleanAnimeForWatchlist(anime),
        watchStatus,
        addedAt: Date.now()
    }
    await setDoc(docRef, item);

    toastService.success(`${anime.title_english ?? anime.title_romaji} is added to watchlist`);
    return { success: true, item };
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

    return { success: true, id: docId, status: newStatus };
}