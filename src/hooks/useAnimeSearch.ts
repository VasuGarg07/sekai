import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeListItem } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";

const QUERY = /* GraphQL */ `
  query ($search: String, $perPage: Int) {
    Page(perPage: $perPage) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
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

export function useAnimeSearch(search: string, enabled = true) {
  return useQuery<AnimeListItem[], Error>({
    queryKey: ["animeSearch", search],
    enabled: enabled && search.trim().length >= 3,
    queryFn: async ({ signal }) => {
      const data = await apiClient.post(
        "",
        { query: QUERY, variables: { search, perPage: 5 } },
        { signal }
      );
      // apiClient interceptor returns GraphQL `data`, so shape is { Page: { media: [...] } }
      const media = (data as any)?.Page?.media ?? [];
      return media.map(mapMediaToAnimeListItem);
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
