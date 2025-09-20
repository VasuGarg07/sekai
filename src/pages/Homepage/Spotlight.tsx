import { Calendar, Clapperboard, Clock, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";
import { useAnimeSpotlight } from "../../hooks/useAnimeSpotlight";
import Fallback from "/default-banner.jpg";

const AUTO_TRANSITION = 5000;

const SpotlightSection: React.FC = () => {
  const {
    data: animeSpotlights = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAnimeSpotlight();
  const { goToAnime } = useAnimeNavigation();

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<any>(null);

  const len = animeSpotlights.length;

  const next = () => len && setCurrent((prev) => (prev + 1) % len);

  useEffect(() => {
    if (!len) return;
    timerRef.current = setTimeout(next, AUTO_TRANSITION);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [current, len]);

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-end gap-1.5 h-7">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-white font-semibold">Loading</p>
          <p className="text-white/70 text-sm">Fetching spotlight anime…</p>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (isError) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-neutral-900 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-white font-semibold">Something went wrong</p>
          <p className="text-white/70 text-sm mt-1">
            {error instanceof Error ? error.message : "We couldn’t load the spotlight right now."}
          </p>
          <button
            onClick={() => refetch?.()}
            className="mt-3 inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full font-semibold shadow transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Empty state ---
  if (!len) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-neutral-900/80 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-white font-semibold">Nothing to show (yet)</p>
          <p className="text-white/70 text-sm mt-1">We couldn’t find any spotlight anime. Try again later.</p>
        </div>
      </div>
    );
  }

  const anime = animeSpotlights[current];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-neutral-900 overflow-hidden flex items-center">
      {/* Banner Image */}
      <img
        src={anime.banner || Fallback}
        alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-neutral-900/50 sm:to-transparent" />
      {/* Content */}
      <div className="relative flex flex-row gap-4 sm:gap-6 lg:gap-8 items-center z-10 h-full p-4 sm:p-8 lg:p-16 max-w-6xl w-full">
        <img
          src={anime.image || ""}
          alt={anime.title_english ?? anime.title_romaji ?? "Anime Poster"}
          className="hidden xs:block h-48 lg:h-full aspect-2/3 rounded-lg lg:rounded-xl object-cover flex-shrink-0 mx-auto sm:mx-0 cursor-pointer"
          onClick={() => goToAnime(anime.id)}
        />
        <div className="flex flex-col justify-center text-left flex-1 min-w-0">
          <span className="text-rose-400 font-semibold mb-1 sm:mb-2 text-sm">#{current + 1} Spotlight</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">
            {anime.title_english ?? anime.title_romaji}
          </h2>
          <div className="flex flex-wrap justify-start items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1 text-white/80">
              <Monitor size={14} className="sm:w-4 sm:h-4" />
              {anime.type}
            </span>
            {anime.duration && (
              <span className="flex items-center gap-1 text-white/80">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                {anime.duration} min
              </span>
            )}
            {anime.episodes && (
              <span className="flex items-center gap-1 text-white/80">
                <Clapperboard size={14} className="sm:w-4 sm:h-4" />
                {anime.episodes} ep
              </span>
            )}
            <span className="flex items-center gap-1 text-white/80">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              {anime.startDateText}
            </span>
            {anime.isAdult && <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded">18+</span>}
          </div>
          <div className="hidden md:block">
            <p className="text-white/90 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm">{anime.synopsis}</p>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4">
            <button className="bg-rose-400 text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow hover:bg-rose-500 transition text-sm sm:text-base">
              Add to Watchlist
            </button>
            <button
              className="bg-neutral-800 text-white hidden sm:block px-6 py-2 rounded-full font-semibold shadow hover:bg-neutral-700 transition text-base"
              onClick={() => goToAnime(anime.id)}
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {animeSpotlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition ${current === idx ? "bg-rose-400 scale-110" : "bg-white/40 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotlightSection;
