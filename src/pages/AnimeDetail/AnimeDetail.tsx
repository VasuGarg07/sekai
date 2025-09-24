import { Flame, Heart, Star } from "lucide-react";
import { useParams } from "react-router";
import AnimeGalleryCard from "../../components/AnimeGalleryCard";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { WatchlistButton } from "../../components/WatchlistButton";
import { useAnimeDetail } from "../../hooks/useAnimeDetail";
import Fallback from "/default-banner.jpg";

const AnimeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const animeId = id ? parseInt(id, 10) : NaN;

    const { data, isLoading, error } = useAnimeDetail(animeId);

    if (isNaN(animeId)) {
        return (
            <div className="bg-zinc-900 min-h-80 py-8 px-4 flex justify-center items-center">
                <ErrorState message="Invalid anime ID in URL." />
            </div>
        );
    }

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
            <div className="bg-zinc-900 min-h-full py-8 px-4 flex justify-center items-center">
                <EmptyState message="The title you're looking for is not available." />
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 min-h-screen text-white">
            {/* Hero Section */}
            <div className="relative w-full min-h-[520px]">
                {/* Banner Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={data.bannerImage ?? Fallback}
                        alt="Banner"
                        className="w-full h-full object-cover blur-2xs scale-105"
                    />
                    {/* gradient overlay for sleek look */}
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-zinc-900/70 to-zinc-900/50" />
                </div>

                {/* Foreground Content */}
                <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
                    {/* Left: Cover */}
                    <div className="flex flex-col items-center lg:items-start">
                        {data.coverImage.extraLarge && (
                            <img
                                src={data.coverImage.extraLarge}
                                alt={data.title_romaji ?? "Anime Cover"}
                                className="w-48 md:w-64 rounded-2xl shadow-2xl ring-2 ring-zinc-700"
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
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs font-semibold text-accent-400 border border-accent-500/30">
                                    {data.type}
                                </span>
                            )}
                            {data.status && (
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs text-green-400 border border-green-500/30">
                                    {data.status}
                                </span>
                            )}
                            {data.seasonYear && (
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs text-blue-400 border border-blue-500/30">
                                    {data.season
                                        ? `${data.season} ${data.seasonYear}`
                                        : data.seasonYear}
                                </span>
                            )}
                            {data.episodes && (
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs text-purple-400 border border-purple-500/30">
                                    {data.episodes} EP
                                </span>
                            )}
                            {data.duration && (
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                                    {data.duration}m/ep
                                </span>
                            )}
                            {data.countryOfOrigin && (
                                <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-xs text-pink-400 border border-pink-500/30">
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
                                        className="px-3 py-1 bg-gradient-to-r from-accent-500/20 to-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-200"
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
                            <WatchlistButton
                                anime={data}
                                className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-800
                                cursor-pointer disabled:cursor-default text-white font-semibold 
                                px-6 py-2.5 rounded-lg transition-all duration-200 
                                text-sm sm:text-base"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Section */}
            {data.trailer && (
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-semibold mb-6">Trailer</h2>
                    <div className="flex justify-center aspect-20/9">
                        {data.trailer.site === "youtube" ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${data.trailer.id}`}
                                title="Anime Trailer"
                                className="rounded-xl shadow-lg max-w-4xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <a
                                href={`https://${data.trailer.site}.com/watch?v=${data.trailer.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <img
                                    src={data.trailer.thumbnail}
                                    alt="Trailer Thumbnail"
                                    className="rounded-lg shadow-md group-hover:opacity-80 transition"
                                />
                                <p className="text-center text-sm text-blue-400 mt-2 group-hover:underline">
                                    Watch on {data.trailer.site}
                                </p>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Relations Section */}
            {data.relations.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-semibold mb-6">Relations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.relations.map((rel) => (
                            <div
                                key={rel.node.id}
                                className="bg-zinc-800 rounded-lg p-3 flex items-center gap-4 h-full"
                            >
                                {rel.node.coverImage?.extraLarge && (
                                    <img
                                        src={rel.node.coverImage.extraLarge}
                                        alt={rel.node.title?.romaji ?? ""}
                                        className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                                        loading="lazy"
                                    />
                                )}
                                <div className="flex flex-col justify-center overflow-hidden min-w-0">
                                    <p className="text-sm font-medium text-white line-clamp-2">
                                        {rel.node.title?.english ?? rel.node.title?.romaji}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{rel.relationType}</p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        {rel.node.format} • {rel.node.status}
                                    </p>
                                </div>
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
