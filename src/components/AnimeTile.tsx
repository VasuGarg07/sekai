import { memo } from "react";
import { Star, Tags } from "lucide-react";
import { Link } from "react-router";
import { animePath } from "../hooks/useAnimeNavigation";
import { getSynopsisFallback } from "../shared/constants";
import type { AnimeListItem } from "../shared/interfaces";
import { WatchlistButton } from "../ui/WatchlistButton";
import { formatScore } from "../shared/utilities";
import AnimeMeta from "./AnimeMeta";

interface AnimeTileProps {
    anime: AnimeListItem;
}

function AnimeTile({ anime }: AnimeTileProps) {
    return (
        <div className="flex items-center shadow-xl">
            <Link to={animePath(anime.id)} tabIndex={-1} aria-hidden="true" className="block w-1/3 h-full relative group">
                {/* Image */}
                {anime.image && (
                    <img
                        src={anime.image}
                        alt=""
                        className="w-full h-full object-cover rounded-l-md"
                        loading="lazy"
                    />
                )}
                {/* Season Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2 pt-3 pb-1">
                    <h3 className="text-white font-semibold text-sm">
                        {anime.season} {anime.seasonYear}
                    </h3>
                </div>
            </Link>

            {/* Content */}
            <div className="w-2/3 p-4 bg-zinc-800 h-full flex flex-col gap-1 rounded-r-md">
                {/* Title & Score */}
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-accent-500 line-clamp-2 leading-relaxed">
                        <Link to={animePath(anime.id)} className="hover:underline hover:text-accent-600 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
                            {anime.title_english ?? anime.title_romaji}
                        </Link>
                    </h3>
                    {!!anime.score && (
                        <div className="flex items-center text-yellow-500 gap-1 shrink-0">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{formatScore(anime.score)}</span>
                        </div>
                    )}
                </div>

                <AnimeMeta anime={anime} className="text-sm text-gray-300 flex flex-wrap gap-2" showScore={false} showEpisodes />

                {anime.genres && anime.genres.length > 0 && (
                    <div className="text-xs flex items-center gap-2 my-1 flex-wrap">
                        <Tags className="text-accent-500 w-4 h-4 shrink-0" />
                        {anime.genres.map((genre, index) => (
                            <Link
                                key={genre}
                                to={`/genre/${encodeURIComponent(genre)}`}
                                className="text-gray-300 hover:text-accent-300"
                            >
                                {genre}
                                {index < anime.genres.length - 1 && ","}
                            </Link>
                        ))}
                    </div>
                )}

                <p className="text-gray-400 line-clamp-4 leading-relaxed text-xs">
                    {anime.synopsis || getSynopsisFallback(anime.id)}
                </p>

                <span className="grow" />

                <WatchlistButton
                    anime={anime}
                    className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-800 
                    cursor-pointer disabled:cursor-default text-white 
                    flex text-sm items-center justify-center gap-2 
                    px-4 py-2 rounded-lg font-semibold"
                />
            </div>
        </div>
    );
}

export default memo(AnimeTile);