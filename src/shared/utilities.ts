import type { User } from "firebase/auth";
import type { AnimeDetail, AnimeListItem, AnimeRelation, AnimeTag } from "./interfaces";

export function serializeUser(user: User) {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };
}


/** Helpers */
export function getCurrentSeasonYear() {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-11
    let season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    if (month >= 1 && month <= 3) season = "WINTER";
    else if (month >= 4 && month <= 6) season = "SPRING";
    else if (month >= 7 && month <= 9) season = "SUMMER";
    else season = "FALL";
    return { season, year: now.getFullYear() };
}

export function formatDate(
    year: number | null,
    month: number | null,
    day: number | null
): string | null {
    if (!year) return null;
    if (!month) return String(year);
    if (!day) {
        const dt = new Date(Date.UTC(year, month - 1, 1));
        return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(dt);
    }
    const dt = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(dt);
}

export function mapMediaToAnimeListItem(m: any): AnimeListItem {
    return {
        id: m.id,
        image: m.coverImage?.large ?? null,
        title_english: m.title?.english ?? null,
        title_romaji: m.title?.romaji ?? null,
        type: m.format ?? null,
        duration: m.duration ?? null,
        score: m.averageScore ?? null,
        startDateText: formatDate(
            m.startDate?.year ?? null,
            m.startDate?.month ?? null,
            m.startDate?.day ?? null
        ),
        synopsis:
            typeof m.description === "string"
                ? m.description.replace(/<[^>]+>/g, "").trim()
                : null,
        synonyms: m.synonyms ?? [],
        status: m.status ?? null,
        genres: m.genres ?? [],
    };
}

export function mapMediaToAnimeDetail(m: any): AnimeDetail {
    const base = mapMediaToAnimeListItem(m);

    return {
        ...base,
        coverImage: {
            extraLarge: m.coverImage?.extraLarge ?? null,
            large: m.coverImage?.large ?? null,
        },
        bannerImage: m.bannerImage ?? null,
        season: m.season ?? null,
        seasonYear: m.seasonYear ?? null,
        episodes: m.episodes ?? null,
        countryOfOrigin: m.countryOfOrigin ?? null,
        tags: (m.tags ?? []) as AnimeTag[],
        popularity: m.popularity ?? null,
        favourites: m.favourites ?? null,
        relations: (m.relations?.edges ?? []) as AnimeRelation[],
        recommendations:
            m.recommendations?.edges
                ?.map((e: any) => e.node?.mediaRecommendation)
                .filter(Boolean)
                .map(mapMediaToAnimeListItem) ?? [],
    };
}