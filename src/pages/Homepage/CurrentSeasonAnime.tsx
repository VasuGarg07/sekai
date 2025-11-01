import AnimeGalleryCard from '../../components/AnimeGalleryCard';
import EmptyState from '../../ui/EmptyState';
import ErrorState from '../../ui/ErrorState';
import LoadingState from '../../ui/LoadingState';
import { useAnimeList } from '../../hooks/useAnimeList';
import { Link } from "react-router";

export default function CurrentSeasonAnime() {
    const { data, isLoading, error } = useAnimeList('airingAnime', ["UPDATED_AT_DESC"], "RELEASING");

    if (isLoading) {
        return (
            <div className="bg-zinc-900 py-8 px-4">
                <LoadingState text='Loading current season anime...' />
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

    if (!data || data.items.length === 0) {
        return (
            <div className="bg-zinc-900 py-8 px-4">
                <EmptyState message='No anime data available for the current season' />
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-2xl font-bold text-white">Recently Released</h2>
                <Link
                    to='recents'
                    className="text-accent-100 bg-zinc-600 px-2 py-1 rounded-md text-xs font-medium">
                    View more →
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4">
                {data.items.map((anime) => <AnimeGalleryCard key={anime.id} anime={anime} />)}
            </div>
        </div>
    );
};