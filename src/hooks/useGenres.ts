import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { GenreCollectionResponse } from "../shared/interfaces";

const GENRES_QUERY = /* GraphQL */ `
  query {
    GenreCollection
  }
`;

export function useGenres() {
  return useQuery<string[], Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      const data = await apiClient<GenreCollectionResponse>(GENRES_QUERY);
      return data.GenreCollection ?? [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}