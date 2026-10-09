import { useState, type ReactNode } from "react";
import type { PagedResult } from "../shared/interfaces";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";
import ToggleButton from "../ui/ToggleButton";
import AnimeGallery from "./AnimeGallery";

interface AnimeResultsProps {
    title: ReactNode;
    data: PagedResult | undefined;
    isLoading: boolean;
    error: Error | null;
    onRetry: () => void;
    onPageChange: (page: number) => void;
    emptyMessage?: string;
}

/** Title + grid/tile toggle + results + pagination, with loading/error/empty states. */
export default function AnimeResults({
    title,
    data,
    isLoading,
    error,
    onRetry,
    onPageChange,
    emptyMessage = "Nothing matches here right now. Try another list or come back later.",
}: AnimeResultsProps) {
    const [showTiles, setShowTiles] = useState(false);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingState text="Loading anime..." />;
    } else if (error) {
        body = <ErrorState title="Couldn't load anime" message={error.message} onRetry={onRetry} />;
    } else if (!data || data.items.length === 0) {
        body = <EmptyState title="No anime found" message={emptyMessage} />;
    } else {
        body = (
            <>
                <AnimeGallery data={data.items} tileView={showTiles} />
                <Pagination
                    currentPage={data.pageInfo.currentPage}
                    totalPages={data.pageInfo.lastPage}
                    onPageChange={onPageChange}
                />
            </>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
                    {data && data.items.length > 0 && !isLoading && !error && (
                        <ToggleButton showTiles={showTiles} setShowTiles={setShowTiles} />
                    )}
                </div>
                {body}
            </div>
        </div>
    );
}
