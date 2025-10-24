import { useState } from "react";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingState from "../../ui/LoadingState";
import ProfileBanner from "../../components/ProfileBanner";
import { useGetWatchlist } from "../../hooks/useGetWatchlist";
import ToggleButton from "../../ui/ToggleButton";
import WatchlistTile from "./WatchlistTile";
import WatchlistGrid from "./WatchlistGrid";
import { RefreshCw } from "lucide-react";
import { useAppSelector } from "../../store/reduxHooks";

export default function Watchlist() {
    const { isLoading, error, refetch, isFetching } = useGetWatchlist();
    const { items: watchlistItems } = useAppSelector(state => state.watchlist);
    const [isGrid, setIsGrid] = useState<boolean>(true);

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading || isFetching) {
        return (
            <div className="bg-zinc-900 py-8 px-4">
                <LoadingState text='Loading your watchlist...' />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-zinc-900 py-8 px-4">
                <ErrorState message={error.message} />
            </div>
        )
    }

    if (!watchlistItems || watchlistItems.length === 0) {
        return (
            <div className="bg-zinc-900 py-8 px-4">
                <EmptyState message='Guess you have yet to add shows in your list.' />
            </div>
        )
    }

    return (
        <>
            <ProfileBanner />
            <div className="bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Your Watchlist ({watchlistItems.length})</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isFetching}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh watchlist"
                        >
                            <RefreshCw
                                className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`}
                            />
                        </button>
                        <ToggleButton showTiles={isGrid} setShowTiles={setIsGrid} />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    {isGrid ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {watchlistItems.map((anime) => (
                                <WatchlistGrid key={anime.id} anime={anime} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {watchlistItems.map((anime) => (
                                <WatchlistTile key={anime.id} anime={anime} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}