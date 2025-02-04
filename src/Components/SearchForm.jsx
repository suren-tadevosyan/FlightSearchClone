import React, { useState, useEffect } from "react";
import AirportInput from "./AirportInput";
import { motion } from "framer-motion";

const SearchForm = ({ onSearch, setIsSearchFormExpanded }) => {
  const [origin, setOrigin] = useState(
    () => JSON.parse(localStorage.getItem("origin")) || null
  );
  const [destination, setDestination] = useState(
    () => JSON.parse(localStorage.getItem("destination")) || null
  );
  const [date, setDate] = useState(localStorage.getItem("date") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (origin) localStorage.setItem("origin", JSON.stringify(origin));
    if (destination)
      localStorage.setItem("destination", JSON.stringify(destination));
    if (date) localStorage.setItem("date", date);
  }, [origin, destination, date]);

  const getCoordinates = async (city) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!origin || !destination || !date) {
      alert("Please select both origin and destination cities and a date.");
      return;
    }

    setLoading(true);

    const depCoords = await getCoordinates(origin.presentation.suggestionTitle);
    const arrCoords = await getCoordinates(
      destination.presentation.suggestionTitle
    );

    await onSearch(
      {
        originSkyId: origin.navigation.relevantFlightParams.skyId,
        destinationSkyId: destination.navigation.relevantFlightParams.skyId,
        originEntityId: origin.navigation.entityId,
        destinationEntityId: destination.navigation.entityId,
        date: date,
      },
      depCoords,
      arrCoords
    );

    setLoading(false);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDate("");

    localStorage.removeItem("origin");
    localStorage.removeItem("destination");
    localStorage.removeItem("date");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Find Your Flight
        </h2>
        <button
          type="button"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={() => setIsSearchFormExpanded(false)}
        >
          Hide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AirportInput
            label="Origin City"
            onSelect={(airport) => setOrigin(airport)}
          />
          {origin && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {origin.presentation.suggestionTitle}
            </p>
          )}
        </div>
        <div>
          <AirportInput
            label="Destination City"
            onSelect={(airport) => setDestination(airport)}
          />
          {destination && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {destination.presentation.suggestionTitle}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Date
        </label>
        <div
          className="relative w-full"
          onClick={() => document.getElementById("dateInput").showPicker()}
        >
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white text-gray-900"
            required
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <motion.span
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Searching...
            </motion.span>
          ) : (
            "Search Flights"
          )}
        </button>

        <button
          type="button"
          className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-red-600 transition-all"
          onClick={handleReset}
        >
          Reset All
        </button>
      </div>
    </motion.form>
  );
};

export default SearchForm;
