import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { formatDate } from "../shared/utilities";

export interface AnimeListItem {
  id: number;
  image: string | null;
  title_english: string | null;
  title_romaji: string | null;
  type: string | null;
  duration: number | null;
  score: number | null;
  startDateText: string | null;
  synopsis: string | null;
  synonyms: string[];
  status: string | null;
  genres: string[];
}

const QUERY = /* GraphQL */ `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        sort: $sort
        status: $status
      ) {
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
      }
    }
  }
`;

export function useAnimeList(
  key: string,
  sort: string[],
  status?: string,
  page: number = 1,
  perPage: number = 30,
) {
  return useQuery<AnimeListItem[], Error>({
    queryKey: ["animeList", key, sort.join('-'), status, perPage],
    queryFn: async ({ signal }) => {
      const data = await apiClient.post(
        "",
        { query: QUERY, variables: { page, perPage, sort, status } },
        { signal }
      );
      const media = (data as any)?.Page?.media ?? [];
      return media.map((m: any) => ({
        id: m.id,
        image: m.coverImage?.large ?? null,
        title_english: m.title?.english ?? null,
        title_romaji: m.title?.romaji ?? null,
        type: m.format ?? null,
        duration: m.duration ?? null,
        score: m.averageScore ?? null,
        startDateText: formatDate(
          m.startDate?.year ?? null,
          m.startDate?.month ?? null,
          m.startDate?.day ?? null
        ),
        synopsis: typeof m.description === "string"
          ? m.description.replace(/<[^>]+>/g, "").trim()
          : null,
        synonyms: m.synonyms ?? [],
        status: m.status ?? null,
        genres: m.genres ?? [],
      })) as AnimeListItem[];
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
