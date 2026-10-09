import { Link, useParams, useSearchParams } from "react-router";
import AnimeResults from "../../components/AnimeResults";
import { useAdvancedAnimeSearch } from "../../hooks/useAdvancedAnimeSearch";
import { isAdultGenre } from "../../hooks/useGenres";
import { usePageParam } from "../../hooks/usePageParam";
import { useAdultMode } from "../../hooks/useUpdatePreferences";
import { useAppSelector } from "../../store/reduxHooks";
import StatusState from "../../ui/StatusState";
import { statusActionClass } from "../../ui/statusActionClass";

const SORTS = [
    { key: "POPULARITY_DESC", label: "Popular" },
    { key: "SCORE_DESC", label: "Top Rated" },
    { key: "TRENDING_DESC", label: "Trending" },
    { key: "START_DATE_DESC", label: "Newest" },
];

export default function GenrePage() {
    const { genre = "" } = useParams<{ genre: string }>();
    const adultMode = useAdultMode();
    const isLoggedIn = useAppSelector(state => !!state.auth.user);

    if (isAdultGenre(genre) && !adultMode) {
        return (
            <StatusState
                title="This genre is 18+"
                message={isLoggedIn
                    ? "Turn on 18+ Mode in Settings to browse this genre."
                    : "Log in and turn on 18+ Mode in Settings to browse this genre."}
                actions={
                    <Link to={isLoggedIn ? "/settings" : "/login"} className={statusActionClass.primary}>
                        {isLoggedIn ? "Open Settings" : "Log in"}
                    </Link>
                }
            />
        );
    }

    return <GenreResults genre={genre} />;
}

function GenreResults({ genre }: { genre: string }) {
    const [searchParams] = useSearchParams();
    const [page, setPage] = usePageParam();

    const sortParam = searchParams.get("sort");
    const sort = SORTS.find(s => s.key === sortParam)?.key ?? SORTS[0].key;

    const { data, isLoading, error, refetch } = useAdvancedAnimeSearch({
        genreIn: [genre],
        sort: [sort],
        page,
    });

    return (
        <>
            <div className="px-4 md:px-6 pt-4 md:pt-6">
                {/* Changing sort drops ?page so results start from page 1 */}
                <nav aria-label="Sort" className="max-w-7xl mx-auto flex flex-wrap gap-2">
                    {SORTS.map(s => (
                        <Link
                            key={s.key}
                            to={`?sort=${s.key}`}
                            replace
                            aria-current={s.key === sort ? "true" : undefined}
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${s.key === sort
                                ? "bg-accent-500 text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                }`}
                        >
                            {s.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <AnimeResults
                title={<>{genre} <span className="text-zinc-400 font-medium">Anime</span></>}
                data={data}
                isLoading={isLoading}
                error={error}
                onRetry={() => refetch()}
                onPageChange={setPage}
                emptyMessage={`We couldn't find any ${genre} anime. Check the genre name or try another one.`}
            />
        </>
    );
}
