import { useParams } from "react-router";
import { Loader2, AlertCircle, Star, Heart, Flame } from "lucide-react";
import { useAnimeDetail } from "../../hooks/useAnimeDetail";
import AnimeGalleryCard from "../../components/AnimeGalleryCard";

const AnimeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const animeId = id ? parseInt(id, 10) : NaN;

    const { data, isLoading, error } = useAnimeDetail(animeId);

    if (isNaN(animeId)) {
        return (
            <div className="p-6 text-center text-red-400">
                Invalid anime ID in URL.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-64 text-red-400">
                <AlertCircle className="w-6 h-6 mr-2" />
                {error.message}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 text-center text-gray-400">Anime not found.</div>
        );
    }

    return (
        <div className="bg-slate-900 min-h-screen text-white">
            {/* Hero Section */}
            <div className="relative w-full min-h-[520px]">
                {/* Banner Background */}
                {data.bannerImage && (
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={data.bannerImage}
                            alt="Banner"
                            className="w-full h-full object-cover blur-xs scale-105"
                        />
                        {/* gradient overlay for sleek look */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-slate-900/50" />
                    </div>
                )}

                {/* Foreground Content */}
                <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
                    {/* Left: Cover */}
                    <div className="flex flex-col items-center lg:items-start">
                        {data.coverImage.extraLarge && (
                            <img
                                src={data.coverImage.extraLarge}
                                alt={data.title_romaji ?? "Anime Cover"}
                                className="w-48 md:w-64 rounded-2xl shadow-2xl ring-2 ring-slate-700"
                            />
                        )}
                    </div>

                    {/* Center: Title + meta */}
                    <div className="flex flex-col justify-start gap-2">
                        {/* Title */}
                        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
                            {data.title_english || data.title_romaji}
                        </h1>
                        {data.title_romaji && data.title_english && (
                            <p className="text-gray-300 italic">{data.title_romaji}</p>
                        )}

                        {/* Meta badges */}
                        <div className="flex flex-wrap items-center gap-3 my-2">
                            {data.type && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs font-semibold text-orange-400 border border-orange-500/30">
                                    {data.type}
                                </span>
                            )}
                            {data.status && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-green-400 border border-green-500/30">
                                    {data.status}
                                </span>
                            )}
                            {data.seasonYear && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-blue-400 border border-blue-500/30">
                                    {data.season
                                        ? `${data.season} ${data.seasonYear}`
                                        : data.seasonYear}
                                </span>
                            )}
                            {data.episodes && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-purple-400 border border-purple-500/30">
                                    {data.episodes} EP
                                </span>
                            )}
                            {data.duration && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                                    {data.duration}m/ep
                                </span>
                            )}
                            {data.countryOfOrigin && (
                                <span className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-pink-400 border border-pink-500/30">
                                    {data.countryOfOrigin}
                                </span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mb-2 text-sm">
                            {data.score && (
                                <span className="flex items-center gap-2 text-yellow-400 font-medium">
                                    <Star className="w-5 h-5" /> {(data.score / 10).toFixed(1)}
                                </span>
                            )}
                            {data.popularity && (
                                <span className="flex items-center gap-2 text-red-400 font-medium">
                                    <Flame className="w-5 h-5" /> {data.popularity.toLocaleString()}
                                </span>
                            )}
                            {data.favourites && (
                                <span className="flex items-center gap-2 text-pink-400 font-medium">
                                    <Heart className="w-5 h-5" /> {data.favourites.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {data.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {data.genres.map((g) => (
                                    <span
                                        key={g}
                                        className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-slate-800 border border-slate-700 rounded-full text-xs text-gray-200"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Synopsis */}
                        {data.synopsis && (
                            <p className="text-gray-200 leading-relaxed max-w-4xl mb-4 text-xs lg:text-sm">
                                {data.synopsis}
                            </p>
                        )}

                        {/* Add to List button */}
                        <div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition">
                                + Add to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Relations Section */}
            {data.relations.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-semibold mb-4">Relations</h2>
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-600">
                        {data.relations.map((rel) => (
                            <div
                                key={rel.node.id}
                                className="bg-slate-800 rounded-lg min-w-[140px] p-3 flex-shrink-0 text-center"
                            >
                                {rel.node.coverImage?.extraLarge && (
                                    <img
                                        src={rel.node.coverImage.extraLarge}
                                        alt={rel.node.title?.romaji ?? ""}
                                        className="w-full h-40 object-cover rounded-md mb-2"
                                    />
                                )}
                                <p className="text-xs font-medium text-white truncate">
                                    {rel.node.title?.english ?? rel.node.title?.romaji}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    {rel.relationType}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            {data.recommendations.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {data.recommendations.map((anime) => (
                            <AnimeGalleryCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimeDetail;
