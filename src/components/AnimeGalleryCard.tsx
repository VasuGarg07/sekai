import { memo, useEffect, useRef, useState } from "react";
import AnimePreviewCard from "./AnimePreviewCard";
import type { AnimeListItem } from "../shared/interfaces";
import { Link } from "react-router";
import { animePath } from "../hooks/useAnimeNavigation";
import AnimeMeta from "./AnimeMeta";

interface AnimeGalleryCardProps {
    anime: AnimeListItem;
}

function AnimeGalleryCard({ anime }: AnimeGalleryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(true);
        }, 400);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
        setIsHovered(false);
    };

    // Reposition after render to prevent clipping at viewport edges
    useEffect(() => {
        if (isHovered && previewRef.current) {
            const rect = previewRef.current.getBoundingClientRect();
            const { innerWidth, innerHeight } = window;

            if (rect.right > innerWidth) {
                previewRef.current.style.left = "auto";
                previewRef.current.style.right = "50%";
            }
            if (rect.bottom > innerHeight) {
                previewRef.current.style.top = "auto";
                previewRef.current.style.bottom = "50%";
            }
        }
    }, [isHovered]);

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // Keyboard users get the same preview (with its watchlist button) when they tab in
            onFocus={() => setIsHovered(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) handleMouseLeave();
            }}
        >
            {anime.image && (
                // Same destination as the title link below, so it's skipped by Tab and screen readers
                <Link
                    to={animePath(anime.id)}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block aspect-4/5 relative shadow-md"
                >
                    <img
                        src={anime.image}
                        alt=""
                        className="w-full h-full object-cover rounded-md transition-all duration-300 hover:blur-xs hover:brightness-90"
                        loading="lazy"
                    />
                </Link>
            )}

            {/* Preview card — outside the clickable image div so WatchlistButton clicks
                don't trigger navigation, positioned to overlap like the original */}
            {isHovered && (
                <div
                    ref={previewRef}
                    className="absolute z-50 w-auto max-w-xs min-w-64"
                    style={{ top: "50%", left: "50%" }}
                >
                    <AnimePreviewCard anime={anime} />
                </div>
            )}

            <div className="py-2">
                <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm leading-tight">
                    <Link to={animePath(anime.id)} className="hover:text-accent-400 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
                        {anime.title_english ?? anime.title_romaji}
                    </Link>
                </h3>

                <AnimeMeta anime={anime} className="text-xs text-gray-400 flex flex-wrap gap-2" starClassName="w-3 h-3 text-yellow-500" />
            </div>
        </div>
    );
}

export default memo(AnimeGalleryCard);