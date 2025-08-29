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