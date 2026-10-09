import { useState } from "react";
import { Download, FileText, FileJson, FileCode, Loader2 } from "lucide-react";
import { SectionLayout } from "./SectionLayout";
import { WatchlistExporter } from "../../shared/download";
import { fetchEntireWatchList } from "../../shared/firestore";
import { hydrateWatchlist } from "../../shared/watchlistHydration";
import { useAppSelector } from "../../store/reduxHooks";
import { toastService } from "../../ui/toastService";

type ExportFormat = "csv" | "json" | "xml";

const EXPORT_OPTIONS: { format: ExportFormat; label: string; description: string; icon: typeof FileText }[] = [
    { format: "csv", label: "CSV", description: "Comma-separated values", icon: FileText },
    { format: "json", label: "JSON", description: "JSON format", icon: FileJson },
    { format: "xml", label: "XML", description: "XML format", icon: FileCode },
];

const EXPORTERS: Record<ExportFormat, (items: Parameters<typeof WatchlistExporter.toCSV>[0]) => void> = {
    csv: WatchlistExporter.toCSV,
    json: WatchlistExporter.toJSON,
    xml: WatchlistExporter.toXML,
};

export const ExportWatchlist = () => {
    const uid = useAppSelector(state => state.auth.user?.uid);
    const [exporting, setExporting] = useState<ExportFormat | null>(null);

    const handleExport = async (format: ExportFormat) => {
        if (!uid || exporting) return;
        setExporting(format);
        try {
            // Fetch everything — the watchlist page only has the first few pages loaded
            const entries = await fetchEntireWatchList(uid);
            if (entries.length === 0) {
                toastService.warning("Your watchlist is empty — nothing to export.");
                return;
            }
            // Firestore only stores ids/status; titles, scores etc. come fresh from AniList
            const { items, refreshFailed } = await hydrateWatchlist(entries);
            if (refreshFailed) {
                toastService.warning("Couldn't reach AniList, so some details in the export may be missing.");
            }
            EXPORTERS[format](items);
            toastService.success(`Exported ${items.length} ${items.length === 1 ? "title" : "titles"} as ${format.toUpperCase()}.`);
        } catch (error) {
            console.error("Watchlist export failed:", error);
            toastService.error("Couldn't export your watchlist. Please try again.");
        } finally {
            setExporting(null);
        }
    };

    return (
        <SectionLayout
            icon={<Download size={24} className="text-accent-500" />}
            title="Export Watchlist"
            description="Download your watchlist data in your preferred format."
        >
            <div className="space-y-3">
                {EXPORT_OPTIONS.map((option) => {
                    const IconComponent = option.icon;
                    const isBusy = exporting === option.format;
                    return (
                        <button
                            key={option.format}
                            type="button"
                            onClick={() => handleExport(option.format)}
                            disabled={exporting !== null}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md border
                                hover:bg-zinc-800/50 transition-colors group border-zinc-700 hover:border-zinc-500
                                disabled:opacity-60 disabled:cursor-wait"
                        >
                            <IconComponent size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-accent-500 group-hover:text-accent-400 transition-colors">
                                    {option.label}
                                </span>
                                <span className="text-sm text-zinc-500 ml-2">
                                    {isBusy ? "Preparing download..." : option.description}
                                </span>
                            </div>
                            {isBusy
                                ? <Loader2 size={16} className="text-accent-500 animate-spin" />
                                : <Download size={16} className="text-zinc-600 group-hover:text-accent-500 transition-colors" />}
                        </button>
                    );
                })}
            </div>
        </SectionLayout>
    );
};
