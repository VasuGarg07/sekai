import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { isAdultFilter, MEDIA_LIST_FIELDS } from "../shared/anilistFields";
import type { AnimeListItem, AnimeMediaPageResponse } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";
import { useAdultMode } from "./useUpdatePreferences";

const QUERY = /* GraphQL */ `
  query ($search: String, $perPage: Int, $isAdult: Boolean) {
    Page(perPage: $perPage) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC, isAdult: $isAdult) {
        ${MEDIA_LIST_FIELDS}
      }
    }
  }
`;

export function useAnimeSearch(search: string, enabled = true) {
  const adultMode = useAdultMode();

  return useQuery<AnimeListItem[], Error>({
    queryKey: ["animeSearch", search, adultMode],
    enabled: enabled && search.trim().length >= 3,
    queryFn: async () => {
      const data = await apiClient<AnimeMediaPageResponse>(QUERY, {
        search, perPage: 5, isAdult: isAdultFilter(adultMode),
      });
      return (data.Page?.media ?? []).map(mapMediaToAnimeListItem);
    },
    staleTime: 5 * 60 * 1000,
  });
}
