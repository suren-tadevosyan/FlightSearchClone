import React, { useState } from "react";
import AirportInput from "./AirportInput";
import { motion } from "framer-motion";

const SearchForm = ({
  onSearch,
}) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");

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
    if (origin && destination && date) {
      const depCoords = await getCoordinates(
        origin.presentation.suggestionTitle
      );
      const arrCoords = await getCoordinates(
        destination.presentation.suggestionTitle
      );

      onSearch(
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
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Search Flights
      </button>
    </motion.form>
  );
};

export default SearchForm;
