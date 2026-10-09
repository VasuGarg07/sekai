import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { isAdultFilter, MEDIA_LIST_FIELDS } from "../shared/anilistFields";
import { getCurrentSeasonYear, mapMediaToAnimeSpotlight } from "../shared/utilities";
import type { AnimeMediaPageResponse, AnimeSpotlight } from "../shared/interfaces";
import { useAdultMode } from "./useUpdatePreferences";

const QUERY = /* GraphQL */ `
  query ($season: MediaSeason, $seasonYear: Int, $perPage: Int, $isAdult: Boolean) {
    Page(perPage: $perPage) {
      media(
        type: ANIME
        season: $season
        seasonYear: $seasonYear
        sort: [POPULARITY_DESC]
        isAdult: $isAdult
      ) {
        ${MEDIA_LIST_FIELDS}
        bannerImage
      }
    }
  }
`;

export function useAnimeSpotlight() {
    const { season, year } = getCurrentSeasonYear();
    const adultMode = useAdultMode();

    return useQuery<AnimeSpotlight[], Error>({
        queryKey: ["animeSpotlightList", season, year, adultMode],
        queryFn: async () => {
            const data = await apiClient<AnimeMediaPageResponse>(QUERY, {
                season, seasonYear: year, perPage: 10, isAdult: isAdultFilter(adultMode),
            });
            return (data.Page?.media ?? []).map(mapMediaToAnimeSpotlight);
        },
        staleTime: 60 * 60 * 1000,
    });
}
