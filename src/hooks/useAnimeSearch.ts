import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";

export interface AnimeSearchItem {
  id: number;
  image: string | null;
  title_english: string | null;
  title_romaji: string | null;
  rating: number | null;      // 0-100
  type: string | null;
  year: number | null;
  synopsis: string | null;
  duration: number | null;
}

const QUERY = /* GraphQL */ `
  query ($search: String, $perPage: Int) {
    Page(perPage: $perPage) {
      media(search: $search, type: ANIME, sort: SCORE_DESC) {
        id
        title { english romaji }
        coverImage { large }
        averageScore
        format
        seasonYear
        description(asHtml: false)
        duration
      }
    }
  }
`;

export function useAnimeSearch(search: string, enabled = true) {
  return useQuery<AnimeSearchItem[], Error>({
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
      return media.map((m: any) => ({
        id: m.id,
        image: m.coverImage?.large ?? null,
        title_english: m.title?.english ?? null,
        title_romaji: m.title?.romaji ?? null,
        rating: m.averageScore ?? null,
        type: m.format ?? null,
        year: m.seasonYear ?? null,
        // strip any leftover tags just in case
        synopsis: typeof m.description === "string"
          ? m.description.replace(/<[^>]+>/g, "").trim()
          : null,
        duration: m.duration ?? null,
      })) as AnimeSearchItem[];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
