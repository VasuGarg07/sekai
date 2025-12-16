import { ALargeSmall, Bookmark, ChevronDown, ChevronUp, RefreshCw, Snowflake, Tv, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { formatKey } from "../../shared/utilities";
import type { AnalyticsData } from "../../shared/interfaces";

interface WatchlistAnalyticsProps {
    analytics: AnalyticsData;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

const StatCard = ({ icon: Icon, title, data }: { icon: LucideIcon; title: string; data: Record<string, number> }) => {
    const entries = Object.entries(data);

    return (
        <div className="ml-4">
            <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-4 h-4 text-white" />
                <h4 className="text-sm font-semibold text-gray-300">{title.toLocaleUpperCase()}</h4>
            </div>
            <div className="flex items-center gap-4">
                {entries.map(([key, count]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-600 flex-shrink-0" />
                        <span className="text-gray-400 text-xs">{formatKey(key)} (<span className="text-gray-300">{count}</span>)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function WatchlistAnalytics({ analytics, onRefresh, isRefreshing }: WatchlistAnalyticsProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh list</span>
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <span>{isOpen ? "Hide" : "Show"} statistics</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {isOpen && (
                <div className="space-y-4 mt-4">
                    <StatCard icon={Bookmark} title="Watch Status" data={analytics.byWatchStatus} />
                    <StatCard icon={ALargeSmall} title="Airing Status" data={analytics.byStatus} />
                    <StatCard icon={Snowflake} title="Season" data={analytics.bySeason} />
                    <StatCard icon={Tv} title="Type" data={analytics.byType} />
                </div>
            )}
        </div>
    );
}