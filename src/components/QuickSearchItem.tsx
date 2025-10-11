import { getSynopsisFallback } from "../shared/constants";
import type { AnimeListItem } from "../shared/interfaces";
import { WatchlistButton } from "../ui/WatchlistButton";

interface QuickSearchItemProps {
    anime: AnimeListItem;
    handleClick: (anilistId: number) => void;
}

export default function QuickSearchItem({ anime, handleClick }: QuickSearchItemProps) {
    return (
        <div
            key={anime.id}
            onClick={() => handleClick(anime.id)}
            className="flex items-start space-x-3 p-3 hover:bg-zinc-700 cursor-pointer border-b border-zinc-600 last:border-b-0 transition-colors"
        >
            <img
                src={anime.image ?? ""}
                alt={anime.title_english ?? anime.title_romaji ?? "Poster"}
                className="w-14 h-20 object-cover rounded bg-zinc-700 flex-shrink-0"
                loading="lazy"
            />

            <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-sm font-semibold text-rose-500 truncate">
                    {anime.title_english ?? anime.title_romaji ?? "Untitled"}
                </h3>

                {/* Synopsis */}
                <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {anime.synopsis || getSynopsisFallback(anime.id)}
                </p>

                {/* Info Row + Watchlist */}
                <div className="mt-2 flex items-center justify-between">
                    {/* Anime Info */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-200">
                        {anime.score && (
                            <>
                                <span className="bg-yellow-500 text-white rounded px-1 font-medium">
                                    ★ {anime.score}%
                                </span>
                                <span>•</span>
                            </>
                        )}
                        {anime.type && (
                            <>
                                <span className="bg-cyan-500 text-white rounded px-1 font-medium uppercase">
                                    {anime.type}
                                </span>
                                <span>•</span>
                            </>
                        )}
                        {anime.seasonYear && (
                            <>
                                <span className="bg-lime-500 text-white rounded px-1 font-medium uppercase">
                                    {anime.seasonYear}
                                </span>
                                <span>•</span>
                            </>
                        )}
                        {anime.duration && (
                            <span className="bg-purple-500 text-white rounded px-1 font-medium">
                                {anime.duration >= 60
                                    ? `${Math.floor(anime.duration / 60)}h ${anime.duration % 60}m`
                                    : `${anime.duration}m`}
                            </span>
                        )}
                    </div>

                    {/* Watchlist Button */}
                    <WatchlistButton
                        anime={anime}
                        className="text-xs px-2 py-1 bg-rose-600 hover:bg-rose-800 rounded-md text-zinc-200 flex items-center gap-1 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}