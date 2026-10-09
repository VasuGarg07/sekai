import { COUNTRIES, FORMATS, SEASONS, SORT_OPTIONS, STATUSES } from "../../shared/constants";
import type { Filters } from "../../shared/interfaces";

/**
 * Explore filters <-> URL search params, so filters survive refresh, work with
 * Back/Forward and can be shared as a link. Example:
 *   /explore?q=frieren&genre=Fantasy,Adventure&exclude=Ecchi&format=TV&year=2023&sort=SCORE_DESC
 */

const allowed = (options: { key: string }[]) => new Set(options.map(o => o.key));
const FORMAT_KEYS = allowed(FORMATS);
const STATUS_KEYS = allowed(STATUSES);
const SEASON_KEYS = allowed(SEASONS);
const COUNTRY_KEYS = allowed(COUNTRIES);
const SORT_KEYS = allowed(SORT_OPTIONS);

/** Param names this module owns; anything else in the URL is left alone. */
const FILTER_PARAMS = ["q", "genre", "exclude", "format", "status", "season", "year", "country", "sort", "page"];

const readList = (params: URLSearchParams, name: string, valid?: Set<string>) => {
    const values = (params.get(name) ?? "").split(",").map(v => v.trim()).filter(Boolean);
    const filtered = valid ? values.filter(v => valid.has(v)) : values;
    return filtered.length ? filtered : undefined;
};

const readOne = (params: URLSearchParams, name: string, valid: Set<string>) => {
    const value = params.get(name);
    return value && valid.has(value) ? value : undefined;
};

/** Reads filters from the URL, ignoring anything unrecognised (so a hand-edited link can't break the query). */
export function filtersFromParams(params: URLSearchParams): Filters {
    const year = Number(params.get("year"));
    const sort = readOne(params, "sort", SORT_KEYS);
    return {
        search: params.get("q")?.trim() || undefined,
        genreIn: readList(params, "genre"),
        genreNotIn: readList(params, "exclude"),
        formatIn: readList(params, "format", FORMAT_KEYS),
        statusIn: readList(params, "status", STATUS_KEYS),
        season: readOne(params, "season", SEASON_KEYS),
        year: Number.isInteger(year) && year > 1900 ? year : undefined,
        country: readOne(params, "country", COUNTRY_KEYS),
        sort: sort ? [sort] : undefined,
    };
}

/** New params with the given filters applied; the page always resets to 1. */
export function filtersToParams(filters: Filters, current: URLSearchParams): URLSearchParams {
    const params = new URLSearchParams(current);
    FILTER_PARAMS.forEach(name => params.delete(name));

    const setList = (name: string, values?: string[]) => {
        if (values?.length) params.set(name, values.join(","));
    };

    const search = filters.search?.trim();
    if (search) params.set("q", search);
    setList("genre", filters.genreIn);
    setList("exclude", filters.genreNotIn);
    setList("format", filters.formatIn);
    setList("status", filters.statusIn);
    if (filters.season) params.set("season", filters.season);
    if (filters.year) params.set("year", String(filters.year));
    if (filters.country) params.set("country", filters.country);
    if (filters.sort?.[0]) params.set("sort", filters.sort[0]);

    return params;
}
