import React from "react";

const FlightSorting = ({ sortOption, handleSortChange }) => {
  return (
    <div className="flex items-center justify-end mb-4">
      <label className="mr-2 font-medium text-gray-700">Sort By:</label>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="p-2 border rounded"
      >
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="durationAsc">Duration: Shortest to Longest</option>
      </select>
    </div>
  );
};

export default FlightSorting;
