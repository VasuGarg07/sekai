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
      const data = await apiClient(GENRES_QUERY);
      return (data as any)?.GenreCollection ?? [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}