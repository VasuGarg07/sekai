import { useState, type Dispatch, type SetStateAction, type FormEvent } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Tooltip from "../../ui/Tooltip";

interface AnimeFiltersProps {
  onApply: (filters: Filters) => void;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function AnimeFilters({ onApply, setPage }: AnimeFiltersProps) {
  const { data: genres = [] } = useGenres();
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState<Filters>({ sort: ['SEARCH_MATCH'] });
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleFilter = (field: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[field] ?? [];
      if (!Array.isArray(current)) return { ...prev, [field]: [value] };

      return current.includes(value)
        ? { ...prev, [field]: current.filter((v) => v !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

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
  };

  const resetFilters = () => {
    setPage(1);
    setFilters({ year: currentYear });
    onApply({ year: currentYear });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const yearOptions = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => 1980 + i
  ).reverse();

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-lg shadow-md sm:rounded-xl">
      {/* Header with Toggle */}
      <div
        className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-zinc-750 transition-colors rounded-t-lg sm:rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-base font-semibold text-white flex items-center gap-2 sm:text-lg">
          <ListFilter className="w-5 h-5 text-accent-400" />
          Filters
        </h2>
        <button
          type="button"
          className="text-white transition-colors"
          aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 sm:p-6 sm:pt-0 sm:space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="search-input" className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
              <SearchIcon className="w-4 h-4 text-accent-400" />
              Search
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by title..."
              className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={filters.search ?? ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Type */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <ListFilter className="w-4 h-4 text-accent-400" />
                Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFilter("formatIn", key)}
                    className={`px-2.5 py-1 rounded-full text-xs transition sm:px-3 sm:text-sm ${filters.formatIn?.includes(key)
                      ? "bg-accent-500 text-white"
                      : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <Activity className="w-4 h-4 text-accent-400" />
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFilter("statusIn", key)}
                    className={`px-2.5 py-1 rounded-full text-xs transition sm:px-3 sm:text-sm ${filters.statusIn?.includes(key)
                      ? "bg-accent-500 text-white"
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
            <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
              <Tags className="w-4 h-4 text-accent-400" />
              Genres
              <Tooltip text="Click once to include, again to exclude, and once more to unselect.">
                <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-accent-400" />
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
                    className={`px-2.5 py-1 rounded-full text-xs transition sm:px-3 sm:text-sm ${included
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {/* Season */}
            <div>
              <label htmlFor="season-select" className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <Calendar className="w-4 h-4 text-accent-400" />
                Season
              </label>
              <select
                id="season-select"
                className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
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
              <label htmlFor="year-select" className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <Clock className="w-4 h-4 text-accent-400" />
                Year
              </label>
              <select
                id="year-select"
                className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={filters.year ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    year: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                <option value="">All Years</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country-select" className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <Globe className="w-4 h-4 text-accent-400" />
                Country
              </label>
              <select
                id="country-select"
                className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
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
              <label htmlFor="sort-select" className="mb-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2 sm:text-sm">
                <ArrowUpDown className="w-4 h-4 text-accent-400" />
                Sort
              </label>
              <select
                id="sort-select"
                className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
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
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="bg-zinc-700 hover:bg-zinc-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors sm:px-5"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors sm:px-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </form>
  );
}