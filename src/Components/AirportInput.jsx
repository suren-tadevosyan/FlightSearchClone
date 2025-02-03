import React, { useState, useEffect } from "react";
import axios from "axios";

const AirportInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) {
        axios
          .get(
            "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
            {
              params: { query: query },
              cancelToken: source.token,
              headers: {
                "x-rapidapi-key":
                  "9db8884e54mshb8f2c55c633f9d5p1c2fdejsn25ca344835c1",
                "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
              },
            }
          )
          .then((response) => {
            setSuggestions(response.data.data || []);
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              console.log("Previous request canceled", error.message);
            } else {
              console.error("Error fetching airport suggestions:", error);
            }
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      source.cancel("Operation canceled due to new request.");
    };
  }, [query]);

  const handleSelect = (airport) => {
    setQuery(airport.presentation.suggestionTitle);
    setSuggestions([]);
    onSelect(airport);
  };

  return (
    <div className="relative">
      <label className="block mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a city name..."
        className="border p-2 rounded w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full rounded mt-1 max-h-60 overflow-y-auto z-10">
          {suggestions.map((airport) => (
            <li
              key={airport.entityId}
              onClick={() => handleSelect(airport)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {airport.presentation.suggestionTitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportInput;
