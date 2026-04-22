import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import AnimeGallery from "../../components/AnimeGallery";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingState from "../../ui/LoadingState";
import { useAdvancedAnimeSearch } from "../../hooks/useAdvancedAnimeSearch";
import type { Filters } from "../../shared/interfaces";
import Pagination from "../../ui/Pagination";
import ToggleButton from "../../ui/ToggleButton";
import AnimeFilters from "./AnimeFilters";

const AdvancedSearch = () => {
    const [showTiles, setShowTiles] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({});
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q")?.trim() || "";

    useEffect(() => setPage(1), [q]);

    const effectiveFilters: Filters = q ? { ...filters, search: q } : { ...filters };
    const { data, isLoading, error } = useAdvancedAnimeSearch("advanced", { ...effectiveFilters, page });

    if (isLoading) {
        return (
            <div className="bg-zinc-900 min-h-screen py-8 px-4 flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-4 sm:mb-6 w-full">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <LoadingState text="Loading anime..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-4 sm:mb-6 w-full">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <ErrorState message={error.message} />
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-8 w-full">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <EmptyState message="Try adjusting your filters and search again." />
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
                <AnimeFilters onApply={setFilters} setPage={setPage} />
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Search Results</h2>
                    <ToggleButton showTiles={showTiles} setShowTiles={setShowTiles} />
                </div>

                <AnimeGallery data={data.items} tileView={showTiles} />

                {data.pageInfo.lastPage > 1 && (
                    <Pagination
                        currentPage={data.pageInfo.currentPage}
                        totalPages={data.pageInfo.lastPage}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default AdvancedSearch;