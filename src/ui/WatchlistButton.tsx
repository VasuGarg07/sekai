import { useRef, useState } from "react";
import { Loader2, Check, Plus, Trash, X, AlertTriangle, Star } from "lucide-react";
import { useSaveAnime } from "../hooks/useSaveAnime";
import { useRemoveAnime } from "../hooks/useRemoveAnime";
import { useWatchlistSet } from "../hooks/useWatchlistSet";
import { Dialog, type DialogHandle } from "./Dialog";
import type { AnimeListItem } from "../shared/interfaces";

interface WatchlistButtonProps {
    anime: AnimeListItem;
    className?: string;
}

export function WatchlistButton({ anime, className = "" }: WatchlistButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const dialogRef = useRef<DialogHandle>(null);

    const { mutate: saveAnime } = useSaveAnime();
    const { mutate: removeAnime } = useRemoveAnime();
    const watchlistIds = useWatchlistSet();

    const isInWatchlist = watchlistIds.has(anime.id);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPending(true);
        saveAnime(anime, {
            onSettled: () => setIsPending(false),
        });
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        dialogRef.current?.openDialog();
    };

    const handleConfirmRemove = () => {
        setIsPending(true);
        removeAnime(anime, {
            onSuccess: () => dialogRef.current?.closeDialog(),
            onSettled: () => setIsPending(false),
        });
    };

    let content;
    if (isPending) {
        content = (
            <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isInWatchlist ? "Removing..." : "Adding..."}
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

    const title = anime.title_english ?? anime.title_romaji ?? "Anime";

    return (
        <>
            <button
                onClick={isInWatchlist ? handleRemoveClick : handleAdd}
                disabled={isPending}
                className={className}
            >
                {content}
            </button>

            <Dialog ref={dialogRef}>
                <div
                    className="bg-zinc-800 rounded-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Remove from Watchlist?</h2>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            {anime.image && (
                                <img
                                    src={anime.image}
                                    alt=""
                                    className="w-14 h-20 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="font-medium text-white text-sm line-clamp-2">{title}</p>
                                <div className="text-xs text-gray-400 flex flex-wrap gap-2 mt-1">
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
                                            <span className="font-medium">{anime.type}</span>
                                            <span>•</span>
                                        </>
                                    )}
                                    {anime.status && (
                                        <span className="font-medium">{anime.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => dialogRef.current?.closeDialog()}
                                disabled={isPending}
                                className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 text-white text-sm hover:bg-zinc-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRemove}
                                disabled={isPending}
                                className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                <Trash className="w-4 h-4" />
                                {isPending ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}