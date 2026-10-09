import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { statusActionClass } from "../../ui/statusActionClass";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingState from "../../ui/LoadingState";
import ProfileBanner from "../../components/ProfileBanner";
import { useGetWatchlist } from "../../hooks/useGetWatchlist";
import WatchlistTile from "./WatchlistTile";
import WatchlistGrid from "./WatchlistGrid";
import WatchlistTable from "./WatchlistTable";
import { RefreshCw, Grid3x3, LayoutList, TableIcon } from "lucide-react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
type ViewMode = 'grid' | 'tile' | 'table';
const VIEW_MODES: ViewMode[] = ['grid', 'tile', 'table'];
const VIEW_MODE_KEY = 'sekai-watchlist-view';

const readViewMode = (): ViewMode => {
    try {
        const saved = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null;
        return saved && VIEW_MODES.includes(saved) ? saved : 'grid';
    } catch {
        return 'grid';
    }
};

export default function Watchlist() {
    const [viewMode, setViewMode] = useState<ViewMode>(readViewMode);

    useEffect(() => {
        try {
            localStorage.setItem(VIEW_MODE_KEY, viewMode);
        } catch {
            // Storage unavailable (private mode) — the choice just won't persist
        }
    }, [viewMode]);

    const {
        isLoading,
        error,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        watchlistItems,
        refresh
    } = useGetWatchlist();

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    useInfiniteScroll(loadMoreRef, fetchNextPage, isFetchingNextPage, hasNextPage);

    // Initial load only — don't replace content with spinner on background refetches
    if (isLoading) {
        return (
            <>
                <ProfileBanner />
                <LoadingState text='Loading your watchlist...' />
            </>
        );
    }

    if (error) {
        return (
            <>
                <ProfileBanner />
                <ErrorState
                    title="Couldn't load your watchlist"
                    message={error.message}
                    onRetry={refresh}
                />
            </>
        );
    }

    if (!watchlistItems || watchlistItems.length === 0) {
        return (
            <>
                <ProfileBanner />
                <EmptyState
                    title="Your watchlist is empty"
                    message="Shows you add will appear here. Find something to watch and hit “Add to Watchlist”."
                    actions={<Link to="/explore" className={statusActionClass.primary}>Explore anime</Link>}
                />
            </>
        );
    }

    return (
        <>
            <ProfileBanner />
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-2 justify-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                        My Watchlist
                    </h2>
                    <span className="grow" />
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={isRefetching || isFetchingNextPage}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh watchlist"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-accent-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Grid view"
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-accent-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Table view"
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('tile')}
                            className={`p-2 rounded transition-colors ${viewMode === 'tile' ? 'bg-accent-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Tile view"
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {watchlistItems.map((anime) => (
                                <WatchlistGrid key={anime.id} anime={anime} />
                            ))}
                        </div>
                    )}
                    {viewMode === 'tile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {watchlistItems.map((anime) => (
                                <WatchlistTile key={anime.id} anime={anime} />
                            ))}
                        </div>
                    )}
                    {viewMode === 'table' && (
                        <WatchlistTable items={watchlistItems} />
                    )}
                    {hasNextPage ? (
                        <div ref={loadMoreRef} className="flex justify-center items-center gap-2 py-8">
                            <span className="text-md text-zinc-300">Loading</span>
                            <span className="w-6 h-6 rounded-full border-4 border-zinc-600 border-t-zinc-300 animate-spin" />
                        </div>
                    ) : (
                        <div ref={loadMoreRef} />
                    )}
                </div>
            </div>
        </>
    );
}