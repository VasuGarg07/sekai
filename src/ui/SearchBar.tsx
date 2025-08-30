import { useState, useDeferredValue, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import { useAnimeSearch } from "../hooks/useAnimeSearch";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";

type Props = { className?: string };

const SearchBar = ({ className = "" }: Props) => {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const q = useMemo(() => deferredQuery.trim(), [deferredQuery]);

    const shouldFetch = q.length >= 3;
    const { data: results = [], isLoading } = useAnimeSearch(q, shouldFetch);
    const { goToAnime } = useAnimeNavigation();

    const navigate = useNavigate();

    const handleResultClick = (anilistId: number) => {
        goToAnime(anilistId)
        setQuery("");
    };

    const handleFilterClick = () => {
        setQuery("");
        navigate("/explore");
    }
    const handleViewAllResults = () => navigate(`/search?q=${encodeURIComponent(q)}`);

    return (
        <div className={`relative max-w-xl ${className}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="block w-full pl-8 pr-10 sm:pr-20 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
                    autoComplete="off"
                    aria-label="Search anime"
                />

                <button
                    type="button"
                    onClick={handleFilterClick}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <Filter size={16} />
                    <span className="text-xs font-medium hidden sm:inline">FILTER</span>
                </button>
            </div>

            {query.length > 0 && query.length < 3 && (
                <div className="absolute left-0 right-0 mt-1 p-4 text-center text-slate-400 bg-slate-800 rounded-lg border border-slate-700 z-50">
                    Type at least 3 characters to search
                </div>
            )}

            {shouldFetch && (
                <div className="absolute left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-slate-400">Searching...</div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((anime) => (
                                <div
                                    key={anime.id}
                                    onClick={() => handleResultClick(anime.id)}
                                    className="flex items-start space-x-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0"
                                >
                                    <img
                                        src={anime.image ?? ""}
                                        alt={anime.title_english ?? anime.title_romaji ?? "Poster"}
                                        className="w-14 h-20 object-cover rounded bg-slate-700"
                                        loading="lazy"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white truncate">
                                            {anime.title_english ?? anime.title_romaji ?? "Untitled"}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                                            {anime.synopsis || "No synopsis available"}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                                            <span className="bg-emerald-600 text-white rounded px-2 py-0.5 font-medium">
                                                ★ {anime.rating != null ? (anime.rating / 10).toFixed(1) : "--"}
                                            </span>
                                            •
                                            {anime.type && (
                                                <span className="bg-amber-600 text-white rounded px-2 py-0.5 font-medium uppercase">
                                                    {anime.type}
                                                </span>
                                            )}
                                            •
                                            <span className="bg-red-600 text-white rounded px-2 py-0.5 font-medium">
                                                {anime.year ?? "N/A"}
                                            </span>
                                            {anime.duration && (
                                                <>
                                                    •
                                                    <span className="bg-purple-600 text-white rounded px-2 py-0.5 font-medium">
                                                        {anime.duration >= 60
                                                            ? `${Math.floor(anime.duration / 60)}h ${anime.duration % 60}m`
                                                            : `${anime.duration}m`}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="p-3 text-center border-t border-slate-600">
                                <button
                                    type="button"
                                    onClick={handleViewAllResults}
                                    className="text-sm text-blue-400 hover:underline hover:cursor-pointer"
                                >
                                    View all results →
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center text-slate-400">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
