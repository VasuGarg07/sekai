import { Calendar, CircleChevronLeft, CircleChevronRight, Clock, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAnimeSpotlight } from "../hooks/useAnimeSpotlight";
import Fallback from '/default-banner.jpg';

const AUTO_TRANSITION = 5000;

const SpotlightSection: React.FC = () => {
  const { data: animeSpotlights = [], isLoading } = useAnimeSpotlight();
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
    <div className="relative w-full h-[480px] bg-gray-900 overflow-hidden flex items-center">
      {/* Banner Image */}
      <img
        src={anime.banner ?? Fallback}
        alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      {/* Content */}
      <div className="relative flex gap-8 z-10 h-full p-16 max-w-6xl">
        <img
          src={anime.image ?? ''}
          alt={anime.title_english ?? anime.title_romaji ?? "Anime Banner"}
          className="h-full aspect-2/3 opacity-100 rounded-xl"
        />
        <div className="flex flex-col justify-center">
          <span className="text-orange-400 font-semibold mb-2">#{current + 1} Spotlight</span>
          <h2 className="text-3xl font-bold text-white mb-4">{anime.title_english ?? anime.title_romaji}</h2>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1 text-white/80">
              <Monitor size={16} />
              {anime.type}
            </span>
            <span className="flex items-center gap-1 text-white/80">
              <Clock size={16} />
              {anime.duration ? `${anime.duration}m` : ""}
            </span>
            <span className="flex items-center gap-1 text-white/80">
              <Calendar size={16} />
              {anime.startDateText}
            </span>
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">{anime.isAdult ? 'R+' : 'PG-13'}</span>
          </div>
          <p className="text-white/90 mb-6 line-clamp-3 text-sm">{anime.synopsis}</p>
          <div className="flex gap-4">
            {/* TODO: */}
            <button className="bg-orange-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-500 transition">
              Add to Watchlist
            </button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-700 transition">
              Detail
            </button>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <button
        className="absolute right-4 bottom-12 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md p-2"
        onClick={next}
        aria-label="Next"
      >
        <CircleChevronRight size={24} />
      </button>
      <button
        className="absolute right-4 bottom-0 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md p-2"
        onClick={prev}
        aria-label="Previous"
      >
        <CircleChevronLeft size={24} />
      </button>
    </div>
  );
};

export default SpotlightSection;