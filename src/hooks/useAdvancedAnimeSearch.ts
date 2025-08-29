import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeListItem } from "../shared/interfaces";
import { mapMediaToAnimeListItem } from "../shared/utilities";

const QUERY = /* GraphQL */ `
  query (
    $page: Int
    $perPage: Int
    $search: String
    $genreIn: [String]
    $genreNotIn: [String]
    $formatIn: [MediaFormat]
    $statusIn: [MediaStatus]
    $season: MediaSeason
    $year: Int
    $country: CountryCode
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        search: $search
        genre_in: $genreIn
        genre_not_in: $genreNotIn
        format_in: $formatIn
        status_in: $statusIn
        season: $season
        seasonYear: $year
        countryOfOrigin: $country
        sort: $sort
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

export interface AdvancedSearchOptions {
    search?: string;
    genreIn?: string[];
    genreNotIn?: string[];
    formatIn?: string[];
    statusIn?: string[];
    season?: string;
    year?: number;
    country?: string;
    sort?: string[];
    page?: number;
    perPage?: number;
}

export function useAdvancedAnimeSearch(
    key: string,
    options: AdvancedSearchOptions,
) {
    const {
        search,
        genreIn,
        genreNotIn,
        formatIn,
        statusIn,
        season,
        year,
        country,
        sort = ["SCORE_DESC"],
        page = 1,
        perPage = 30,
    } = options;

    return useQuery<AnimeListItem[], Error>({
        queryKey: [
            "advancedAnimeSearch",
            key,
            search,
            genreIn?.join(","),
            genreNotIn?.join(","),
            formatIn?.join(","),
            statusIn?.join(","),
            season,
            year,
            country,
            sort.join("-"),
            page,
            perPage,
        ],
        queryFn: async ({ signal }) => {
            const data = await apiClient.post(
                "",
                {
                    query: QUERY,
                    variables: {
                        page,
                        perPage,
                        search,
                        genreIn,
                        genreNotIn,
                        formatIn,
                        statusIn,
                        season,
                        year,
                        country,
                        sort,
                    },
                },
                { signal }
            );

            const media = (data as any)?.Page?.media ?? [];
            return media.map(mapMediaToAnimeListItem);
        },
        staleTime: 60 * 60 * 1000,
        retry: false,
    });
}
