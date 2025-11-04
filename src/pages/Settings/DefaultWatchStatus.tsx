import { Eye } from "lucide-react";
import { useDefaultWatchStatus } from "../../hooks/useDefaultWatchStatus";
import { useAppSelector } from "../../store/reduxHooks";
import type { WatchStatus } from "../../shared/interfaces";
import { SectionLayout } from "./SectionLayout";

const WATCH_STATUS_OPTIONS: { value: WatchStatus; label: string }[] = [
    { value: "watching", label: "Watching" },
    { value: "on-hold", label: "On Hold" },
    { value: "plan-to-watch", label: "Plan to Watch" },
    { value: "dropped", label: "Dropped" },
    { value: "completed", label: "Completed" },
    { value: "rewatch", label: "Rewatch" },
];

export const DefaultWatchStatus = () => {
    const { mutate: setStatus, isPending } = useDefaultWatchStatus();
    const currentStatus = useAppSelector(
        (state) => state.preferences.default_watch_status
    );

    const handleChange = (newStatus: WatchStatus) => {
        if (!isPending) setStatus(newStatus);
    };

    return (
        <SectionLayout
            icon={<Eye size={24} className="text-accent-500" />}
            title="Default Watch Status"
            description="Choose the default status for new items you add to your watchlist."
        >
            <div className="flex flex-wrap gap-2 mt-2">
                {WATCH_STATUS_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        disabled={isPending}
                        onClick={() => handleChange(option.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md border transition-all
              ${currentStatus === option.value
                                ? "bg-accent-500 text-white border-transparent"
                                : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </SectionLayout>
    );
};
