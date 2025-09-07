import { useState } from "react";
import { useAnimeList } from "../../hooks/useAnimeList";
import AnimeGalleryCard from "../../components/AnimeGalleryCard";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import Pagination from "../../ui/Pagination";

interface PagedResultsProps {
    title: string;
    queryKey: string;
    sort: string[];
    status?: string;
}

const PagedResults = ({ title, queryKey, sort, status }: PagedResultsProps) => {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAnimeList(queryKey, sort, status, page);


    if (isLoading) {
        return (
            <div className="bg-zinc-950 min-h-80 py-8 px-4 flex justify-center items-center">
                <LoadingState text="Loading anime..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-zinc-950 min-h-80 py-8 px-4 flex justify-center items-center">
                <ErrorState message={error.message} />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-zinc-950 min-h-80 py-8 px-4 flex justify-center items-center">
                <EmptyState message="The title you're looking for is not available." />
            </div>
        )
    }

    return (
        <div className="bg-zinc-950 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
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

export default PagedResults