import { ShieldAlert } from "lucide-react";
import { useUpdatePreferences } from "../../hooks/useUpdatePreferences";
import { useAppSelector } from "../../store/reduxHooks";
import { SectionLayout } from "./SectionLayout";

export const AdultMode = () => {
    const { update, isPending } = useUpdatePreferences();
    const enabled = useAppSelector((state) => state.preferences.adult_mode);

    const handleToggle = () => {
        if (isPending) return;
        const next = !enabled;
        update({ adult_mode: next }, {
            success: next ? "18+ Mode turned on." : "18+ Mode turned off.",
            error: "Couldn't save 18+ Mode. It has been changed back.",
        });
    };

    return (
        <SectionLayout
            icon={<ShieldAlert size={24} className="text-accent-500" />}
            title="18+ Mode"
            description="Show adult (18+) titles and genres in browse, search and recommendations. Off by default."
        >
            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-700 bg-zinc-800/40 px-4 py-3">
                <div>
                    <p id="adult-mode-label" className="text-sm font-medium text-white">
                        Show adult content
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        You must be 18 or older to turn this on.
                    </p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-labelledby="adult-mode-label"
                    disabled={isPending}
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                        disabled:opacity-60 ${enabled ? "bg-accent-500" : "bg-zinc-600"}`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5.5" : "translate-x-0.5"}`}
                    />
                </button>
            </div>
        </SectionLayout>
    );
};
