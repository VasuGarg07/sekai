import { useState, type ReactNode } from "react";
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

const AdvancedSearch = () => {
    const [showTiles, setShowTiles] = useState<boolean>(false);
    // Applied filters, except the search text which lives in the URL (?q=)
    const [filters, setFilters] = useState<Filters>({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = usePageParam();
    const q = searchParams.get("q")?.trim() || "";

    const { data, isLoading, error, refetch } = useAdvancedAnimeSearch({
        ...filters,
        search: q || undefined,
        page,
    });

    const handleApply = ({ search, ...rest }: Filters) => {
        setFilters(rest);
        // New filters always start from page 1; search text goes to the URL so it can be shared
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            const text = search?.trim();
            if (text) params.set("q", text);
            else params.delete("q");
            params.delete("page");
            return params;
        });
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

                <AnimeGallery data={data.items} tileView={showTiles} />

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
                <AnimeFilters search={q} onApply={handleApply} />
            </div>
            <div className="max-w-6xl mx-auto">
                {body}
            </div>
        </div>
    );
};

export default AdvancedSearch;
