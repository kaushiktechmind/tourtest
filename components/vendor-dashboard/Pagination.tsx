import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center gap-3 pt-5 lg:pt-7 flex-wrap">
      <span>
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </span>
      <ul className="flex gap-2 flex-wrap">
        <li
          className={`border border-primary w-10 h-10 rounded-full flex items-center justify-center text-primary ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white"
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            key={index + 1}
            className={`border w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === index + 1 ? "bg-primary text-white" : "border-primary text-primary"
            } hover:bg-primary hover:text-white duration-300`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </li>
        ))}
        <li
          className={`border border-primary w-10 h-10 rounded-full flex items-center justify-center text-primary ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white"
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
