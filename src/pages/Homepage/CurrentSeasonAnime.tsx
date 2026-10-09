import AnimeGalleryCard from '../../components/AnimeGalleryCard';
import EmptyState from '../../ui/EmptyState';
import ErrorState from '../../ui/ErrorState';
import LoadingState from '../../ui/LoadingState';
import { useAnimeList } from '../../hooks/useAnimeList';
import { Link } from "react-router";

export default function CurrentSeasonAnime() {
    const { data, isLoading, error, refetch } = useAnimeList(["UPDATED_AT_DESC"], "RELEASING");

    if (isLoading) {
        return <LoadingState size="section" text='Loading recently released anime...' />;
    }

    if (error) {
        return (
            <ErrorState
                size="section"
                title="Couldn't load recent releases"
                message={error.message}
                onRetry={() => refetch()}
            />
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <EmptyState
                size="section"
                title="No recent releases"
                message="Nothing new has aired recently. Check back soon!"
            />
        );
    }

    return (
        <div className="bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-2xl font-bold text-white">Recently Released</h2>
                <Link
                    to='/recents'
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