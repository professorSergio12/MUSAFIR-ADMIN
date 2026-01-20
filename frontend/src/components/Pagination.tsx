import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
}: PaginationProps) {
  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : 0;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      {/* Items Info */}
      <div className="flex items-center text-sm text-slate-600">
        {totalItems && (
          <span>
            Showing <span className="font-medium text-slate-900">{startItem}</span> to{" "}
            <span className="font-medium text-slate-900">{endItem}</span> of{" "}
            <span className="font-medium text-slate-900">{totalItems}</span> results
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition ${
            currentPage === 1
              ? "text-slate-400 cursor-not-allowed bg-slate-50"
              : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-slate-500"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-md transition ${
                  isActive
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition ${
            currentPage === totalPages
              ? "text-slate-400 cursor-not-allowed bg-slate-50"
              : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

