import { useAnimeList } from "../hooks/useAnimeList";
import { ShowcaseItem } from "./ShowcaseItem";

interface AnimeListProps {
    title: string;
    queryKey: string;
    sort: string[];
    status?: string;
}

export function ShowcaseStrip({ title, queryKey, sort, status }: AnimeListProps) {
    const { data, isLoading, error } = useAnimeList(queryKey, sort, status, 1, 5);

    if (isLoading) return <div className="text-white">Loading {title}...</div>;
    if (error) return <div className="text-white">Failed to load {title}</div>;

    return (
        <div className="bg-slate-900 p-4">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">{title}</h2>
            <div className="flex flex-col">
                {data?.map((anime) => (
                    <ShowcaseItem key={anime.id} anime={anime} />
                ))}
            </div>
            <a
                href="#"
                className="mt-4 inline-block text-sm text-gray-300 hover:underline transition"
            >
                View more →
            </a>
        </div>
    );
}
