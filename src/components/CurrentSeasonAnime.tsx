import { AlertCircle, Calendar, Loader2, Star } from 'lucide-react';
import React from 'react';
import { useAnimeList } from '../hooks/useAnimeList';

const CurrentSeasonAnime: React.FC = () => {
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Current Season Anime</h2>
                <span className="text-orange-100 bg-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                    View more →
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.map((anime) => (
                    <div key={anime.id} className="bg-slate-800 rounded-sm overflow-hidden hover:shadow-lg">
                        {anime.image && (
                            <div className="aspect-[3/4]">
                                <img
                                    src={anime.image}
                                    alt={anime.title_english ?? ''}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="p-2">
                            <h3 className="font-semibold text-white my-2 line-clamp-2 text-sm leading-tight">
                                {anime.title_english ?? anime.title_romaji}
                            </h3>

                            <div className="text-xs text-gray-300 flex flex-wrap gap-2">
                                {anime.score && (
                                    <>
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                            <span className="font-medium">{anime.score}</span>
                                        </div>
                                        <span>•</span>
                                    </>
                                )}
                                {anime.type && (
                                    <>
                                        <div className="font-medium">{anime.type}</div>
                                        <span>•</span>
                                    </>
                                )}
                                {anime.status && (
                                    <div className="font-medium">{anime.status}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentSeasonAnime;