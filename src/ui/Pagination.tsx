import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const btnBase =
        "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-700 text-gray-300 hover:bg-zinc-600 transition-colors";

    return (
        <nav aria-label="Pagination" className="w-full flex items-center justify-center gap-2 mt-6">
            {/* First */}
            {currentPage > 2 && (
                <button
                    type="button"
                    onClick={() => onPageChange(1)}
                    aria-label="First page"
                    className={btnBase}
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
            )}

            {/* Prev */}
            {currentPage > 1 && (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                    className={btnBase}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            )}

            {/* Page numbers */}
            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    aria-label={`Page ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        currentPage === p
                            ? "bg-accent-500 text-white"
                            : "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                    }`}
                >
                    {p}
                </button>
            ))}

            {/* Next */}
            {currentPage < totalPages && (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                    className={btnBase}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}

            {/* Last */}
            {currentPage < totalPages - 1 && (
                <button
                    type="button"
                    onClick={() => onPageChange(totalPages)}
                    aria-label="Last page"
                    className={btnBase}
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            )}
        </nav>
    );
}