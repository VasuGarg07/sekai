import { useState } from "react";
import AnimeGallery from "../../components/AnimeGallery";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { useAnimeList } from "../../hooks/useAnimeList";
import Pagination from "../../ui/Pagination";
import ToggleButton from "../../ui/ToggleButton";

interface PagedResultsProps {
    title: string;
    queryKey: string;
    sort: string[];
    status?: string;
}

const PagedResults = ({ title, queryKey, sort, status }: PagedResultsProps) => {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAnimeList(queryKey, sort, status, page);
    const [showTiles, setShowTiles] = useState<boolean>(true);

    if (isLoading) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex justify-center items-center">
                <LoadingState text="Loading anime..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex justify-center items-center">
                <ErrorState message={error.message} />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex justify-center items-center">
                <EmptyState message="The title you're looking for is not available." />
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <ToggleButton showTiles={showTiles} setShowTiles={setShowTiles} />
                </div>

                {/* Anime Gallery */}
                <AnimeGallery data={data.items} tileView={showTiles} />

                {/* Pagination */}
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

export default PagedResults