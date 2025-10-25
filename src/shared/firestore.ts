import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { AnimeListItem, AnimeWatchList, WatchStatus } from "./interfaces";
import { toastService } from "./toastr";
import { fireStore } from "./firebase";
import type { User } from "firebase/auth";
import { cleanAnimeForWatchlist } from "./utilities";
import { MAX_USER_DOCUMENTS } from "./constants";

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

// TODO: Add index to existing documents:
// export const fetchUserWatchList = async (
//     uid: string,
//     page: number = 1,
//     perPage: number = 20
// ): Promise<PagedResult> => {
//     const ref = collection(fireStore, "users", uid, "watchlist");
    
//     // Get total count
//     const countSnapshot = await getCountFromServer(ref);
//     const total = countSnapshot.data().count;
    
//     const lastPage = Math.ceil(total / perPage);
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage - 1;
    
//     // Query by index range
//     const q = query(
//         ref,
//         where("paginationIndex", ">=", startIndex),
//         where("paginationIndex", "<=", endIndex),
//         orderBy("paginationIndex", "desc"),
//         orderBy("addedAt", "desc")
//     );
    
//     const snapshot = await getDocs(q);
//     const items: AnimeListItem[] = snapshot.docs.map(
//         (doc) => doc.data() as AnimeListItem
//     );
    
//     return {
//         items,
//         pageInfo: {
//             total,
//             perPage,
//             currentPage: page,
//             lastPage,
//             hasNextPage: page < lastPage
//         }
//     };
// };