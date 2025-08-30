import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeListItem } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";

const QUERY = /* GraphQL */ `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        sort: $sort
        status: $status
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
  return useQuery<AnimeListItem[], Error>({
    queryKey: ["animeList", key, sort.join('-'), status, perPage],
    queryFn: async ({ signal }) => {
      const data = await apiClient.post(
        "",
        { query: QUERY, variables: { page, perPage, sort, status } },
        { signal }
      );
      const media = (data as any)?.Page?.media ?? [];
      return media.map(mapMediaToAnimeListItem)
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
