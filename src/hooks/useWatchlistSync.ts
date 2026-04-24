import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../shared/firebase";
import apiClient from "../shared/apiClient";
import { updatePreferences } from "../shared/firestore";

const SYNC_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BATCH_SIZE = 50;
const RATE_LIMIT_DELAY_MS = 500;

export interface AnimeWatchList {
  id: number;
  image: string | null;
  score: number | null;
  status: string | null;
  episodes: number | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
}

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

const chunk = (arr: number[], size: number) => {
  const res: number[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function useWatchlistSync(
  uid: string | undefined,
  watchlist: AnimeWatchList[],
  lastSyncedAt?: number
) {
  const queryClient = useQueryClient();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!uid || watchlist.length === 0) return;

    const now = Date.now();

    // ⛔ Skip if recently synced
    if (lastSyncedAt && now - lastSyncedAt < SYNC_INTERVAL_MS) return;

    // ⛔ Prevent duplicate runs
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    const runSync = async () => {
      try {
        const ids = watchlist.map((w) => w.id);
        const batches = chunk(ids, BATCH_SIZE);

        for (const batch of batches) {
          const res = await apiClient<BatchMediaResponse>(BATCH_QUERY, {
            ids: batch,
          });

          const freshMedia = res.Page?.media ?? [];
          if (!freshMedia.length) continue;

          const freshMap = new Map(freshMedia.map((m) => [m.id, m]));

          queryClient.setQueryData(["watchlist", uid], (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((item: AnimeWatchList) => {
                  const fresh = freshMap.get(item.id);
                  if (!fresh) return item;

                  return {
                    ...item,
                    image: fresh.coverImage?.large ?? item.image,
                    score: fresh.averageScore ?? item.score,
                    status: fresh.status ?? item.status,
                    episodes: fresh.episodes ?? item.episodes,
                    duration: fresh.duration ?? item.duration,
                    season: fresh.season ?? item.season,
                    seasonYear: fresh.seasonYear ?? item.seasonYear,
                  };
                }),
              })),
            };
          });

          const updates: Promise<void>[] = [];

          for (const item of watchlist) {
            const fresh = freshMap.get(item.id);
            if (!fresh) continue;

            const changes: Partial<AnimeWatchList> = {};

            if (fresh.coverImage?.large !== item.image)
              changes.image = fresh.coverImage?.large ?? null;
            if (fresh.averageScore !== item.score)
              changes.score = fresh.averageScore;
            if (fresh.status !== item.status)
              changes.status = fresh.status;
            if (fresh.episodes !== item.episodes)
              changes.episodes = fresh.episodes;
            if (fresh.duration !== item.duration)
              changes.duration = fresh.duration;
            if (fresh.season !== item.season)
              changes.season = fresh.season;
            if (fresh.seasonYear !== item.seasonYear)
              changes.seasonYear = fresh.seasonYear;

            if (Object.keys(changes).length === 0) continue;

            const ref = doc(
              fireStore,
              "users",
              uid,
              "watchlist",
              item.id.toString()
            );
            updates.push(updateDoc(ref, changes));
          }
          await Promise.all(updates);
          await delay(RATE_LIMIT_DELAY_MS);
        }
        await updatePreferences(uid, { lastSyncedAt: now });
      } catch (err) {
        console.error("Watchlist sync failed:", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    runSync();
  }, [uid, watchlist, lastSyncedAt, queryClient]);
}