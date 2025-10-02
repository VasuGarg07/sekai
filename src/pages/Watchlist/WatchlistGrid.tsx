import { Star } from "lucide-react";
import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";
import { WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";

interface WatchlistGridProps {
    anime: AnimeWatchList;
}

export default function WatchlistGrid({ anime }: WatchlistGridProps) {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="relative">
            {anime.image && (
                <div className="aspect-[4/5] relative cursor-pointer shadow-md"
                    onClick={() => goToAnime(anime.id)}>
                    <img
                        src={anime.image}
                        alt={anime.title_english ?? ''}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 rounded-b-sm px-2 pt-3 pb-1
                        bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm leading-tight cursor-pointer">
                            {anime.title_english ?? anime.title_romaji}
                        </h3>
                        <div className="text-xs text-gray-200 flex flex-wrap gap-2">
                            {anime.score && (
                                <>
                                    <div className="flex items-center">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                                        <span className="font-medium">{anime.score / 10}</span>
                                    </div>
                                    <span>•</span>
                                </>
                            )}
                            {anime.type && (
                                <>
                                    <div className="font-medium">{anime.type}</div>
                                    <span>•</span>
                                </>
                            )}
                            {anime.status && (
                                <div className="font-medium">{anime.status}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 py-2">
                {anime.watchStatus && (
                    <div className={`rounded-md px-2 py-0.5 text-xs ${WatchStatusColor[anime.watchStatus]}`}>
                        {formatKey(anime.watchStatus)}
                    </div>
                )}
                <span className="grow" />

                <EditAnime anime={anime} />
                <RemoveAnime anime={anime} />
            </div>
        </div>
    )
}