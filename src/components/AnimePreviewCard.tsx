import { Bookmark, Star } from "lucide-react";
import type { AnimeListItem } from "../shared/interfaces";
import { getSynopsisFallback } from "../shared/constants";

interface AnimePreviewCardProps {
    anime: AnimeListItem;
}

export default function AnimePreviewCard({ anime }: AnimePreviewCardProps) {
    return (
        <div className="backdrop-blur-xl bg-zinc-700/70 rounded-md shadow-2xl p-4 space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">
                {anime.title_english ?? anime.title_romaji}
            </h3>

            <div className="flex items-center gap-2">
                {anime.score && (
                    <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded">
                        <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                        <span className="text-white font-medium">{(anime.score / 10).toFixed(1)}</span>
                    </div>
                )}
                {anime.type && (
                    <div className="bg-purple-500/30 px-2 py-1 rounded">
                        <span className="text-white font-medium">{anime.type}</span>
                    </div>
                )}
                {anime.status && (
                    <div className="bg-green-500/30 px-2 py-1 rounded">
                        <span className="text-white font-medium">{anime.status}</span>
                    </div>
                )}
            </div>

            <p className="text-gray-200 line-clamp-4 leading-relaxed text-[10px]">
                {anime.synopsis || getSynopsisFallback(anime.id)}
            </p>

            <div className="text-white space-y-0.5 text-[10px] leading-relaxed">
                {anime.synonyms && anime.synonyms.length > 0 && (
                    <div>
                        <span className="text-gray-300">Synonyms:</span> {anime.synonyms.slice(0, 2).join(', ')}
                    </div>
                )}
                {anime.season && (
                    <div>
                        <span className="text-gray-300">Season:</span> {anime.season} {anime.seasonYear}
                    </div>
                )}
                {anime.startDateText && (
                    <div>
                        <span className="text-gray-300">Aired:</span> {anime.startDateText}
                    </div>
                )}
                {anime.episodes && (
                    <div>
                        <span className="text-gray-300">Episodes:</span> {anime.episodes}
                    </div>
                )}
                {anime.duration && (
                    <div>
                        <span className="text-gray-300">Duration:</span> {anime.duration} min/ep
                    </div>
                )}
                {anime.genres && anime.genres.length > 0 && (
                    <div>
                        <span className="text-gray-300">Genres:</span>{" "}
                        {anime.genres.map((genre, index) => (
                            <a
                                key={index}
                                href={`/genre/${encodeURIComponent(genre)}`}
                                className="text-white hover:text-rose-300 cursor-pointer"
                            >
                                {genre}
                                {index < anime.genres.length - 1 && ", "}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <button className="flex w-full mt-1 items-center justify-center gap-1 bg-rose-500 hover:bg-rose-500/80 cursor-pointer text-white px-3 py-2 rounded-md font-medium">
                <Bookmark className="w-4 h-4 fill-current" />
                Add to Watchlist
            </button>
        </div>
    );
}