// App.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchForm from "./Components/SearchForm";
import FlightResults from "./Components/Flights";
import { FlightAnimation } from "./Utils/FlightAnimation";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchFormExpanded, setIsSearchFormExpanded] = useState(true);

  const handleSearch = async (searchParams) => {
    setLoading(true);

    setIsSearchFormExpanded(false);

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
    <div className="min-h-screen bg-gray-100 p-4 ">
      <h1 className="text-3xl font-bold text-center mb-6">
        Flight Search Demo
      </h1>


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
        <div className="text-center mb-4">
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            onClick={() => setIsSearchFormExpanded(true)}
          >
            Show Search Form
          </button>
        </div>
      )}

      {loading ? (

        <div className="flex justify-center items-center mt-4">
          <FlightAnimation />
        </div>
      ) : (
      

        <FlightResults flights={flights} />
      )}
    </div>
  );
}

export default App;
