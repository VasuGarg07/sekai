import {
    Film,
    TrendingUp,
    Trophy,
    Tv2
} from 'lucide-react';
import type { ThemeColor, WatchStatus } from './interfaces';

export const navigationLinks = [
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

// Array of fun fallback messages for missing anime synopsis
export const synopsisFallbacks = [
    // Whimsical/Playful
    "Plot twist: Even we don't know what happens in this one! 🤔",
    "Synopsis loading... just like the protagonist's character development!",

    // Mysterious/Intriguing
    "The story remains a mystery... for now. Some adventures are best discovered firsthand.",
    "No spoilers here! Dive in and let the story surprise you.",

    // Encouraging
    "An epic adventure awaits. Sometimes the best stories are the ones you discover yourself.",
    "The best anime experiences come from going in blind. Trust us on this one!",

    // Anime-themed
    "Like a hidden jutsu, this plot is best experienced without prior knowledge.",
    "Even the greatest detectives couldn't crack this case. Time to investigate yourself!",
    "This story is locked away like a secret technique. Unlock it by watching!",

    // Self-aware/Meta
    "Error 404: Synopsis not found. Plot armor still intact though!",

    // Simple but engaging
    "Sometimes the journey is better than knowing the destination.",
    "Great stories don't need introductions. They speak for themselves.",
];

// Function to get a random fallback message
export const getRandomSynopsisFallback = (): string => {
    return synopsisFallbacks[Math.floor(Math.random() * synopsisFallbacks.length)];
};

// Function to get a consistent fallback based on anime ID (same anime = same fallback)
export const getSynopsisFallback = (animeId: string | number): string => {
    const index = Math.abs(String(animeId).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % synopsisFallbacks.length;
    return synopsisFallbacks[index];
};

export const WatchStatusColor: Record<WatchStatus, string> = {
    'watching': 'bg-blue-900/60 text-blue-200 border-blue-600',
    'completed': 'bg-green-900/60 text-green-200 border-green-600',
    'on-hold': 'bg-yellow-900/60 text-yellow-200 border-yellow-600',
    'plan-to-watch': 'bg-purple-900/60 text-purple-200 border-purple-600',
    'dropped': 'bg-red-900/60 text-red-200 border-red-600',
    'rewatch': 'bg-sky-900/60 text-sky-200 border-sky-600'
}

export const MAX_USER_DOCUMENTS = 2000;

export const DEFAULT_PREFERENCES = {
    app_theme: "rose",
    default_watch_status: "watching",
};


export const AVAILABLE_THEMES: ThemeColor[] = [
    { name: 'rose', label: 'Rose', className: 'bg-rose-500' },
    { name: 'cyan', label: 'cyan', className: 'bg-cyan-500' },
    { name: 'orange', label: 'orange', className: 'bg-orange-500' },
    { name: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
    { name: 'fuchsia', label: 'Fuchsia', className: 'bg-fuchsia-500' },
    // { name: 'slate', label: 'Slate', className: 'bg-slate-500' }
];