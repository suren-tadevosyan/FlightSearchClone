import React, { useState, useEffect } from "react";
import axios from "axios";

const countryToCapital = {
  France: "Paris",
  Germany: "Berlin",
  Italy: "Rome",
  Spain: "Madrid",
  UnitedKingdom: "London",
  UnitedStates: "Washington",
  Canada: "Ottawa",
  Australia: "Canberra",
  Japan: "Tokyo",
  India: "New Delhi",
};

const AirportInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected) return;

    const source = axios.CancelToken.source();

    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) {
        setIsLoading(true);

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
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      source.cancel("Operation canceled due to new request.");
    };
  }, [query, selected]);

  const handleSelect = async (airport) => {
    let selectedQuery = airport.presentation.suggestionTitle;

    if (countryToCapital[selectedQuery]) {
      selectedQuery = countryToCapital[selectedQuery];
      setQuery(`${selectedQuery} (Auto-selected)`);

      try {
        const response = await axios.get(
          "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
          {
            params: { query: selectedQuery },
            headers: {
              "x-rapidapi-key":
                "9db8884e54mshb8f2c55c633f9d5p1c2fdejsn25ca344835c1",
              "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
            },
          }
        );

        const capitalAirports = response.data.data || [];
        if (capitalAirports.length > 0) {
          airport = capitalAirports[0];
        }
      } catch (error) {
        console.error("Error fetching capital city airport:", error);
      }
    }

    setQuery(airport.presentation.suggestionTitle);
    setSuggestions([]);
    setSelected(true);
    onSelect(airport);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(false);
  };

  return (
    <div className="relative">
      <label className="block mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Type a city or country name..."
        className="border p-2 rounded w-full"
      />
      {isLoading && query.length > 1 && !selected && (
        <div className="absolute bg-white border w-full rounded mt-1 p-2 text-gray-500">
          Loading...
        </div>
      )}
      {!isLoading && suggestions.length > 0 && (
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
