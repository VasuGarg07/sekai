import { Star } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import type { AnimeListItem } from "../shared/interfaces";
import { formatScore } from "../shared/utilities";

interface AnimeMetaProps {
    anime: Pick<AnimeListItem, "score" | "type" | "episodes" | "status">;
    className?: string;
    starClassName?: string;
    showScore?: boolean;
    showEpisodes?: boolean;
}

/** "★ 8.4 • TV • 12 EP • FINISHED" — only the parts that have a value, with separators between them. */
export default function AnimeMeta({
    anime,
    className = "text-xs text-gray-400 flex flex-wrap gap-2",
    starClassName = "w-3 h-3 text-yellow-500",
    showScore = true,
    showEpisodes = false,
}: AnimeMetaProps) {
    const parts: { key: string; node: ReactNode }[] = [];

    if (showScore && anime.score) {
        parts.push({
            key: "score",
            node: (
                <span className="flex items-center gap-1">
                    <Star className={starClassName} aria-hidden="true" />
                    <span className="font-medium">
                        <span className="sr-only">Score </span>
                        {formatScore(anime.score)}
                    </span>
                </span>
            ),
        });
    }
    if (anime.type) {
        parts.push({ key: "type", node: <span className="font-medium">{anime.type}</span> });
    }
    if (showEpisodes && anime.episodes) {
        parts.push({ key: "episodes", node: <span className="font-medium">{anime.episodes} EP</span> });
    }
    if (anime.status) {
        parts.push({ key: "status", node: <span className="font-medium">{anime.status}</span> });
    }

    if (parts.length === 0) return null;

    return (
        <div className={className}>
            {parts.map((part, i) => (
                <Fragment key={part.key}>
                    {i > 0 && <span aria-hidden="true">•</span>}
                    {part.node}
                </Fragment>
            ))}
        </div>
    );
}
