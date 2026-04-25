import { useRef, useState } from "react";
import { Pencil, ArrowRight, X, Check, Star } from "lucide-react";
import type { AnimeWatchList, WatchStatus } from "../../shared/interfaces";
import { useUpdateAnime } from "../../hooks/useUpdateAnime";
import { formatKey } from "../../shared/utilities";
import { WatchStatusColor } from "../../shared/constants";
import { Modal, type ModalHandle } from "../../ui/Modal";

type EditAnimeProps = {
    anime: AnimeWatchList;
};

const statuses: WatchStatus[] = [
    "watching",
    "completed",
    "on-hold",
    "plan-to-watch",
    "dropped",
    "rewatch",
];

export function EditAnime({ anime }: EditAnimeProps) {
    const [status, setStatus] = useState<WatchStatus>(anime.watchStatus);
    const [isPending, setIsPending] = useState(false);
    const modalRef = useRef<ModalHandle>(null);

    const { mutate } = useUpdateAnime();

    const handleOpen = () => {
        setStatus(anime.watchStatus);
        modalRef.current?.open();
    };

    const handleSave = () => {
        setIsPending(true);
        mutate(
            { anime, watchStatus: status },
            {
                onSuccess: () => modalRef.current?.close(),
                onSettled: () => setIsPending(false),
            }
        );
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                title="Edit"
                className="p-1 rounded-md hover:bg-zinc-700 transition-colors"
            >
                <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>

            <Modal ref={modalRef}>
                <div
                    className="bg-zinc-800 rounded-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-5">
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-5">
                            {anime.image && (
                                <img
                                    src={anime.image}
                                    alt=""
                                    className="w-10 h-14 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="font-medium text-white text-sm flex-1 line-clamp-2">
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

                        {/* Current -> New */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1.5">Current</label>
                                <div className={`px-3 py-2 rounded-lg text-sm border ${WatchStatusColor[anime.watchStatus]}`}>
                                    {formatKey(anime.watchStatus)}
                                </div>
                            </div>

                            <ArrowRight className="w-5 h-5 text-gray-500 mt-5" />

                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1.5">New</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as WatchStatus)}
                                    className="w-full rounded-lg bg-zinc-700 text-white px-3 py-2 text-sm border border-zinc-600 focus:outline-none focus:border-blue-500"
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {formatKey(s)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => modalRef.current?.close()}
                                disabled={isPending}
                                className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 text-white text-sm hover:bg-zinc-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isPending || status === anime.watchStatus}
                                className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                <Check className="w-4 h-4" />
                                {isPending ? "Saving..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}