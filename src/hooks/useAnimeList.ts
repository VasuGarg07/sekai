import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { isAdultFilter, MEDIA_LIST_FIELDS } from "../shared/anilistFields";
import { mapMediaToAnimeListItem } from "../shared/utilities";
import type { AnimeListResponse, PagedResult } from "../shared/interfaces";
import { useAdultMode } from "./useUpdatePreferences";

const QUERY = /* GraphQL */ `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $isAdult: Boolean) {
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
        isAdult: $isAdult
      ) {
        ${MEDIA_LIST_FIELDS}
      }
    }
  }
`;

export function useAnimeList(
  sort: string[],
  status?: string,
  page: number = 1,
  perPage: number = 30,
) {
  const adultMode = useAdultMode();

  return useQuery<PagedResult, Error>({
    queryKey: ["animeList", sort.join('-'), status, page, perPage, adultMode],
    queryFn: async () => {
      const data = await apiClient<AnimeListResponse>(QUERY, {
        page, perPage, sort, status, isAdult: isAdultFilter(adultMode),
      });
      return {
        items: (data.Page?.media ?? []).map(mapMediaToAnimeListItem),
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
