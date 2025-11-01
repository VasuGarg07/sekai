import { Star, Tags } from "lucide-react";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";
import { getSynopsisFallback } from "../shared/constants";
import type { AnimeListItem } from "../shared/interfaces";
import { WatchlistButton } from "../ui/WatchlistButton";

interface AnimeTileProps {
    anime: AnimeListItem;
}

export default function AnimeTile({ anime }: AnimeTileProps) {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="flex items-center shadow-xl">
            <div className="w-1/3 h-full relative group cursor-pointer" onClick={() => goToAnime(anime.id)}>
                {/* Image */}
                {anime.image && (
                    <img
                        src={anime.image}
                        alt={anime.title_english ?? ''}
                        className="w-full h-full object-cover rounded-l-md"
                        loading="lazy"
                    />
                )}
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pt-3 pb-1">
                    <h3 className="text-white font-semibold text-sm">
                        {anime.season} {anime.seasonYear}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="w-2/3 p-4 bg-zinc-800 h-full flex flex-col gap-1 rounded-r-md">
                {/* Season & Score */}
                <div className="flex items-center justify-between gap-2">
                    <h3
                        onClick={() => goToAnime(anime.id)}
                        className="font-semibold text-accent-500 line-clamp-2 leading-relaxed cursor-pointer
                            hover:underline hover:text-accent-600">
                        {anime.title_english ?? anime.title_romaji}
                    </h3>
                    {anime.score && (
                        <div className="flex items-center text-yellow-500 gap-1">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{anime.score / 10}</span>
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-300 flex flex-wrap gap-2">
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
                    <div className="text-xs flex items-center gap-2 my-1 flex-wrap">
                        <Tags className="text-accent-500 w-4 h-4" />
                        {anime.genres.map((genre, index) => (
                            <a
                                key={index}
                                href={`/genre/${encodeURIComponent(genre)}`}
                                className="text-gray-300 hover:text-accent-300 cursor-pointer"
                            >
                                {genre}
                                {index < anime.genres.length - 1 && ", "}
                            </a>
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
    )
}