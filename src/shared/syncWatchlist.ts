import apiClient from "./apiClient";
import type {  AnimeWatchList } from "./interfaces";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "./firebase";
import { updatePreferences } from "./firestore";

const SYNC_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const BATCH_QUERY = /* GraphQL */ `
  query ($ids: [Int]) {
    Page(page: 1, perPage: 50) {
      media(type: ANIME, id_in: $ids) {
        id
        coverImage { large }
        averageScore
        status
        episodes
        duration
        season
        seasonYear
      }
    }
  }
`;

interface BatchMediaResponse {
  Page: {
    media: {
      id: number;
      coverImage: { large: string | null };
      averageScore: number | null;
      status: string | null;
      episodes: number | null;
      duration: number | null;
      season: string | null;
      seasonYear: number | null;
    }[];
  };
}

type VolatileFields = Pick<AnimeWatchList,  "image" | "score" | "status" | "episodes" | "duration" | "season" | "seasonYear">;

export const syncWatchlistIfStale = async (
  uid: string,
  watchlist: AnimeWatchList[],
  lastSyncedAt?: number,
): Promise<void> => {
  if (!watchlist.length) return;

  const now = Date.now();
  if (lastSyncedAt && now - lastSyncedAt < SYNC_INTERVAL_MS) return;

  try {
    const ids = watchlist.map((a) => a.id);
    const data = await apiClient<BatchMediaResponse>(BATCH_QUERY, { ids });
    const freshMedia = data.Page?.media ?? [];

    if (!freshMedia.length) return;

    const freshMap = new Map(freshMedia.map((m) => [m.id, m]));

    const updates = watchlist.reduce<Promise<void>[]>((acc, item) => {
      const fresh = freshMap.get(item.id);
      if (!fresh) return acc;

      const changes: Partial<VolatileFields> = {};

      if (fresh.coverImage?.large !== item.image) changes.image = fresh.coverImage?.large ?? null;
      if (fresh.averageScore !== item.score) changes.score = fresh.averageScore;
      if (fresh.status !== item.status) changes.status = fresh.status;
      if (fresh.episodes !== item.episodes) changes.episodes = fresh.episodes;
      if (fresh.duration !== item.duration) changes.duration = fresh.duration;
      if (fresh.season !== item.season) changes.season = fresh.season;
      if (fresh.seasonYear !== item.seasonYear) changes.seasonYear = fresh.seasonYear;

      if (Object.keys(changes).length === 0) return acc; // skip if nothing changed

      const ref = doc(fireStore, "users", uid, "watchlist", item.id.toString());
      acc.push(updateDoc(ref, changes));
      return acc;
    }, []);

    await Promise.all(updates);

    // Update lastSyncedAt in preferences
    await updatePreferences(uid, { lastSyncedAt: now });

  } catch (error) {
    console.error("Watchlist sync failed:", error);
    // Silently fail — non-critical background operation
  }
};