import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { mapMediaToAnimeListItem } from "../shared/utilities";
import type { AnimeListItem, AnimeListResponse, PagedResult } from "../shared/interfaces";

const QUERY = /* GraphQL */ `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
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
        sort: $sort
        status: $status
        isAdult: false
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

export function useAnimeList(
  key: string,
  sort: string[],
  status?: string,
  page: number = 1,
  perPage: number = 30,
) {
  return useQuery<PagedResult, Error>({
    queryKey: ["animeList", key, sort.join('-'), status, page, perPage],
    queryFn: async () => {
      const data = await apiClient<AnimeListResponse>(QUERY, { page, perPage, sort, status });
      const media = data.Page?.media ?? [];
      const pageInfo = data.Page?.pageInfo ?? {};
      return {
        items: media.map(m => mapMediaToAnimeListItem(m as AnimeListItem)),
        pageInfo,
      } as PagedResult;
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}