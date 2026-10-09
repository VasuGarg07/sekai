export interface AnimeListItem {
    id: number;
    image: string | null;
    title_english: string | null;
    title_romaji: string | null;
    type: string | null;
    duration: number | null;
    score: number | null;
    startDateText: string | null;
    synopsis: string | null;
    synonyms: string[];
    status: string | null;
    genres: string[];
    episodes: number | null;
    season: string | null;
    seasonYear: number | null;
    /** From AniList; not stored in the watchlist */
    isAdult?: boolean;
}

export interface AnimeSpotlight extends AnimeListItem {
    banner: string | null;
}

export interface Filters {
    search?: string;
    formatIn?: string[];
    statusIn?: string[];
    season?: string;
    year?: number;
    country?: string;
    sort?: string[];
    genreIn?: string[];
    genreNotIn?: string[];
}

export interface Pagination {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
}

// -----------------------------

export interface AnimeTag {
    name: string;
    description: string | null;
    rank: number | null;
    isGeneralSpoiler: boolean;
    isMediaSpoiler: boolean;
}

export interface AnimeRelation {
    relationType: string;
    node: {
        id: number;
        title: { romaji: string | null; english: string | null };
        coverImage: {
            extraLarge: string | null;
            large: string | null;
        };
        format: string | null;
        status: string | null;
        isAdult: boolean | null;
    };
}

export interface AnimeTrailer {
    id: string;
    site: string;
    thumbnail: string;
}

export interface AnimeDetail extends AnimeListItem {
    coverImage: {
        extraLarge: string | null;
        large: string | null;
    };
    bannerImage: string | null;
    countryOfOrigin: string | null;
    tags: AnimeTag[];
    popularity: number | null;
    favourites: number | null;
    relations: AnimeRelation[];
    recommendations: AnimeListItem[];
    trailer: AnimeTrailer | null;
    nextEpisode: {
        episode: number;
        airingAt: number;
    } | null;
}

// ----------------------------

export type WatchStatus = 'watching' | 'on-hold' | 'plan-to-watch' | 'dropped' | 'completed' | 'rewatch';

export interface AnimeWatchList extends AnimeListItem {
    watchStatus: WatchStatus;
    addedAt: number;
}

// ----------------------------

export interface SekaiUser {
    uid: string,
    email: string | null,
    displayName: string | null,
    photoURL: string | null,
}

export interface UserPreferences {
    app_theme: string;
    default_watch_status: WatchStatus;
    /** 18+ Mode — when true, adult titles are not filtered out */
    adult_mode: boolean;
    lastSyncedAt?: number;
}

export interface ThemeColor {
    name: string;
    label: string;
    className: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

// ----------------------------

// --- API Response Types ---

export interface PagedResult {
    items: AnimeListItem[];
    pageInfo: Pagination;
}

// Raw GraphQL response wrappers — used to type apiClient<T> calls

/** Media object as returned by AniList. Every field is optional because each query selects a subset. */
export interface AniListMedia {
    id: number;
    title?: { english?: string | null; romaji?: string | null } | null;
    coverImage?: { large?: string | null; extraLarge?: string | null } | null;
    bannerImage?: string | null;
    format?: string | null;
    duration?: number | null;
    averageScore?: number | null;
    startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
    description?: string | null;
    synonyms?: string[] | null;
    status?: string | null;
    genres?: string[] | null;
    episodes?: number | null;
    season?: string | null;
    seasonYear?: number | null;
    isAdult?: boolean | null;
    countryOfOrigin?: string | null;
    tags?: AnimeTag[] | null;
    popularity?: number | null;
    favourites?: number | null;
    relations?: { edges?: AnimeRelation[] | null } | null;
    recommendations?: { edges?: { node?: { mediaRecommendation?: AniListMedia | null } | null }[] | null } | null;
    trailer?: AnimeTrailer | null;
    nextAiringEpisode?: { episode: number; airingAt: number } | null;
}

export interface AnimeListResponse {
    Page: {
        pageInfo: Pagination;
        media: AniListMedia[];
    };
}

export interface AnimeDetailResponse {
    Media: AniListMedia | null;
}

export interface AnimeMediaPageResponse {
    Page: {
        media: AniListMedia[];
    };
}

export interface GenreCollectionResponse {
    GenreCollection: string[];
}
