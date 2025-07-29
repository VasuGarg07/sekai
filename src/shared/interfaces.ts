export type AnimeStatus = "airing" | "complete" | "upcoming";
export type AnimeType = "tv" | "movie" | "ova" | "special" | "ona" | "music";
export type AnimeSeason = "winter" | "spring" | "summer" | "fall";
export type TitleType = "Default" | "Synonym" | "Japanese" | "English";

export type Image = {
    image_url: string;
    large_image_url: string;
    small_image_url: string;
}

export type YoutubeImage = Image & {
    medium_image_url: string;
    maximum_image_url?: string;
}

export type Stat = {
    mal_id: number;
    name: string;
}

export type Title = {
    type: TitleType;
    title: string;
}

export type AnimeDetails = {
    // Quick Details
    mal_id: number;
    images: {
        jpg: Image
        webp: Image;
    };
    titles: Title[];
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
    type: string;
    status: string;
    airing: boolean;
    episodes: number | null;
    duration: string | null;
    score: number | null;
    synopsis: string | null;
    season: AnimeSeason | null;
    year: number | null;
    genres: Stat[];
    demographics?: Stat[];
    themes?: Stat[];
    explicit_genres?: Stat[];

    // Expanded Details
    trailer: {
        youtube_id: string;
        url: string;
        embed_url: string;
        images: YoutubeImage;
    } | null;
    source: string;
    aired: {
        from: string | null;
        to: string | null;
        string: string;
    };
    rating: string | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    favorites: number;
    producers: Stat[];
    studios: Stat[];
};

// -----------------------------------------------

export type Pagination = {
    current_page: number;
    has_next_page: boolean;
    last_visible_page: number;
    items: {
        count: number;
        total: number;
        per_page: number;
    }
}

// -----------------------------------------------

export type Genre = {
    mal_id: number;
    name: string;
    count: number;
};

// -----------------------------------------------

export type Producer = {
    mal_id: number;
    titles: string;
    image: string | null;
    established: string | null;
    about: string | null;
    count: number;
    favorites: number;
}

// -----------------------------------------------

export type AnimeListResponse = {
    data: AnimeDetails[];
    pagination?: Pagination;
}