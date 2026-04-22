import { useState, useDeferredValue, useMemo, useRef, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import { useAnimeSearch } from "../hooks/useAnimeSearch";
import { useAnimeNavigation } from "../hooks/useAnimeNavigation";
import QuickSearchItem from "./QuickSearchItem";

type Props = { className?: string };

const SearchBar = ({ className = "" }: Props) => {
    const { goToAnime } = useAnimeNavigation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const q = useMemo(() => deferredQuery.trim(), [deferredQuery]);

    // Ref on the OUTER wrapper so clicks on both the input and dropdown
    // are correctly detected as "inside" — fixing the bug where clicking
    // the input was treated as outside and cleared the query
    const widgetRef = useRef<HTMLDivElement | null>(null);

    const shouldFetch = q.length >= 3;
    const { data: results = [], isLoading } = useAnimeSearch(q, shouldFetch);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
                setQuery("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (anilistId: number) => {
        goToAnime(anilistId);
        setQuery("");
    };

    const handleFilterClick = () => {
        setQuery("");
        navigate("/explore");
    };

    const handleViewAllResults = () => {
        navigate(`/search?q=${encodeURIComponent(q)}`);
        setQuery("");
    };

    return (
        // widgetRef on outer wrapper — covers both input and dropdown
        <div ref={widgetRef} className={`relative max-w-xl ${className}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-400" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="block w-full pl-8 pr-10 sm:pr-20 py-2 text-xs bg-zinc-800 border border-transparent rounded-lg text-white placeholder-zinc-400 focus:outline-none"
                    autoComplete="off"
                    aria-label="Search anime"
                />

                <button
                    type="button"
                    onClick={handleFilterClick}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1 text-accent-400 hover:text-white transition-colors"
                >
                    <Filter size={16} />
                    <span className="text-xs font-medium hidden sm:inline">FILTER</span>
                </button>
            </div>

            <div className="absolute left-0 right-0">
                {query.length > 0 && query.length < 3 && (
                    <div className="mt-1 p-4 text-center text-zinc-400 bg-zinc-800 rounded-lg border border-zinc-700 z-50">
                        Type at least 3 characters to search
                    </div>
                )}

                {shouldFetch && (
                    <div className="mt-1 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-96 overflow-y-auto z-50">
                        {isLoading ? (
                            <div className="p-4 text-center text-zinc-400">Searching...</div>
                        ) : results.length > 0 ? (
                            <>
                                {results.map((anime) => (
                                    <QuickSearchItem
                                        key={anime.id}
                                        anime={anime}
                                        handleClick={handleResultClick}
                                    />
                                ))}
                                <div className="p-3 text-center border-t border-zinc-600">
                                    <button
                                        type="button"
                                        onClick={handleViewAllResults}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        View all results →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 text-center text-zinc-400">No results found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;