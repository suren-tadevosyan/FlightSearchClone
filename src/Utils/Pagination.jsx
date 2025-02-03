import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; 
    const sidePages = 2; 

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= sidePages + 2) {
      pages.push(...Array.from({ length: sidePages + 3 }, (_, i) => i + 1));
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - sidePages - 1) {
      pages.push(1);
      pages.push("...");
      pages.push(
        ...Array.from(
          { length: sidePages + 3 },
          (_, i) => totalPages - sidePages - 2 + i
        )
      );
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageClick(page)}
            disabled={page === "..."}
            className={`py-2 px-4 rounded-lg ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${page === "..." ? "cursor-default opacity-50" : ""}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
