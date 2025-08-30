import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AnimePreviewCard from "./AnimePreviewCard";
import type { AnimeListItem } from "../shared/interfaces";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";

interface AnimeGalleryCardProps {
    anime: AnimeListItem;
}

export default function AnimeGalleryCard({ anime }: AnimeGalleryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<number | null>(null);
    const { goToAnime } = useAnimeNavigation();

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(true);
        }, 400); // 400ms delay
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        setIsHovered(false);
    };

    const previewRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isHovered && previewRef.current) {
            const rect = previewRef.current.getBoundingClientRect();
            const { innerWidth, innerHeight } = window;

            // if overflowing right → stick left
            if (rect.right > innerWidth) {
                previewRef.current.style.left = "auto";
                previewRef.current.style.right = "50%";
            }
            // if overflowing bottom → stick top
            if (rect.bottom > innerHeight) {
                previewRef.current.style.top = "auto";
                previewRef.current.style.bottom = "50%";
            }
        }
    }, [isHovered]);

    return (
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {anime.image && (
                <div className="aspect-[4/5] relative cursor-pointer"
                    onClick={() => goToAnime(anime.id)}>
                    <img
                        src={anime.image}
                        alt={anime.title_english ?? ''}
                        className="w-full h-full object-cover rounded-md transition-all duration-300 hover:blur-xs hover:brightness-90"
                        loading="lazy"
                    />

                    {/* Overlay Preview Card */}
                    {isHovered && (
                        <div
                            ref={previewRef}
                            className="absolute z-50 w-auto max-w-sm"
                            style={{
                                top: "50%",
                                left: "50%",
                            }}
                        >
                            <AnimePreviewCard anime={anime} />
                        </div>
                    )}
                </div>
            )}

            <div className="py-2">
                <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm leading-tight cursor-pointer"
                    onClick={() => goToAnime(anime.id)}>
                    {anime.title_english ?? anime.title_romaji}
                </h3>

                <div className="text-xs text-gray-300 flex flex-wrap gap-2">
                    {anime.score && (
                        <>
                            <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
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
                    {anime.status && (
                        <div className="font-medium">{anime.status}</div>
                    )}
                </div>
            </div>
        </div>
    )
}