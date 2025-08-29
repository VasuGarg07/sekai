import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { useAnimeList } from '../hooks/useAnimeList';
import AnimeGalleryCard from './AnimeGalleryCard';

export default function CurrentSeasonAnime() {
    const { data, isLoading, error } = useAnimeList('airingAnime', ["SCORE_DESC"], "RELEASING");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64 bg-gray-800">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading current season anime...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-800 border border-red-200 p-6">
                <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-red-800">Error Loading Anime</h3>
                </div>
                <p className="text-red-700 mb-4">{error.message}</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-yellow-800 border border-yellow-200 p-6">
                <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
                    <h3 className="text-lg font-semibold text-yellow-800">No Anime Found</h3>
                </div>
                <p className="text-yellow-700">No anime data available for the current season.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 px-6 py-4">
            <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white">Current Season Anime</h2>
                <span className="text-orange-100 bg-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                    View more →
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
                {data.map((anime) => <AnimeGalleryCard key={anime.id} anime={anime} />)}
            </div>
        </div>
    );
};