import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { GenreCollectionResponse } from "../shared/interfaces";
import { useAdultMode } from "./useUpdatePreferences";

const GENRES_QUERY = /* GraphQL */ `
  query {
    GenreCollection
  }
`;

/** Genres that only contain adult titles; hidden unless 18+ Mode is on. */
const ADULT_GENRES = new Set(["hentai"]);

export function useGenres() {
  const adultMode = useAdultMode();

  return useQuery<string[], Error, string[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const data = await apiClient<GenreCollectionResponse>(GENRES_QUERY);
      return data.GenreCollection ?? [];
    },
    select: (genres) => adultMode ? genres : genres.filter(g => !ADULT_GENRES.has(g.toLowerCase())),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export const isAdultGenre = (genre: string) => ADULT_GENRES.has(genre.toLowerCase());
