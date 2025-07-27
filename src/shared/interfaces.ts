export type AnimeType = "tv" | "movie" | "ova" | "special" | "ona" | "music";
export type AnimeStatus = "airing" | "complete" | "upcoming";
export type AnimeSeason = "winter" | "spring" | "summer" | "fall";

export type Image = {
    image_url: string;
    large_image_url: string;
}

export type YoutubeImage = Image & {
    medium_image_url: string;
    maximum_image_url?: string;
}

export type Stat = {
    mal_id: string;
    name: string;
}

export type AnimeCard = {
    mal_id: number;
    images: {
        jpg: Image;
        webp: Image;
    }

    title: string;
    title_english: string;
    allTitles: string[];

    type: AnimeType;
    status: AnimeStatus;
    airing: boolean;

    episodes: number;
    duration: string;
    score: number;

    synopsis: string;
    season: AnimeSeason;
    year: number;

    genres: Stat[];
}

export type AnimeDetails = AnimeCard & {
    trailer: {
        youtube_id: number;
        url: string;
        embed_url: string;
        images: YoutubeImage;
    }
    source: string;
    aired: string;
    rating: string;
    scored_by: number;
    rank: number;
    popularity: number;
    favorites: number;
    producers: Stat[];
}

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

export type Genre = Stat & { count: number };

// -----------------------------------------------

export type Producer = {
    mal_id: string;
    titles: string;
    image: string;
    established: Date;
    about: string;
    count: number;
    favorites: number;
}

// -----------------------------------------------

