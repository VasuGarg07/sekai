/**
 * Media fields needed to build an AnimeListItem (see mapMediaToAnimeListItem).
 * Shared by every list-style query so items saved to the watchlist are always complete.
 */
export const MEDIA_LIST_FIELDS = /* GraphQL */ `
  id
  title { english romaji }
  coverImage { large }
  format
  duration
  averageScore
  startDate { year month day }
  description(asHtml: false)
  synonyms
  status
  genres
  episodes
  season
  seasonYear
  isAdult
`;

/**
 * AniList's `isAdult` filter value for the current 18+ Mode setting.
 * `false` filters adult titles out; `undefined` leaves the argument off so nothing is filtered.
 */
export const isAdultFilter = (adultMode: boolean): false | undefined => (adultMode ? undefined : false);
