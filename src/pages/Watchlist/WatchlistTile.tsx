import { Tags } from "lucide-react";
import { Link } from "react-router";
import { animePath } from "../../hooks/useAnimeNavigation";
import { getSynopsisFallback, WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";
import AnimeMeta from "../../components/AnimeMeta";

interface WatchlistTileProps {
    anime: AnimeWatchList;
}

export default function WatchlistTile({ anime }: WatchlistTileProps) {
    return (
        <div className="flex items-center shadow-xl">
            <Link to={animePath(anime.id)} tabIndex={-1} aria-hidden="true" className="block w-1/3 h-full relative group">
                {anime.image && (
                    <img
                        src={anime.image}
                        alt=""
                        className="w-full h-full object-cover rounded-l-lg"
                        loading="lazy"
                    />
                )}
                <div className="absolute bottom-0 left-0 right-0 rounded-l-lg px-2 pt-3 pb-1
                    bg-linear-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-white font-semibold text-sm">
                        {anime.season} {anime.seasonYear}
                    </h3>
                </div>
            </Link>

            {/* Content */}
            <div className="w-2/3 p-3 bg-zinc-800 h-full flex flex-col gap-1 rounded-r-lg">
                <h3 className="font-semibold text-accent-500 truncate leading-tight">
                    <Link to={animePath(anime.id)} className="hover:underline hover:text-accent-600 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
                        {anime.title_english ?? anime.title_romaji}
                    </Link>
                </h3>

                <AnimeMeta anime={anime} className="text-xs lg:text-sm text-gray-300 flex flex-wrap gap-1" starClassName="w-3 h-3 text-yellow-500 fill-yellow-400" showEpisodes />

                {anime.genres && anime.genres.length > 0 && (
                    <div className="text-xs flex items-center gap-1 my-1 flex-wrap">
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

                <p className="text-gray-400 line-clamp-3 leading-relaxed text-xs">
                    {anime.synopsis || getSynopsisFallback(anime.id)}
                </p>

                <span className="grow" />

                <div className="flex items-center gap-2">
                    {anime.watchStatus && (
                        <div className={`rounded-md px-2 py-0.5 text-xs lg:text-sm border ${WatchStatusColor[anime.watchStatus]}`}>
                            {formatKey(anime.watchStatus)}
                        </div>
                    )}
                    <span className="grow" />
                    <EditAnime anime={anime} />
                    <RemoveAnime anime={anime} />
                </div>
            </div>
        </div>
    );
}