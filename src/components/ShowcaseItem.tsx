import { Clock, Monitor } from "lucide-react";
import type { AnimeListItem } from "../shared/interfaces";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";

interface ShowcaseItemProps {
    anime: AnimeListItem;
}

export function ShowcaseItem({ anime }: ShowcaseItemProps) {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-700">
            {/* Poster */}
            {anime.image && (
                <img
                    src={anime.image}
                    alt={anime.title_english ?? anime.title_romaji ?? "Anime"}
                    className="w-16 h-20 object-cover rounded-md"
                    onClick={() => goToAnime(anime.id)}
                />
            )}

            {/* Info */}
            <div className="flex flex-col">
                <span className="font-medium text-white text-sm hover:text-rose-300 transition mb-1 line-clamp-2"
                    onClick={() => goToAnime(anime.id)}>
                    {anime.title_english ?? anime.title_romaji}
                </span>
                <div className="flex flex-wrap justify-start items-center gap-2 sm:gap-4 text-xs">
                    <span className="flex items-center gap-1 text-white/80">
                        <Monitor size={14} className="sm:w-4 sm:h-4" />
                        {anime.type}
                    </span>
                    {anime.duration && (
                        <span className="flex items-center gap-1 text-white/80">
                            <Clock size={14} className="sm:w-4 sm:h-4" />
                            {anime.duration}m
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
