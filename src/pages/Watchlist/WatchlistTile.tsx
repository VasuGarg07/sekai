import { Star, Tags } from "lucide-react";
import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";
import { getSynopsisFallback, WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";

interface WatchlistTileProps {
    anime: AnimeWatchList
}

export default function WatchlistTile({ anime }: WatchlistTileProps) {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="flex items-center shadow-xl">
            <div className="w-1/3 h-full relative group cursor-pointer" onClick={() => goToAnime(anime.id)}>
                {/* Image */}
                {anime.image && (
                    <img
                        src={anime.image}
                        alt={anime.title_english ?? ''}
                        className="w-full h-full object-cover rounded-l-lg"
                        loading="lazy"
                    />
                )}
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 rounded-l-lg px-2 pt-3 pb-1
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-white font-semibold text-sm">
                        {anime.season} {anime.seasonYear}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="w-2/3 p-3 bg-zinc-800 h-full flex flex-col gap-1 rounded-r-lg">
                {/* Title */}
                <h3 onClick={() => goToAnime(anime.id)}
                    className="font-semibold text-rose-500 truncate leading-tight cursor-pointer
                            hover:underline hover:text-rose-600">
                    {anime.title_english ?? anime.title_romaji}
                </h3>

                <div className="text-xs lg:text-sm text-gray-300 flex flex-wrap gap-1">
                    {anime.score && (
                        <>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
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
                    {anime.episodes && (
                        <>
                            <span className="font-medium">{anime.episodes} EP</span>
                            <span>•</span>
                        </>
                    )}
                    {anime.status && (
                        <div className="font-medium">{anime.status}</div>
                    )}
                </div>

                {anime.genres && anime.genres.length > 0 && (
                    <div className="text-xs flex items-center gap-1 my-1 flex-wrap">
                        <Tags className="text-rose-500 w-4 h-4" />
                        {anime.genres.map((genre, index) => (
                            <a
                                key={index}
                                href={`/genre/${encodeURIComponent(genre)}`}
                                className="text-gray-300 hover:text-rose-300 cursor-pointer"
                            >
                                {genre}
                                {index < anime.genres.length - 1 && ", "}
                            </a>
                        ))}
                    </div>
                )}
                <p className="text-gray-400 line-clamp-5 leading-relaxed text-xs">
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
    )
}