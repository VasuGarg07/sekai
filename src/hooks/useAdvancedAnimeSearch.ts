import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeListItem, AnimeListResponse, PagedResult } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";

const QUERY = /* GraphQL */ `
  query (
    $page: Int
    $perPage: Int
    $search: String
    $genreIn: [String]
    $genreNotIn: [String]
    $formatIn: [MediaFormat]
    $statusIn: [MediaStatus]
    $season: MediaSeason
    $year: Int
    $country: CountryCode
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: ANIME
        search: $search
        genre_in: $genreIn
        genre_not_in: $genreNotIn
        format_in: $formatIn
        status_in: $statusIn
        season: $season
        seasonYear: $year
        countryOfOrigin: $country
        sort: $sort
      ) {
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
      }
    }
  }
`;

export interface AdvancedSearchOptions {
  search?: string;
  genreIn?: string[];
  genreNotIn?: string[];
  formatIn?: string[];
  statusIn?: string[];
  season?: string;
  year?: number;
  country?: string;
  sort?: string[];
  page?: number;
  perPage?: number;
}

export function useAdvancedAnimeSearch(
  key: string,
  options: AdvancedSearchOptions,
) {
  const {
    search,
    genreIn,
    genreNotIn,
    formatIn,
    statusIn,
    season,
    year,
    country,
    sort = [],
    page = 1,
    perPage = 30,
  } = options;

  return useQuery<PagedResult, Error>({
    queryKey: [
      "advancedAnimeSearch",
      key,
      page,
      {
        ...(search && { search }),
        ...(genreIn?.length && { genreIn }),
        ...(genreNotIn?.length && { genreNotIn }),
        ...(formatIn?.length && { formatIn }),
        ...(statusIn?.length && { statusIn }),
        ...(season && { season }),
        ...(year && { year }),
        ...(country && { country }),
        ...(sort?.length && { sort }),
      }
    ],
    queryFn: async () => {
      const data = await apiClient<AnimeListResponse>(QUERY, {
        page,
        perPage,
        search,
        genreIn,
        genreNotIn,
        formatIn,
        statusIn,
        season,
        year,
        country,
        sort,
      });

      const media = data.Page?.media ?? [];
      const pageInfo = data.Page?.pageInfo ?? {};

      return {
        items: media.map(m => mapMediaToAnimeListItem(m as AnimeListItem)),
        pageInfo,
      } as PagedResult;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}