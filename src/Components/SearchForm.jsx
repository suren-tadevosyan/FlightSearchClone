import React, { useState } from "react";
import AirportInput from "./AirportInput";
import { motion } from "framer-motion";

const SearchForm = ({
  onSearch,
  isSearchFormExpanded,
  setIsSearchFormExpanded,
}) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination && date) {
      onSearch({
        originSkyId: origin.navigation.relevantFlightParams.skyId,
        destinationSkyId: destination.navigation.relevantFlightParams.skyId,
        originEntityId: origin.navigation.entityId,
        destinationEntityId: destination.navigation.entityId,
        date: date,
      });
    } else {
      alert("Please select both origin and destination cities and a date.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Find Your Flight
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AirportInput label="Origin City" onSelect={setOrigin} />
        </div>
        <div>
          <AirportInput label="Destination City" onSelect={setDestination} />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Date
        </label>
        <label className="w-full block cursor-pointer">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            required
          />
        </label>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Search Flights
        </button>
        {isSearchFormExpanded && (
          <div className="text-center my-4">
            <button
              type="button"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
              onClick={() => setIsSearchFormExpanded(false)}
            >
              Close Search Form
            </button>
          </div>
        )}
      </div>
    </motion.form>
  );
};

export default SearchForm;
