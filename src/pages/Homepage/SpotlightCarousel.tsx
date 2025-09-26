import { useEffect, useRef, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import SpotlightItem from "../../components/SpotlightItem";
import { useAnimeSpotlight } from "../../hooks/useAnimeSpotlight";

const AUTO_TRANSITION = 5000;

const SpotlightCarousel: React.FC = () => {
  const {
    data: animeSpotlights = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAnimeSpotlight();

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<any>(null);

  const len = animeSpotlights.length;

  const next = () => {
    if (!len) return;
    clearTimeout(timerRef.current);
    setCurrent((prev) => (prev + 1) % len);
  }

  const prev = () => {
    if (!len) return;
    clearTimeout(timerRef.current);
    setCurrent((prev) => (prev - 1 + len) % len);
  }

  useEffect(() => {
    if (!len) return;
    timerRef.current = setTimeout(next, AUTO_TRANSITION);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [current, len]);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true
  });

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
            {error instanceof Error ? error.message : "We couldn't load the spotlight right now."}
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
          <p className="text-white/70 text-sm mt-1">We couldn't find any spotlight anime. Try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div {...handlers} className="relative w-full h-[240px] sm:h-[400px] lg:h-[480px] bg-neutral-900 overflow-hidden flex items-center">

      {/* Slider Wrapper */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {animeSpotlights.map((anime, idx) => (
          <div key={anime.id || idx} className="w-full h-full flex-shrink-0">
            <SpotlightItem anime={anime} index={idx} />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {animeSpotlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${current === idx
              ? "bg-rose-500 scale-110"
              : "bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotlightCarousel;