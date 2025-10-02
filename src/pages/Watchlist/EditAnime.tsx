import { useState } from "react";
import { Pencil } from "lucide-react";
import type { AnimeWatchList, WatchStatus } from "../../shared/interfaces";
import { useUpdateAnime } from "../../hooks/useUpdateAnime";
import { formatKey } from "../../shared/utilities";

type EditAnimeProps = {
    anime: AnimeWatchList;
};

const statuses: WatchStatus[] = [
    "watching",
    "on-hold",
    "plan-to-watch",
    "dropped",
    "completed",
];

export function EditAnime({ anime }: EditAnimeProps) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<WatchStatus>("plan-to-watch");

    const { mutate, isPending } = useUpdateAnime();

    const handleSave = () => {
        mutate(
            { anime, watchStatus: status },
            { onSuccess: () => setOpen(false) }
        );
    };

    return (
        <>
            {/* Edit button */}
            <button
                onClick={() => setOpen(true)}
                title="Edit Watch Status"
                className="p-1"
            >
                <Pencil className="w-4 h-4 text-gray-200 hover:text-gray-300 transition-colors" />
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-sm p-6 relative text-white">
                        <h2 className="text-lg font-semibold mb-4">Edit Watch Status</h2>

                        {/* Anime Info */}
                        <div className="flex items-center gap-4 mb-6">
                            {anime.image && (
                                <img
                                    src={anime.image}
                                    alt={anime.title_english ?? anime.title_romaji ?? ""}
                                    className="w-16 h-24 object-cover rounded"
                                />
                            )}
                            <p className="font-medium">
                                {anime.title_english ?? anime.title_romaji}
                            </p>
                        </div>

                        {/* Status Select */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Choose status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as WatchStatus)}
                                className="w-full rounded bg-zinc-700 text-white p-2 text-sm"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {formatKey(status)}
                                    </option>
                                ))}
                            </select>
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
                                onClick={handleSave}
                                disabled={isPending}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
