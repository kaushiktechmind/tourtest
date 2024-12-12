import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface CardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CardPagination: React.FC<CardPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="col-span-12">
      <nav>
        <ul className="flex gap-3 justify-center">
          <li className="page-item">
            <button
              className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className="page-item">
              <button
                className={`page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "border-[var(--primary)] text-primary"
                }`}
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CardPagination;
