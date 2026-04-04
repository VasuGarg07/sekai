import { Download, FileText, FileJson, FileCode } from "lucide-react";
import { SectionLayout } from "./SectionLayout";
import { WatchlistExporter } from "../../shared/download";
import { useGetWatchlist } from "../../hooks/useGetWatchlist";

const EXPORT_OPTIONS = [
    { format: "csv", label: "CSV", description: "Comma-separated values", icon: FileText },
    { format: "json", label: "JSON", description: "JSON format", icon: FileJson },
    { format: "xml", label: "XML", description: "XML format", icon: FileCode },
];

export const ExportWatchlist = () => {
    const { data: items = [] } = useGetWatchlist();

    const handleExport = (format: string) => {
        switch (format) {
            case "csv": WatchlistExporter.toCSV(items); break;
            case "json": WatchlistExporter.toJSON(items); break;
            case "xml": WatchlistExporter.toXML(items); break;
            default: console.error(`Unknown format: ${format}`);
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
                    return (
                        <button
                            key={option.format}
                            onClick={() => handleExport(option.format)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md border
                                hover:bg-zinc-800/50 transition-colors group border-zinc-700 hover:border-zinc-500"
                        >
                            <IconComponent size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-accent-500 group-hover:text-accent-400 transition-colors">
                                    {option.label}
                                </span>
                                <span className="text-sm text-zinc-500 ml-2">
                                    {option.description}
                                </span>
                            </div>
                            <Download size={16} className="text-zinc-600 group-hover:text-accent-500 transition-colors" />
                        </button>
                    );
                })}
            </div>
        </SectionLayout>
    );
};