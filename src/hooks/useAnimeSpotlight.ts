import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { getCurrentSeasonYear, mapMediaToAnimeSpotlight } from "../shared/utilities";
import type { AnimeSpotlight, AnimeSpotlightResponse } from "../shared/interfaces";

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
    queryFn: async () => {
      const data = await apiClient<AnimeSpotlightResponse>(QUERY, { season, seasonYear: year, perPage: 10 });
      const media = data.Page?.media ?? [];
      return media.map(m => mapMediaToAnimeSpotlight(m as any));
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}