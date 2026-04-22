import type { AnimeListItem } from "../shared/interfaces";
import AnimeGalleryCard from "./AnimeGalleryCard";
import AnimeTile from "./AnimeTile";

interface AnimeGalleryProps {
    tileView: boolean;
    data: AnimeListItem[];
}

export default function AnimeGallery({ tileView, data }: AnimeGalleryProps) {
    if (tileView) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((anime) => (
                    <AnimeTile key={anime.id} anime={anime} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {data.map((anime) => (
                <AnimeGalleryCard key={anime.id} anime={anime} />
            ))}
        </div>
    );
}