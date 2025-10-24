import { Loader2, Check, Plus } from "lucide-react";
import { useSaveAnime } from "../hooks/useSaveAnime";
import { useAppSelector } from "../store/reduxHooks";
import type { AnimeListItem } from "../shared/interfaces";

interface WatchlistButtonProps {
    anime: AnimeListItem;
    className?: string;
}

export function WatchlistButton({ anime, className = "" }: WatchlistButtonProps) {
    const { mutate, isPending } = useSaveAnime();
    const watchlistIds = useAppSelector((state) => state.watchlist.items);

    const isInWatchlist = watchlistIds.findIndex(item => item.id == anime.id) >= 0;

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

    const handleClick = (event: any) => {
        event.stopPropagation()
        mutate(anime)
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending || isInWatchlist}
            className={className}
        >
            {content}
        </button>
    );
}
