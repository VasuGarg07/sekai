import { Loader2, Check, Plus } from "lucide-react";
import { useSaveAnime } from "../hooks/useSaveAnime";
import { useGetWatchlist } from "../hooks/useGetWatchlist";
import type { AnimeListItem } from "../shared/interfaces";

interface WatchlistButtonProps {
    anime: AnimeListItem;
    className?: string;
}

export function WatchlistButton({ anime, className = "" }: WatchlistButtonProps) {
    const { mutate, isPending } = useSaveAnime();
    const { data: watchlistItems = [] } = useGetWatchlist();

    const isInWatchlist = watchlistItems.some(item => item.id === anime.id);

    let content;
    if (isPending) {
        content = (
            <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
            </span>
        );
    } else if (isInWatchlist) {
        content = (
            <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Added
            </span>
        );
    } else {
        content = (
            <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add to Watchlist
            </span>
        );
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); mutate(anime); }}
            disabled={isPending || isInWatchlist}
            className={className}
        >
            {content}
        </button>
    );
}