import { Calendar, CircleChevronLeft, CircleChevronRight, Clock, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Fallback from '/default-banner.jpg';
import { useAnimeSpotlight } from "../../hooks/useAnimeSpotlight";
import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";

const AUTO_TRANSITION = 5000;

const SpotlightSection: React.FC = () => {
  const { data: animeSpotlights = [], isLoading } = useAnimeSpotlight();
  const { goToAnime } = useAnimeNavigation();

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<any>(null);

  // Infinite scroll logic
  const next = () => setCurrent((prev) => (prev + 1) % animeSpotlights.length);
  const prev = () => setCurrent((prev) => (prev - 1 + animeSpotlights.length) % animeSpotlights.length);

  // Auto transition
  useEffect(() => {
    timerRef.current = setTimeout(next, AUTO_TRANSITION);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [current, animeSpotlights.length]);

  if (!animeSpotlights.length) return null;

  const anime = animeSpotlights[current];

  if (isLoading) return (
    <div>Loading...</div>
  );

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-gray-900 overflow-hidden flex items-center">
      {/* Banner Image */}
      <img
        src={anime.banner ?? Fallback}
        alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-gray-900/50 sm:to-transparent" />
      {/* Content */}
      <div className="relative flex flex-row gap-4 sm:gap-6 lg:gap-8 items-center z-10 h-full p-4 sm:p-8 lg:p-16 max-w-6xl w-full">
        <img
          src={anime.image ?? ''}
          alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
          className="h-48 lg:h-full aspect-2/3 opacity-100 rounded-lg lg:rounded-xl object-cover flex-shrink-0 mx-auto sm:mx-0"
          onClick={() => goToAnime(anime.id)}
        />
        <div className="flex flex-col justify-center text-left flex-1 min-w-0">
          <span className="text-rose-400 font-semibold mb-1 sm:mb-2 text-sm">#{current + 1} Spotlight</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">{anime.title_english ?? anime.title_romaji}</h2>
          <div className="flex flex-wrap justify-start items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1 text-white/80">
              <Monitor size={14} className="sm:w-4 sm:h-4" />
              {anime.type}
            </span>
            {anime.duration && (
              <span className="flex items-center gap-1 text-white/80">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                {anime.duration}m
              </span>
            )}
            <span className="flex items-center gap-1 text-white/80">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              {anime.startDateText}
            </span>
            {anime.isAdult && <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded">'18+'</span>}
          </div>
          <div className="hidden md:block">
            <p className="text-white/90 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm">{anime.synopsis}</p>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4">
            <button className="bg-rose-400 text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow hover:bg-rose-500 transition text-sm sm:text-base">
              Add to Watchlist
            </button>
            <button className="bg-gray-800 text-white hidden sm:block px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-700 transition text-base"
              onClick={() => goToAnime(anime.id)}>
              Detail
            </button>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <button
        className="absolute right-2 sm:right-4 bottom-8 sm:bottom-12 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md p-1.5 sm:p-2"
        onClick={next}
        aria-label="Next"
      >
        <CircleChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button
        className="absolute right-2 sm:right-4 bottom-0 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md p-1.5 sm:p-2"
        onClick={prev}
        aria-label="Previous"
      >
        <CircleChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default SpotlightSection;