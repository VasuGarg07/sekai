import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { getCurrentSeasonYear, mapMediaToAnimeListItem } from "../shared/utilities";
import type { AnimeSpotlight } from "../shared/interfaces";

const QUERY = /* GraphQL */ `
  query ($season: MediaSeason, $seasonYear: Int, $perPage: Int) {
    Page(perPage: $perPage) {
      media(
        type: ANIME
        season: $season
        seasonYear: $seasonYear
        sort: [POPULARITY_DESC]
      ) {
        id
        title { english romaji }
        coverImage { large }
        bannerImage
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

export function useAnimeSpotlight() {
  const { season, year } = getCurrentSeasonYear();

  return useQuery<AnimeSpotlight[], Error>({
    queryKey: ["animeSpotlightList", season, year],
    queryFn: async ({ signal }) => {
      const data = await apiClient.post(
        "",
        { query: QUERY, variables: { season, seasonYear: year, perPage: 10 } },
        { signal }
      );
      const media = (data as any)?.Page?.media ?? [];
      return media.map((m: any) => ({
        ...mapMediaToAnimeListItem(m),
        banner: m.bannerImage ?? null,
      }))
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
}
