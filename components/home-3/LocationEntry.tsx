import React, { useState, useEffect } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface LocationEntryProps {
  placeholder: string;
  onChange: (location: string) => void;
}

const LocationEntry: React.FC<LocationEntryProps> = ({
  placeholder,
  onChange,
}) => {
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(
    null
  );
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch locations from the API on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_location"
        );
        const data = await response.json();
        // Transform the API response to match the component's data structure
        const formattedData = data.map((location: any) => ({
          id: location.id,
          name: location.location_name,
        }));
        setLocations(formattedData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations =
    query === ""
      ? locations
      : locations.filter((location) =>
          location.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (location: { id: number; name: string }) => {
    setSelected(location);
    setQuery(location.name);
    setDropdownOpen(false); // Close dropdown after selection
    onChange(location.name);
  };

  return (
    <div className="relative w-full md:w-[50%] xl:w-[25%] shrink-0">
      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-full sm:text-sm bg-[var(--bg-1)] border focus:outline-none"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <input
          className="w-full bg-[var(--bg-1)] border-none py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setDropdownOpen(true); // Open dropdown on input change
          }}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <MapPinIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </div>
      </div>
      {dropdownOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredLocations.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No results found
            </div>
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                className="relative cursor-pointer select-none py-2 px-4 hover:bg-gray-100"
                onClick={() => handleSelect(location)}
              >
                {location.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LocationEntry;
