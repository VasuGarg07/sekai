import { useState } from "react";
import { Trash } from "lucide-react";
import type { AnimeWatchList } from "../../shared/interfaces";
import { useRemoveAnime } from "../../hooks/useRemoveAnime";

type RemoveAnimeProps = {
    anime: AnimeWatchList;
};

export function RemoveAnime({ anime }: RemoveAnimeProps) {
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useRemoveAnime();

    const handleConfirm = () => {
        mutate(anime, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <>
            {/* Delete button */}
            <button
                onClick={() => setOpen(true)}
                title="Remove from Watchlist"
                className="p-1"
            >
                <Trash className="w-4 h-4 text-red-600 hover:text-red-700 transition-colors" />
            </button>

            {/* Confirmation Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-sm p-6 relative text-white">
                        <h2 className="text-lg font-semibold mb-4">Remove from Watchlist?</h2>

                        <div className="flex items-center gap-4 mb-6">
                            {anime.image && <img
                                src={anime.image}
                                alt={anime.title_english ?? anime.title_romaji ?? ""}
                                className="w-16 h-24 object-cover rounded"
                            />}
                            <p className="font-medium">{anime.title_english ?? anime.title_romaji}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded bg-zinc-600 text-white hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {isPending ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
