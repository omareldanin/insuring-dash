import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const DOTS = "..." as const;

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const siblingCount = 1;
  const boundaryCount = 2;

  const range = (start: number, end: number) =>
    start <= end
      ? Array.from({ length: end - start + 1 }, (_, i) => start + i)
      : [];

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages,
  );

  const siblingsStart = Math.max(page - siblingCount, boundaryCount + 1);

  const siblingsEnd = Math.min(page + siblingCount, totalPages - boundaryCount);

  const pages: (number | typeof DOTS)[] = [
    ...startPages,

    ...(siblingsStart > boundaryCount + 1 ? [DOTS] : []),

    ...range(siblingsStart, siblingsEnd),

    ...(siblingsEnd < totalPages - boundaryCount ? [DOTS] : []),

    ...endPages,
  ];

  return (
    <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border bg-black text-white rounded disabled:opacity-50">
        السابق
      </button>

      {pages.map((p, i) =>
        p === DOTS ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${
              page === p
                ? "bg-black text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}>
            {p}
          </button>
        ),
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border bg-black text-white rounded disabled:opacity-50">
        التالي
      </button>
    </div>
  );
};

export default Pagination;
