import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeDetail } from "../shared/interfaces";
import { mapMediaToAnimeDetail } from "../shared/utilities";

const QUERY = /* GraphQL */ `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description(asHtml: false)
      format
      status
      episodes
      duration
      season
      seasonYear
      countryOfOrigin
      synonyms
      genres
      tags {
        name
        description
        rank
        isGeneralSpoiler
        isMediaSpoiler
      }
      averageScore
      popularity
      favourites
      relations {
        relationType
        node {
          id
          title { romaji english }
          coverImage { large }
          format
          status
        }
      }
      recommendations(perPage: 18, sort: RATING_DESC) {
        edges {
          node {
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { large }
              format
              status
              averageScore
              seasonYear
              duration
              description(asHtml: false)
              synonyms
              genres
            }
          }
        }
      }
    }
  }
`;

export function useAnimeDetail(id: number) {
    return useQuery<AnimeDetail, Error>({
        queryKey: ["animeDetail", id],
        queryFn: async ({ signal }) => {
            const data = await apiClient.post(
                "",
                { query: QUERY, variables: { id } },
                { signal }
            );

            const m = (data as any)?.Media;
            if (!m) throw new Error("Anime not found");

            return mapMediaToAnimeDetail(m);
        },
        staleTime: 30 * 60 * 1000,
        retry: false,
    });
}
