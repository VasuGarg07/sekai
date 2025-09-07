import { useEffect, useState } from "react";
import AnimeFilters from "./AnimeFilters";
import type { Filters } from "../../shared/interfaces";
import { useAdvancedAnimeSearch } from "../../hooks/useAdvancedAnimeSearch";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import AnimeGalleryCard from "../../components/AnimeGalleryCard";
import Pagination from "../../ui/Pagination";
import { useSearchParams } from "react-router";

const AdvancedSearch = () => {
    const [filters, setFilters] = useState<Filters>({});
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();

    const q = searchParams.get("q")?.trim() || "";
    useEffect(() => setPage(1), [q]);

    const effectiveFilters: Filters = q ? { ...filters, search: q } : { ...filters };

    const { data, isLoading, error } = useAdvancedAnimeSearch("advanced", {
        ...effectiveFilters,
        page,
        perPage: 30,
    });

    if (isLoading) {
        return (
            <div className="bg-zinc-950 min-h-screen py-8 px-4 flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-8">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <LoadingState text="Loading anime..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-zinc-950 min-h-80 py-8 px-4 flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-8">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <ErrorState message={error.message} />
            </div>
        )
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="bg-zinc-950 min-h-80 py-8 px-4 flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto mb-8">
                    <AnimeFilters onApply={setFilters} setPage={setPage} />
                </div>
                <EmptyState message="Try adjusting your filters and search again." />
            </div>
        )
    }

    return (
        <div className="bg-zinc-950 min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto mb-8">
                <AnimeFilters onApply={setFilters} setPage={setPage} />
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Search Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {data.items.map((anime) => (
                        <AnimeGalleryCard key={anime.id} anime={anime} />
                    ))}
                </div>
                {data && data.pageInfo.lastPage > 1 && (
                    <Pagination
                        currentPage={data.pageInfo.currentPage}
                        totalPages={data.pageInfo.lastPage}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );

}

export default AdvancedSearch;