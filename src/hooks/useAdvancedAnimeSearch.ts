import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { isAdultFilter, MEDIA_LIST_FIELDS } from "../shared/anilistFields";
import type { AnimeListResponse, PagedResult } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";
import { useAdultMode } from "./useUpdatePreferences";

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
    $isAdult: Boolean
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
        isAdult: $isAdult
      ) {
        ${MEDIA_LIST_FIELDS}
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

export function useAdvancedAnimeSearch(options: AdvancedSearchOptions) {
  const adultMode = useAdultMode();
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

  // Drop empty values so equivalent searches share one cache entry
  const variables = {
    ...(search && { search }),
    ...(genreIn?.length && { genreIn }),
    ...(genreNotIn?.length && { genreNotIn }),
    ...(formatIn?.length && { formatIn }),
    ...(statusIn?.length && { statusIn }),
    ...(season && { season }),
    ...(year && { year }),
    ...(country && { country }),
    ...(sort.length && { sort }),
  };

  return useQuery<PagedResult, Error>({
    queryKey: ["advancedAnimeSearch", page, perPage, adultMode, variables],
    queryFn: async () => {
      const data = await apiClient<AnimeListResponse>(QUERY, {
        ...variables,
        page,
        perPage,
        isAdult: isAdultFilter(adultMode),
      });

      return {
        items: (data.Page?.media ?? []).map(mapMediaToAnimeListItem),
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
