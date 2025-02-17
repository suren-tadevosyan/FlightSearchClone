import React, { useState, useEffect } from "react";
import axios from "axios";

const AIRPORT_API_URL =
  "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport";
const GITHUB_JSON_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-capital-city.json";

const AirportInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [countryToCapital, setCountryToCapital] = useState({});

  useEffect(() => {
    axios
      .get(GITHUB_JSON_URL)
      .then((response) => {
        const mapping = {};
        response.data.forEach((entry) => {
          mapping[entry.country] = entry.city;
        });
        setCountryToCapital(mapping);
      })
      .catch((error) =>
        console.error("Error fetching country-capital data:", error)
      );
  }, []);

  useEffect(() => {
    if (selected) return;

    const source = axios.CancelToken.source();
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) {
        setIsLoading(true);
        axios
          .get(AIRPORT_API_URL, {
            params: { query },
            cancelToken: source.token,
            headers: {
              "x-rapidapi-key":
                "2de54ae263msh5359d1ce9d7d793p1cc2f4jsn89e32f25eb66",
              "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
            },
          })
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
          .finally(() => setIsLoading(false));
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
        const response = await axios.get(AIRPORT_API_URL, {
          params: { query: selectedQuery },
          headers: {
            "x-rapidapi-key":
              "2de54ae263msh5359d1ce9d7d793p1cc2f4jsn89e32f25eb66",
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
          },
        });

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
