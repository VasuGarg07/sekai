import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";
import { WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatDateEpoch, formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";

interface WatchlistTableProps {
    items: AnimeWatchList[];
}

type SortKey = keyof AnimeWatchList | null;
type SortDirection = "asc" | "desc";

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export default function WatchlistTable({ items }: WatchlistTableProps) {
    const { goToAnime } = useAnimeNavigation();
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

    const handleSort = (key: SortKey) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortedItems = [...items].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        // Handle arrays (genres)
        if (Array.isArray(aVal) && Array.isArray(bVal)) {
            const aStr = aVal.join(",");
            const bStr = bVal.join(",");
            return sortConfig.direction === "asc"
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        }

        // Handle strings
        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortConfig.direction === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        // Handle numbers
        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
    });

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="w-3 h-3 opacity-50" />;
        }
        return sortConfig.direction === "asc"
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />;
    };

    const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
        <th
            className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap cursor-pointer hover:bg-zinc-700 transition-colors select-none"
            onClick={() => handleSort(sortKey)}
        >
            <div className="flex items-center justify-between gap-1">
                {label}
                <SortIcon columnKey={sortKey} />
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-zinc-800">
                <thead className="text-xs uppercase bg-zinc-800 text-gray-400 sticky top-0">
                    <tr>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Image</th>
                        <SortableHeader label="Title" sortKey="title_english" />
                        <SortableHeader label="Type" sortKey="type" />
                        <SortableHeader label="Episodes" sortKey="episodes" />
                        <SortableHeader label="Duration" sortKey="duration" />
                        <SortableHeader label="Score" sortKey="score" />
                        <SortableHeader label="Status" sortKey="status" />
                        <SortableHeader label="Watch Status" sortKey="watchStatus" />
                        <SortableHeader label="Season" sortKey="season" />
                        <SortableHeader label="Year" sortKey="seasonYear" />
                        <SortableHeader label="Genres" sortKey="genres" />
                        <SortableHeader label="Start Date" sortKey="startDateText" />
                        <SortableHeader label="Added" sortKey="addedAt" />
                        <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {sortedItems.map((anime) => (
                        <tr
                            key={anime.id}
                            className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors"
                        >
                            {/* Image */}
                            <td className="px-3 py-1.5 border-r border-zinc-800">
                                {anime.image ? (
                                    <img
                                        src={anime.image}
                                        alt={anime.title_english || anime.title_romaji || ''}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-gray-500">
                                        ?
                                    </div>
                                )}
                            </td>

                            {/* Title */}
                            <td className="px-3 py-1.5 text-white font-medium border-r border-zinc-800" onClick={() => goToAnime(anime.id)}>
                                <div title={anime.title_english || anime.title_romaji || 'Unknown'}
                                    className="max-w-sm truncate cursor-pointer hover:text-blue-400 hover:underline hover:underline-offset-2">
                                    {anime.title_english || anime.title_romaji || 'Unknown'}
                                </div>
                            </td>

                            {/* Type */}
                            <td className="px-3 py-1.5 text-gray-400 border-r border-zinc-800 whitespace-nowrap">
                                {anime.type || '-'}
                            </td>

                            {/* Episodes */}
                            <td className="px-3 py-1.5 text-gray-400 text-center border-r border-zinc-800 whitespace-nowrap">
                                {anime.episodes || '-'}
                            </td>

                            {/* Duration */}
                            <td className="px-3 py-1.5 text-gray-400 text-center border-r border-zinc-800 whitespace-nowrap">
                                {anime.duration ? `${anime.duration}m` : '-'}
                            </td>

                            {/* Score */}
                            <td className="px-3 py-1.5 border-r border-zinc-800 whitespace-nowrap text-center">
                                {anime.score ? (
                                    <span className="text-yellow-400 font-medium">
                                        {anime.score}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )}
                            </td>

                            {/* Status (Airing/Finished) */}
                            <td className="px-3 py-1.5 text-gray-400 border-r border-zinc-800 whitespace-nowrap">
                                {anime.status || '-'}
                            </td>

                            {/* Watch Status */}
                            <td className="px-3 py-1.5 border-r border-zinc-800 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${WatchStatusColor[anime.watchStatus]}`}>
                                    {formatKey(anime.watchStatus)}
                                </span>
                            </td>

                            {/* Season */}
                            <td className="px-3 py-1.5 text-gray-400 border-r border-zinc-800 whitespace-nowrap">
                                {anime.season || '-'}
                            </td>

                            {/* Year */}
                            <td className="px-3 py-1.5 text-gray-400 border-r border-zinc-800 whitespace-nowrap">
                                {anime.seasonYear || '-'}
                            </td>

                            {/* Genres */}
                            <td className="px-3 py-1.5 text-gray-400 border-r border-zinc-800 whitespace-nowrap">
                                <div className="flex gap-1">
                                    {anime.genres && anime.genres.length > 0 ? (
                                        <>
                                            {anime.genres.slice(0, 3).map((genre, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                            {anime.genres.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{anime.genres.length - 3}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>
                            </td>

                            {/* Start Date */}
                            <td className="px-3 py-1.5 text-gray-400 text-xs border-r border-zinc-800 whitespace-nowrap">
                                {anime.startDateText || '-'}
                            </td>

                            {/* Added At */}
                            <td className="px-3 py-1.5 text-gray-400 text-xs border-r border-zinc-800 whitespace-nowrap">
                                {formatDateEpoch(anime.addedAt)}
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-1.5 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <EditAnime anime={anime} />
                                    <RemoveAnime anime={anime} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}