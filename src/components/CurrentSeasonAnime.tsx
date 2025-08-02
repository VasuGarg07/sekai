import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Calendar, Star } from 'lucide-react';
import { useAnimeList } from '../hooks/useAnimeList';

const CurrentSeasonAnime: React.FC = () => {
    const { isLoading, response, errorMessage, retry } = useAnimeList({
        path: '/seasons/now'
    });

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

    if (errorMessage) {
        return (
            <div className="bg-red-800 border border-red-200 p-6">
                <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-red-800">Error Loading Anime</h3>
                </div>
                <p className="text-red-700 mb-4">{errorMessage}</p>
                <button
                    onClick={retry}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    if (!response?.data || response.data.length === 0) {
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
        <div className="space-y-6">
            <div className="bg-gray-900 border-gray-400 p-6">
                <div className="flex items-center mb-6">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Current Season Anime</h2>
                    <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {response.data.length} series
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {response.data.map((anime) => (
                        <div key={anime.mal_id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                            {anime.images?.jpg?.large_image_url && (
                                <div className="aspect-[3/4] bg-gray-100">
                                    <img
                                        src={anime.images.jpg.image_url}
                                        alt={anime.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                                    {anime.title}
                                </h3>

                                <div className="space-y-2 text-xs text-gray-600">
                                    {anime.score && (
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                            <span className="font-medium">{anime.score}</span>
                                        </div>
                                    )}

                                    {anime.type && (
                                        <div className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                            {anime.type}
                                        </div>
                                    )}

                                    {anime.status && (
                                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ml-2 ${anime.status === 'Currently Airing'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {anime.status}
                                        </div>
                                    )}
                                </div>

                                {anime.synopsis && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                        {anime.synopsis}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrentSeasonAnime;