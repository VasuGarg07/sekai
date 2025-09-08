import {
    Film,
    TrendingUp,
    Trophy,
    Tv2
} from 'lucide-react';

export const navigationLinks = [
    // { name: 'TV Series', path: '/tv-series', icon: Tv2 },
    // { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Recently Released', path: '/recents', icon: Tv2 },
    { name: 'Most Popular', path: '/popular', icon: Trophy },
    { name: 'Top Airing', path: '/top-airing', icon: TrendingUp },
    { name: 'Completed', path: '/completed', icon: Film },
];

export const FORMATS = [
    { key: "TV", label: "TV Series" },
    { key: "MOVIE", label: "Movie" },
    { key: "OVA", label: "OVA" },
    { key: "ONA", label: "ONA" },
    { key: "SPECIAL", label: "Special" },
    { key: "MUSIC", label: "Music" },
];

export const STATUSES = [
    { key: "FINISHED", label: "Finished" },
    { key: "RELEASING", label: "Releasing" },
    { key: "NOT_YET_RELEASED", label: "Upcoming" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "HIATUS", label: "Hiatus" },
];

export const SEASONS = [
    { key: "WINTER", label: "Winter" },
    { key: "SPRING", label: "Spring" },
    { key: "SUMMER", label: "Summer" },
    { key: "FALL", label: "Fall" },
];

export const COUNTRIES = [
    { key: "JP", label: "Japanese" },
    { key: "CN", label: "Chinese" },
    { key: "KR", label: "Korean" },
    { key: "TW", label: "Taiwanese" },
];

export const SORT_OPTIONS = [
    { key: 'SEARCH_MATCH', label: 'Most Relevance' },
    { key: "POPULARITY_DESC", label: "Popularity" },
    { key: "TRENDING_DESC", label: "Trending" },
    { key: "SCORE_DESC", label: "Score" },
    { key: "UPDATED_AT_DESC", label: "Recently Updated" },
    { key: "START_DATE_DESC", label: "Start Date" },
    { key: "TITLE_ROMAJI", label: "Title (A-Z)" },
    { key: "EPISODES_DESC", label: "Episode Count" },
];

export function getYearOptions() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1960 + 2 }, (_, i) => 1960 + i);
}
