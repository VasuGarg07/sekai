
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
