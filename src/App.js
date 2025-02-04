import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "./Components/SearchForm";
import FlightResults from "./Components/Flights";
import { FlightAnimation } from "./Utils/FlightAnimation";
import LeafletMap from "./Utils/LeafletMap";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchFormExpanded, setIsSearchFormExpanded] = useState(true);

  const [departureCoords, setDepartureCoords] = useState(null);
  const [arrivalCoords, setArrivalCoords] = useState(null);

  const handleSearch = async (searchParams, departureCoords, arrivalCoords) => {
    setLoading(true);
    setIsSearchFormExpanded(false);

    setDepartureCoords(departureCoords);
    setArrivalCoords(arrivalCoords);

    const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${searchParams.originSkyId}&destinationSkyId=${searchParams.destinationSkyId}&originEntityId=${searchParams.originEntityId}&destinationEntityId=${searchParams.destinationEntityId}&date=${searchParams.date}&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "9db8884e54mshb8f2c55c633f9d5p1c2fdejsn25ca344835c1",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setFlights(result.data || []);
    } catch (error) {
      console.error("Error searching for flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col lg:flex-row gap-4 transition-all duration-300">
     
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
  
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-center mb-6">Flight Search</h1>

          <AnimatePresence>
            {isSearchFormExpanded && (
              <motion.div
                key="searchForm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchForm
                  onSearch={handleSearch}
                  isSearchFormExpanded={isSearchFormExpanded}
                  setIsSearchFormExpanded={setIsSearchFormExpanded}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearchFormExpanded && (
            <div className="text-center mt-4">
              <button
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                onClick={() => setIsSearchFormExpanded(true)}
              >
                Show Search Form
              </button>
            </div>
          )}
        </motion.div>


        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg flex-1 overflow-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <FlightAnimation />
            </div>
          ) : (
            <FlightResults flights={flights} />
          )}
        </motion.div>
      </div>


      <motion.div
        className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LeafletMap departure={departureCoords} arrival={arrivalCoords} />
      </motion.div>
    </div>
  );
}

export default App;
