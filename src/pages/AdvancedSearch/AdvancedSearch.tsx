import { useState } from "react";
import AnimeFilters from "./AnimeFilters";
import type { Filters } from "../../shared/interfaces";
import { useAdvancedAnimeSearch } from "../../hooks/useAdvancedAnimeSearch";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import AnimeGalleryCard from "../../components/AnimeGalleryCard";
import Pagination from "../../ui/Pagination";

const AdvancedSearch = () => {
    const [filters, setFilters] = useState<Filters>({});
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useAdvancedAnimeSearch("advanced", {
        ...filters,
        page,
        perPage: 30,
    });

    let content;

    if (isLoading) {
        content = <LoadingState text="Loading anime..." />;
    } else if (error) {
        content = <ErrorState message={error.message} />;
    } else if (!data || data.items.length === 0) {
        content = <EmptyState message="Try adjusting your filters and search again." />;
    } else {
        content = (
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
        );
    }

    return (
        <div className="bg-slate-900 min-h-screen py-8 px-4">
            {/* Filters */}
            <div className="max-w-6xl mx-auto mb-8">
                <AnimeFilters onApply={setFilters} />
            </div>

            {/* Content (one block) */}
            {content}
        </div>
    );

}

export default AdvancedSearch;