import { useState, type Dispatch, type SetStateAction } from "react";
import {
  FORMATS,
  STATUSES,
  SEASONS,
  COUNTRIES,
  SORT_OPTIONS,
} from "../../shared/constants";
import { useGenres } from "../../hooks/useGenres";
import type { Filters } from "../../shared/interfaces";

import {
  Search as SearchIcon,
  ListFilter,
  Activity,
  Tags,
  Calendar,
  Clock,
  Globe,
  ArrowUpDown,
  Info,
} from "lucide-react";
import Tooltip from "../../ui/Tooltip";

interface AnimeFiltersProps {
  onApply: (filters: Filters) => void;
  setPage: Dispatch<SetStateAction<number>>
}

export default function AnimeFilters({ onApply, setPage }: AnimeFiltersProps) {
  const { data: genres = [] } = useGenres();
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState<Filters>({ sort: ['SEARCH_MATCH'] });

  const toggleFilter = (field: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[field] ?? [];
      if (!Array.isArray(current)) return { ...prev, [field]: [value] };

      return current.includes(value)
        ? { ...prev, [field]: current.filter((v) => v !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

  // cycle genres: neutral -> included -> excluded -> neutral
  const toggleGenre = (genre: string) => {
    setFilters((prev) => {
      const inIncluded = prev.genreIn?.includes(genre);
      const inExcluded = prev.genreNotIn?.includes(genre);

      if (inIncluded) {
        return {
          ...prev,
          genreIn: prev.genreIn?.filter((g) => g !== genre),
          genreNotIn: [...(prev.genreNotIn ?? []), genre],
        };
      } else if (inExcluded) {
        return {
          ...prev,
          genreNotIn: prev.genreNotIn?.filter((g) => g !== genre),
        };
      } else {
        return {
          ...prev,
          genreIn: [...(prev.genreIn ?? []), genre],
        };
      }
    });
  };

  const applyFilters = () => {
    setPage(1);
    onApply(filters);
  }
  const resetFilters = () => {
    setPage(1);
    setFilters({ year: currentYear });
    onApply({ year: currentYear });
  };

  const yearOptions = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => 1980 + i
  ).reverse(); // show latest year first

  return (
    <div className="bg-zinc-800 rounded-xl p-6 shadow-md space-y-6">
      {/* Search */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
          <SearchIcon className="w-4 h-4 text-rose-400" />
          Search
        </h3>
        <input
          type="text"
          placeholder="Search by title..."
          className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full"
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-rose-400" />
            Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFilter("formatIn", key)}
                className={`px-3 py-1 rounded-full text-sm transition ${filters.formatIn?.includes(key)
                  ? "bg-rose-500 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFilter("statusIn", key)}
                className={`px-3 py-1 rounded-full text-sm transition ${filters.statusIn?.includes(key)
                  ? "bg-rose-500 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
          <Tags className="w-4 h-4 text-rose-400" />
          Genres
          <Tooltip text="Click once to include, again to exclude, and once more to unselect.">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-rose-400" />
          </Tooltip>
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => {
            const included = filters.genreIn?.includes(g);
            const excluded = filters.genreNotIn?.includes(g);

            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-full text-sm transition ${included
                  ? "bg-green-600 text-white"
                  : excluded
                    ? "bg-red-600 text-white"
                    : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Season / Year / Country / Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Season */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-400" />
            Season
          </h3>
          <select
            className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full"
            value={filters.season || ""}
            onChange={(e) =>
              setFilters({ ...filters, season: e.target.value || undefined })
            }
          >
            <option value="">All</option>
            {SEASONS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            Year
          </h3>
          <select
            className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full"
            value={filters.year ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                year: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          >
            {/* Blank option */}
            <option value="">Year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-400" />
            Country
          </h3>
          <select
            className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full"
            value={filters.country || ""}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value || undefined })
            }
          >
            <option value="">All</option>
            {COUNTRIES.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-rose-400" />
            Sort
          </h3>
          <select
            className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full"
            value={filters.sort?.[0] || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value ? [e.target.value] : undefined,
              })
            }
          >
            <option value="">Default</option>
            {SORT_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={resetFilters}
          className="bg-zinc-700 hover:bg-zinc-600 text-gray-200 px-5 py-2 rounded-lg text-sm font-medium"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={applyFilters}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
