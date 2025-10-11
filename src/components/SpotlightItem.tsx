import { Calendar, Clapperboard, Clock, Monitor } from "lucide-react";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";
import type { AnimeSpotlight } from "../shared/interfaces";
import Fallback from "/default-banner.jpg";
import { getSynopsisFallback } from "../shared/constants";
import { WatchlistButton } from "../ui/WatchlistButton";

interface SpotlightItemProps {
    anime: AnimeSpotlight;
    index: number;
}

const SpotlightItem = ({ anime, index }: SpotlightItemProps) => {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="relative w-full h-full">
            {/* Background Banner Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={anime.banner || Fallback}
                    alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative flex items-center z-10 h-full max-w-screen mx-auto p-4 sm:p-8 lg:p-16">
                {/* Left side - Poster Image */}
                <div className="hidden sm:flex flex-shrink-0 mr-4 sm:mr-6 lg:mr-8">
                    <img
                        src={anime.image || Fallback}
                        alt={anime.title_english ?? anime.title_romaji ?? "Anime Poster"}
                        className="h-64 lg:h-80 w-auto rounded-lg shadow-2xl cursor-pointer transition-transform hover:scale-105"
                        onClick={() => goToAnime(anime.id)}
                    />
                </div>

                {/* Right side - Content */}
                <div className="flex-1 text-white space-y-2 sm:space-y-4">
                    {/* Spotlight Badge */}
                    <div className="inline-flex items-center sm:px-2 sm:py-0.5 sm:rounded-full sm:bg-rose-500/20 sm:border sm:border-rose-500/30">
                        <span className="text-rose-400 font-semibold text-xs">
                            #{index + 1} Spotlight
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2">
                        {anime.title_english ?? anime.title_romaji}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                            <Monitor size={16} />
                            <span>{anime.type}</span>
                        </div>
                        {anime.duration && (
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{anime.duration} min</span>
                            </div>
                        )}
                        {anime.episodes && (
                            <div className="flex items-center gap-1">
                                <Clapperboard size={16} />
                                <span>{anime.episodes} ep</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{anime.startDateText}</span>
                        </div>
                    </div>

                    {/* Synopsis */}
                    <div className="hidden sm:block">
                        <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-3">
                            {anime.synopsis || getSynopsisFallback(anime.id)}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <WatchlistButton
                            anime={anime}
                            className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-800
                                cursor-pointer disabled:cursor-default text-white font-semibold 
                                px-4 py-2 rounded-lg transition-all duration-200 
                                text-sm sm:text-base"
                        />
                        <button
                            onClick={() => goToAnime(anime.id)}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border 
                                border-white/20 text-white font-semibold px-4 py-2 rounded-lg 
                                transition-all duration-200 text-sm sm:text-base hidden sm:block"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotlightItem;