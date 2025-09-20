import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { mapMediaToAnimeListItem } from "../shared/utilities";
import type { PagedResult } from "./useAdvancedAnimeSearch";

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
    queryKey: ["animeList", key, sort.join('-'), status, page],
    queryFn: async ({ signal }) => {
      const data = await apiClient.post(
        "",
        { query: QUERY, variables: { page, perPage, sort, status } },
        { signal }
      );
      const pageData = (data as any)?.Page;
      const media = pageData?.media ?? [];
      const pageInfo = pageData?.pageInfo ?? {};
      return {
        items: media.map(mapMediaToAnimeListItem),
        pageInfo,
      };
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
