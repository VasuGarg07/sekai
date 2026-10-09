import AnimeResults from "../../components/AnimeResults";
import { useAnimeList } from "../../hooks/useAnimeList";
import { usePageParam } from "../../hooks/usePageParam";

interface PagedResultsProps {
    title: string;
    sort: string[];
    status?: string;
}

const PagedResults = ({ title, sort, status }: PagedResultsProps) => {
    const [page, setPage] = usePageParam();
    const { data, isLoading, isPlaceholderData, error, refetch } = useAnimeList(sort, status, page);

    return (
        <AnimeResults
            title={title}
            data={data}
            isLoading={isLoading}
            isUpdating={isPlaceholderData}
            error={error}
            onRetry={() => refetch()}
            onPageChange={setPage}
        />
    );
};

export default PagedResults;
