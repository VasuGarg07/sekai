import {
    collection, deleteDoc, doc, getCountFromServer,
    getDoc, getDocs, limit, orderBy, query,
    serverTimestamp, setDoc, updateDoc
} from "firebase/firestore";
import type { AnimeListItem, AnimeWatchList, UserPreferences, WatchStatus } from "./interfaces";
import { fireStore } from "./firebase";
import type { User } from "firebase/auth";
import { cleanAnimeForWatchlist } from "./utilities";
import { DEFAULT_PREFERENCES, MAX_USER_DOCUMENTS } from "./constants";

// --- Result types ---

type SaveResult =
    | { success: true; item: AnimeWatchList }
    | { success: false; reason: 'not-logged-in' | 'already-exists' | 'limit-reached' | 'error'; error?: unknown };

type DeleteResult =
    | { success: true; id: string }
    | { success: false; reason: 'not-logged-in' | 'error'; error?: unknown };

type UpdateStatusResult =
    | { success: true; id: string; status: WatchStatus }
    | { success: false; reason: 'not-logged-in' | 'error'; error?: unknown };

type PreferencesResult =
    | { success: true; data: UserPreferences }
    | { success: false; reason: 'error'; error?: unknown };

type VoidResult =
    | { success: true }
    | { success: false; reason: 'error'; error?: unknown };

// --- Profile ---

export const registerProfile = async (user?: User): Promise<VoidResult> => {
    if (!user) return { success: true }; // no-op, not an error

    try {
        const ref = doc(fireStore, "profiles", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) return { success: true };

        await setDoc(ref, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

// --- Preferences ---

/**
 * Fetches preferences for a user. Creates a default doc if one doesn't exist yet.
 * Called on every login via useAuthListener.
 */
export const upsertPreferences = async (uid: string): Promise<PreferencesResult> => {
    try {
        const ref = doc(fireStore, "preferences", uid);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            await setDoc(ref, DEFAULT_PREFERENCES);
            return { success: true, data: DEFAULT_PREFERENCES };
        }

        return { success: true, data: snapshot.data() as UserPreferences };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

export const updatePreferences = async (
    uid: string,
    updates: Partial<UserPreferences>
): Promise<VoidResult> => {
    try {
        const ref = doc(fireStore, "preferences", uid);
        await updateDoc(ref, updates);
        return { success: true };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

// --- Watchlist ---

export const fetchUserWatchList = async (uid: string): Promise<AnimeWatchList[]> => {
    const ref = collection(fireStore, "users", uid, "watchlist");
    const q = query(ref, orderBy("addedAt", "desc"), limit(MAX_USER_DOCUMENTS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as AnimeWatchList);
};

export const saveAnimeToWatchlist = async (
    anime: AnimeListItem,
    userId?: string,
    watchStatus: WatchStatus = 'plan-to-watch',
): Promise<SaveResult> => {
    if (!userId) return { success: false, reason: 'not-logged-in' };

    try {
        const ref = collection(fireStore, "users", userId, "watchlist");
        const countSnapshot = await getCountFromServer(ref);

        if (countSnapshot.data().count >= MAX_USER_DOCUMENTS) {
            return { success: false, reason: 'limit-reached' };
        }

        const docId = anime.id.toString();
        const docRef = doc(fireStore, "users", userId, "watchlist", docId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return { success: false, reason: 'already-exists' };
        }

        const item: AnimeWatchList = {
            ...cleanAnimeForWatchlist(anime),
            watchStatus,
            addedAt: Date.now(),
        };

        await setDoc(docRef, item);
        return { success: true, item };

    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

export const deleteAnimeFromWatchlist = async (
    anime: AnimeListItem,
    uid?: string,
): Promise<DeleteResult> => {
    if (!uid) return { success: false, reason: 'not-logged-in' };

    try {
        const docId = anime.id.toString();
        const ref = doc(fireStore, "users", uid, "watchlist", docId);
        await deleteDoc(ref);
        return { success: true, id: docId };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

export const updateWatchStatus = async (
    anime: AnimeListItem,
    newStatus: WatchStatus,
    uid?: string,
): Promise<UpdateStatusResult> => {
    if (!uid) return { success: false, reason: 'not-logged-in' };

    try {
        const docId = anime.id.toString();
        const ref = doc(fireStore, "users", uid, "watchlist", docId);
        await updateDoc(ref, { watchStatus: newStatus });
        return { success: true, id: docId, status: newStatus };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};