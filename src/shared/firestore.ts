import type { User } from "firebase/auth";
import {
    arrayRemove, arrayUnion,
    collection,
    doc,
    getDoc, getDocs, limit, orderBy,
    query,
    QueryDocumentSnapshot,
    runTransaction,
    serverTimestamp, setDoc, startAfter, updateDoc, writeBatch
} from "firebase/firestore";
import { DEFAULT_PREFERENCES, MAX_USER_DOCUMENTS } from "./constants";
import { fireStore } from "./firebase";
import type { AnimeListItem, UserPreferences, WatchlistEntry, WatchStatus } from "./interfaces";

// --- Result types ---

type SaveResult =
    | { success: true; item: WatchlistEntry }
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

/**
 * Creates the profile on first login, and afterwards updates the name/email/photo when they change
 * (e.g. an email sign-up sets its name just after the account is created).
 */
export const registerProfile = async (user?: User): Promise<VoidResult> => {
    if (!user) return { success: true }; // no-op, not an error

    try {
        const ref = doc(fireStore, "profiles", user.uid);
        const snapshot = await getDoc(ref);
        const current = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        };

        if (!snapshot.exists()) {
            await setDoc(ref, { uid: user.uid, ...current, createdAt: serverTimestamp() });
            return { success: true };
        }

        const stored = snapshot.data();
        const changed = Object.fromEntries(
            Object.entries(current).filter(([key, value]) => stored[key] !== value)
        );
        if (Object.keys(changed).length > 0) await updateDoc(ref, changed);

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

        // Fill in fields added after the doc was created (e.g. adult_mode)
        return { success: true, data: { ...DEFAULT_PREFERENCES, ...(snapshot.data() as Partial<UserPreferences>) } };
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
//
// users/{uid}/watchlist/{animeId}  -> WatchlistEntry (id, titles, format, watchStatus, addedAt)
// users/{uid}/meta/watchlist       -> { ids: number[] }  every saved anime id, for quick "is it saved?" checks
//
// Both are always written together (transaction / batch) so they can't drift apart.

/** Stored document; older ones may still carry a full anime snapshot */
export type StoredWatchlistDoc = WatchlistEntry & Partial<AnimeListItem>;

const PAGE_SIZE = 24;

const watchlistCollection = (uid: string) => collection(fireStore, "users", uid, "watchlist");
const watchlistDoc = (uid: string, animeId: number) => doc(fireStore, "users", uid, "watchlist", String(animeId));
const watchlistIdsDoc = (uid: string) => doc(fireStore, "users", uid, "meta", "watchlist");

export async function fetchUserWatchList(uid: string, lastDoc?: QueryDocumentSnapshot): Promise<{
    data: StoredWatchlistDoc[];
    lastDoc: QueryDocumentSnapshot | null;
}> {
    const ref = watchlistCollection(uid);
    const q = lastDoc
        ? query(ref, orderBy("addedAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE))
        : query(ref, orderBy("addedAt", "desc"), limit(PAGE_SIZE));

    const { docs } = await getDocs(q);

    return {
        data: docs.map(doc => doc.data() as StoredWatchlistDoc),
        // A short page means there's nothing after it
        lastDoc: docs.length === PAGE_SIZE ? docs[docs.length - 1] : null,
    };
}

/** Every watchlist entry, newest first. Used for exports, where a paginated view isn't enough. */
export async function fetchEntireWatchList(uid: string): Promise<StoredWatchlistDoc[]> {
    const { docs } = await getDocs(query(watchlistCollection(uid), orderBy("addedAt", "desc")));
    return docs.map(doc => doc.data() as StoredWatchlistDoc);
}

/** Ids of everything in the user's watchlist (one document read). */
export async function fetchWatchlistIds(uid: string): Promise<number[]> {
    const snapshot = await getDoc(watchlistIdsDoc(uid));
    // Missing until the user's first save (or until the migration script has run for older accounts)
    return snapshot.exists() ? ((snapshot.data().ids as number[] | undefined) ?? []) : [];
}

export const saveAnimeToWatchlist = async (
    anime: AnimeListItem,
    userId?: string,
    watchStatus: WatchStatus = 'plan-to-watch',
): Promise<SaveResult> => {
    if (!userId) return { success: false, reason: 'not-logged-in' };

    try {
        return await runTransaction(fireStore, async (tx) => {
            const idsSnapshot = await tx.get(watchlistIdsDoc(userId));
            const ids: number[] = idsSnapshot.exists() ? (idsSnapshot.data().ids ?? []) : [];

            if (ids.includes(anime.id)) return { success: false, reason: 'already-exists' } as const;
            if (ids.length >= MAX_USER_DOCUMENTS) return { success: false, reason: 'limit-reached' } as const;

            const item: WatchlistEntry = {
                id: anime.id,
                title_romaji: anime.title_romaji,
                title_english: anime.title_english,
                format: anime.type,
                watchStatus,
                addedAt: Date.now(),
            };
            tx.set(watchlistDoc(userId, anime.id), item);
            tx.set(watchlistIdsDoc(userId), { ids: arrayUnion(anime.id) }, { merge: true });
            return { success: true, item } as const;
        });
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

export const deleteAnimeFromWatchlist = async (
    anime: Pick<AnimeListItem, "id">,
    uid?: string,
): Promise<DeleteResult> => {
    if (!uid) return { success: false, reason: 'not-logged-in' };

    try {
        const batch = writeBatch(fireStore);
        batch.delete(watchlistDoc(uid, anime.id));
        batch.set(watchlistIdsDoc(uid), { ids: arrayRemove(anime.id) }, { merge: true });
        await batch.commit();
        return { success: true, id: String(anime.id) };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};

export const updateWatchStatus = async (
    anime: Pick<AnimeListItem, "id">,
    newStatus: WatchStatus,
    uid?: string,
): Promise<UpdateStatusResult> => {
    if (!uid) return { success: false, reason: 'not-logged-in' };

    try {
        await updateDoc(watchlistDoc(uid, anime.id), { watchStatus: newStatus });
        return { success: true, id: String(anime.id), status: newStatus };
    } catch (error) {
        return { success: false, reason: 'error', error };
    }
};
