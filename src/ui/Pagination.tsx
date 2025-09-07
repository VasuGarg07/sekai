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

    // build the page numbers: current ±2
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="w-full flex items-center justify-center gap-2 mt-6">
            {/* First */}
            {currentPage > 2 && (
                <button
                    type="button"
                    onClick={() => onPageChange(1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
            )}

            {/* Prev */}
            {currentPage > 1 && (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            )}

            {/* Page numbers */}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-medium transition ${currentPage === p
                        ? "bg-rose-500 text-white"
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
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}

            {/* Last */}
            {currentPage < totalPages - 1 && (
                <button
                    type="button"
                    onClick={() => onPageChange(totalPages)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
