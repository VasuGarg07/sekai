import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import { formatDate, getCurrentSeasonYear } from "../shared/utilities";

export interface AnimeSpotlight {
  id: number;
  image: string | null;
  title_english: string | null;
  title_romaji: string | null;
  banner: string | null;
  type: string | null;
  duration: number | null;
  score: number | null;
  startDateText: string | null;
  synopsis: string | null;
  isAdult: boolean;
}

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
        isAdult
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
        id: m.id,
        image: m.coverImage?.large ?? null,
        title_english: m.title?.english ?? null,
        title_romaji: m.title?.romaji ?? null,
        banner: m.bannerImage ?? null,
        type: m.format ?? null,
        duration: m.duration ?? null,
        score: m.averageScore ?? null,
        startDateText: formatDate(
          m.startDate?.year ?? null,
          m.startDate?.month ?? null,
          m.startDate?.day ?? null
        ),
        synopsis:
          typeof m.description === "string"
            ? m.description.replace(/<[^>]+>/g, "").trim()
            : null,
        isAdult: m.isAdult ?? false,
      })) as AnimeSpotlight[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
}
