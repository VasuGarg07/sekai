import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import AnimeGallery from "../../components/AnimeGallery";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingState from "../../ui/LoadingState";
import { useAdvancedAnimeSearch } from "../../hooks/useAdvancedAnimeSearch";
import { usePageParam } from "../../hooks/usePageParam";
import type { Filters } from "../../shared/interfaces";
import Pagination from "../../ui/Pagination";
import ToggleButton from "../../ui/ToggleButton";
import AnimeFilters from "./AnimeFilters";
import { filtersFromParams, filtersToParams } from "./filterParams";

const AdvancedSearch = () => {
    const [showTiles, setShowTiles] = useState<boolean>(false);
    // Applied filters live in the URL (see filterParams.ts): shareable, and Back/Forward restore them
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = usePageParam();
    const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
    const q = filters.search ?? "";

    // Changes whenever the applied filters change (but not the page), to re-sync the filter form
    const filtersKey = filtersToParams(filters, new URLSearchParams()).toString();

    const { data, isLoading, isPlaceholderData, error, refetch } = useAdvancedAnimeSearch({ ...filters, page });

    const handleApply = (next: Filters) => {
        setSearchParams(prev => filtersToParams(next, prev));
    };

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingState text="Searching anime..." />;
    } else if (error) {
        body = <ErrorState title="Search failed" message={error.message} onRetry={() => refetch()} />;
    } else if (!data || data.items.length === 0) {
        body = (
            <EmptyState
                title="No anime found"
                message="Nothing matches these filters. Try removing a few, or search for a different title."
            />
        );
    } else {
        body = (
            <>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {q ? <>Results for <span className="text-accent-400">“{q}”</span></> : "Search Results"}
                    </h2>
                    <ToggleButton showTiles={showTiles} setShowTiles={setShowTiles} />
                </div>

                <div aria-busy={isPlaceholderData} className={`transition-opacity ${isPlaceholderData ? "opacity-50 pointer-events-none" : ""}`}>
                    <AnimeGallery data={data.items} tileView={showTiles} />
                </div>

                <Pagination
                    currentPage={data.pageInfo.currentPage}
                    totalPages={data.pageInfo.lastPage}
                    onPageChange={setPage}
                />
            </>
        );
    }

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
                <AnimeFilters applied={filters} appliedKey={filtersKey} onApply={handleApply} />
            </div>
            <div className="max-w-6xl mx-auto">
                {body}
            </div>
        </div>
    );
};

export default AdvancedSearch;
