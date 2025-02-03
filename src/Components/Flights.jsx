import React, { useState } from "react";
import FlightSorting from "../Utils/FlightSorting";
import Pagination from "../Utils/Pagination";
import FlightModal from "./FlightModal";
import FlightCard from "../Utils/FlightCard";

const FlightResults = ({ flights }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("priceAsc");
  const pageSize = 5;

  if (
    !flights ||
    !Array.isArray(flights.itineraries) ||
    flights.itineraries.length === 0
  ) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No results. Try changing your search parameters.
      </div>
    );
  }

  const getFlightPrice = (flight) => {
    if (!flight.price || !flight.price.formatted) return 0;
    const priceString = flight.price.formatted.replace(/[^0-9.]/g, "");
    const price = parseFloat(priceString);
    return isNaN(price) ? 0 : price;
  };

  const getFlightDuration = (flight) => {
    if (!flight.legs || flight.legs.length === 0) return Infinity;
    const firstLeg = flight.legs[0];
    return firstLeg.durationInMinutes || Infinity;
  };

  const sortedItineraries = [...flights.itineraries].sort((a, b) => {
    if (sortOption === "priceAsc") {
      return getFlightPrice(a) - getFlightPrice(b);
    } else if (sortOption === "priceDesc") {
      return getFlightPrice(b) - getFlightPrice(a);
    } else if (sortOption === "durationAsc") {
      return getFlightDuration(a) - getFlightDuration(b);
    } else {
      return 0;
    }
  });

  const totalItems = sortedItineraries.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentFlights = sortedItineraries.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8">
        <FlightSorting
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />

        <div className="grid gap-4">
          {currentFlights.map((flight, index) => (
            <FlightCard
              key={flight.id || index}
              flight={flight}
              onClick={() => setSelectedFlight(flight)}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handlePageClick={handlePageClick}
        />
      </div>

      {selectedFlight && (
        <FlightModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </>
  );
};

export default FlightResults;
