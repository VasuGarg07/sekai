import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";

const GENRES_QUERY = /* GraphQL */ `
  query {
    GenreCollection
  }
`;

export function useGenres() {
  return useQuery<string[], Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      const cached = localStorage.getItem("anilist-genres");
      const cachedAt = localStorage.getItem("anilist-genres-timestamp");

      if (cached && cachedAt) {
        const age = Date.now() - Number(cachedAt);
        if (age < 24 * 60 * 60 * 1000) {
          return JSON.parse(cached);
        }
      }

      const data = await apiClient(GENRES_QUERY);
      const genres = (data as any)?.GenreCollection ?? [];
      localStorage.setItem("anilist-genres", JSON.stringify(genres));
      localStorage.setItem("anilist-genres-timestamp", Date.now().toString());

      return genres;
    },
    staleTime: Infinity,
    retry: false,
  });
}