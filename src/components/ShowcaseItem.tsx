import { Clapperboard, Clock, Monitor } from "lucide-react";
import type { AnimeListItem } from "../shared/interfaces";
import { Link } from "react-router";
import { animePath } from "../hooks/useAnimeNavigation";

interface ShowcaseItemProps {
    anime: AnimeListItem;
}

export function ShowcaseItem({ anime }: ShowcaseItemProps) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-700">
            {/* Poster — same link as the title, so skipped by Tab */}
            {anime.image && (
                <Link to={animePath(anime.id)} tabIndex={-1} aria-hidden="true" className="shrink-0">
                    <img
                        src={anime.image}
                        alt=""
                        className="w-16 h-20 object-cover rounded-md"
                    />
                </Link>
            )}

            {/* Info */}
            <div className="flex flex-col grow">
                <Link
                    to={animePath(anime.id)}
                    className="text-white text-sm font-semibold hover:text-accent-400 transition mb-1 line-clamp-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                >
                    {anime.title_english ?? anime.title_romaji}
                </Link>
                <div className="flex flex-wrap justify-start items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                        <Monitor size={14} className="sm:w-4 sm:h-4" />
                        {anime.type}
                    </span>
                    {!!anime.duration && (
                        <span className="flex items-center gap-1 text-gray-400">
                            <Clock size={14} className="sm:w-4 sm:h-4" />
                            {anime.duration} min
                        </span>
                    )}
                    {!!anime.episodes && (
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