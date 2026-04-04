import { useQuery } from "@tanstack/react-query";
import apiClient from "../shared/apiClient";
import type { AnimeDetail, AnimeDetailResponse } from "../shared/interfaces";
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
      season
      seasonYear
      relations {
        edges {
          relationType
          node {
            id
            type
            title {
              romaji
              english
            }
            coverImage {
              extraLarge
              large
            }
            format
            status
          }
        }
      }
      recommendations(perPage: 24, sort: RATING_DESC) {
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
      trailer {
        id
        site
        thumbnail
      }
      nextAiringEpisode {
        airingAt
        episode
      }
    }
  }
`;

export function useAnimeDetail(id: number) {
  return useQuery<AnimeDetail, Error>({
    queryKey: ["animeDetail", id],
    queryFn: async () => {
      const data = await apiClient<AnimeDetailResponse>(QUERY, { id });
      if (!data.Media) throw new Error("Anime not found");
      return mapMediaToAnimeDetail(data.Media as AnimeDetail);
    },
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}