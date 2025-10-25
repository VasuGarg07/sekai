import { useAnimeNavigation } from "../../hooks/useAnimeNavigation";
import { WatchStatusColor } from "../../shared/constants";
import type { AnimeWatchList } from "../../shared/interfaces";
import { formatDateEpoch, formatKey } from "../../shared/utilities";
import { EditAnime } from "./EditAnime";
import { RemoveAnime } from "./RemoveAnime";

interface WatchlistTableProps {
    items: AnimeWatchList[];
}

export default function WatchlistTable({ items }: WatchlistTableProps) {
    const { goToAnime } = useAnimeNavigation();

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-zinc-800">
                <thead className="text-xs uppercase bg-zinc-800 text-gray-400 sticky top-0">
                    <tr>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Image</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Title</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Type</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Episodes</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Duration</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Score</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Status</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Watch Status</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Season</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Year</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Genres</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Start Date</th>
                        <th className="px-3 py-2 border-r border-zinc-700 whitespace-nowrap">Added</th>
                        <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {items.map((anime) => (
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

                            {/* Season */}
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