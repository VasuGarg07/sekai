import { Clapperboard, Clock, Monitor } from "lucide-react";
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
            <div className="flex flex-col grow">
                <span className="text-white text-sm font-semibold hover:text-accent-400 hover:cursor-pointer transition mb-1 line-clamp-2"
                    onClick={() => goToAnime(anime.id)}>
                    {anime.title_english ?? anime.title_romaji}
                </span>
                <div className="flex flex-wrap justify-start items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                        <Monitor size={14} className="sm:w-4 sm:h-4" />
                        {anime.type}
                    </span>
                    {anime.duration && (
                        <span className="flex items-center gap-1 text-gray-400">
                            <Clock size={14} className="sm:w-4 sm:h-4" />
                            {anime.duration} min
                        </span>
                    )}
                    {anime.episodes && (
                        <span className="flex items-center gap-1 text-gray-400">
                            <Clapperboard size={14} className="sm:w-4 sm:h-4" />
                            {anime.episodes} ep
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
