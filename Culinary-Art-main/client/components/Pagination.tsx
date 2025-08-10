import React from "react";
import PaginationLink from "./PaginationLink";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  totalData: number;
  page: number;
  totalPages: number;
};

export default function Pagination({ totalData, page, totalPages }: Props) {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <PaginationLink
            page={page > 1 ? page - 1 : null}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationLink
              key={p}
              page={p}
              isActive={p === page}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PaginationLink>
          ))}

          <PaginationLink
            page={page < totalPages ? page + 1 : null}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </div>
      )}
    </>
  );
}
