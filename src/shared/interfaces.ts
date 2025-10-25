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
        meta: string | null
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

export interface SekaiUser {
    uid: string,
    email: string | null,
    displayName: string | null,
    photoURL: string | null,
}