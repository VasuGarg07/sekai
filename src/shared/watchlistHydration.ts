import apiClient, { ApiError } from "./apiClient";
import { MEDIA_LIST_FIELDS } from "./anilistFields";
import type { AnimeListItem, AnimeMediaPageResponse, AnimeWatchList, WatchlistEntry } from "./interfaces";
import { mapMediaToAnimeListItem } from "./utilities";

/** AniList returns at most 50 items per page */
const BATCH_SIZE = 50;
/** Pause between batches so large exports stay under AniList's rate limit */
const BATCH_DELAY_MS = 700;

const BATCH_QUERY = /* GraphQL */ `
  query ($ids: [Int], $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: ANIME, id_in: $ids) {
        ${MEDIA_LIST_FIELDS}
      }
    }
  }
`;

/** Waits before retrying a batch AniList rate-limited (it allows roughly 30–90 requests a minute) */
const RATE_LIMIT_WAITS_MS = [5_000, 15_000, 30_000];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchBatch(ids: number[]): Promise<AnimeMediaPageResponse> {
    for (let attempt = 0; ; attempt++) {
        try {
            return await apiClient<AnimeMediaPageResponse>(BATCH_QUERY, { ids, perPage: BATCH_SIZE });
        } catch (error) {
            const wait = RATE_LIMIT_WAITS_MS[attempt];
            if (!(error instanceof ApiError && error.isRateLimited) || wait === undefined) throw error;
            await delay(wait);
        }
    }
}

/** Fresh AniList details for the given ids, keyed by id. Ids AniList no longer has are simply missing. */
export async function fetchAnimeByIds(ids: number[]): Promise<Map<number, AnimeListItem>> {
    const result = new Map<number, AnimeListItem>();
    const unique = [...new Set(ids)];

    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
        if (i > 0) await delay(BATCH_DELAY_MS);
        const batch = unique.slice(i, i + BATCH_SIZE);
        const data = await fetchBatch(batch);
        for (const media of data.Page?.media ?? []) {
            result.set(media.id, mapMediaToAnimeListItem(media));
        }
    }

    return result;
}

const placeholder = (id: number): AnimeListItem => ({
    id,
    image: null,
    title_english: null,
    title_romaji: `Anime #${id}`,
    type: null,
    duration: null,
    score: null,
    startDateText: null,
    synopsis: null,
    synonyms: [],
    status: null,
    genres: [],
    episodes: null,
    season: null,
    seasonYear: null,
});

/**
 * Merges stored entries with fresh AniList data.
 * Older Firestore documents still hold a full snapshot of the anime; it is used
 * only when AniList has no data for that id (or couldn't be reached).
 */
export function mergeWatchlist(
    docs: (WatchlistEntry & Partial<AnimeListItem>)[],
    fresh: Map<number, AnimeListItem> | null,
): AnimeWatchList[] {
    return docs.map(stored => {
        const latest = fresh?.get(stored.id);
        return {
            ...placeholder(stored.id),
            ...stripEntry(stored),
            type: latest?.type ?? stored.format ?? stored.type ?? null,
            ...latest,
            id: stored.id,
            format: latest?.type ?? stored.format ?? stored.type ?? null,
            watchStatus: stored.watchStatus,
            addedAt: stored.addedAt,
            isStale: !latest,
        };
    });
}

/** Legacy snapshot fields only (drops undefined values so they don't overwrite the placeholder) */
function stripEntry(stored: WatchlistEntry & Partial<AnimeListItem>): Partial<AnimeListItem> {
    return Object.fromEntries(
        Object.entries(stored).filter(([, value]) => value !== undefined)
    ) as Partial<AnimeListItem>;
}

/**
 * Stored entries -> display items with fresh AniList data.
 * If AniList can't be reached, falls back to stored data instead of failing the whole watchlist.
 */
export async function hydrateWatchlist(
    docs: (WatchlistEntry & Partial<AnimeListItem>)[],
): Promise<{ items: AnimeWatchList[]; refreshFailed: boolean }> {
    if (docs.length === 0) return { items: [], refreshFailed: false };
    try {
        const fresh = await fetchAnimeByIds(docs.map(d => d.id));
        return { items: mergeWatchlist(docs, fresh), refreshFailed: false };
    } catch (error) {
        console.warn("Couldn't refresh watchlist details from AniList:", error);
        return { items: mergeWatchlist(docs, null), refreshFailed: true };
    }
}
