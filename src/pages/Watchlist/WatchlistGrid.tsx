import { memo } from "react";
import { Link } from "react-router";
import { animePath } from "../../hooks/useAnimeNavigation";
import { WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";
import AnimeMeta from "../../components/AnimeMeta";

interface WatchlistGridProps {
    anime: AnimeWatchList;
}

function WatchlistGrid({ anime }: WatchlistGridProps) {
    return (
        <div className="relative">
            {anime.image && (
                <Link
                    to={animePath(anime.id)}
                    className="block aspect-4/5 relative shadow-md group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                >
                    <img
                        src={anime.image}
                        alt=""
                        className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                        loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 rounded-b-sm px-2 pt-3 pb-1
                        bg-linear-to-t from-black/80 via-black/60 to-transparent">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm leading-tight">
                            {anime.title_english ?? anime.title_romaji}
                        </h3>
                        <AnimeMeta anime={anime} className="text-xs text-gray-200 flex flex-wrap gap-2" starClassName="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </div>
                </Link>
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
    );
}

export default memo(WatchlistGrid);