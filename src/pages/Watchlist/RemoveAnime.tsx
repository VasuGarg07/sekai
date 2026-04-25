import { useRef, useState } from "react";
import { Trash, X, AlertTriangle, Star } from "lucide-react";
import type { AnimeWatchList } from "../../shared/interfaces";
import { useRemoveAnime } from "../../hooks/useRemoveAnime";
import { Dialog, type DialogHandle } from "../../ui/Dialog";

type RemoveAnimeProps = {
    anime: AnimeWatchList;
};

export function RemoveAnime({ anime }: RemoveAnimeProps) {
    const dialogRef = useRef<DialogHandle>(null);
    const [isPending, setIsPending] = useState(false);

    const { mutate } = useRemoveAnime();

    const handleConfirm = () => {
        setIsPending(true);
        mutate(anime, {
            onSuccess: () => dialogRef.current?.closeDialog(),
            onSettled: () => setIsPending(false),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => dialogRef.current?.openDialog()}
                title="Remove"
                className="p-1 rounded-md hover:bg-zinc-700 transition-colors"
            >
                <Trash className="w-4 h-4 text-red-500 transition-colors" />
            </button>

            <Dialog ref={dialogRef}>
                <div
                    className="bg-zinc-800 rounded-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-5">
                        {/* Warning Header */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Remove from Watchlist?</h2>
                        </div>

                        {/* Anime Info */}
                        <div className="flex items-center gap-2 mb-5">
                            {anime.image && (
                                <img
                                    src={anime.image}
                                    alt=""
                                    className="w-14 h-20 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="font-medium text-white text-sm line-clamp-2">
                                    {anime.title_english ?? anime.title_romaji}
                                </p>
                                <div className="text-xs text-gray-400 flex flex-wrap gap-2">
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

                        <p className="text-sm text-gray-400 mb-5">
                            This action cannot be undone.
                        </p>

                        {/* Actions */}
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
                                onClick={handleConfirm}
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