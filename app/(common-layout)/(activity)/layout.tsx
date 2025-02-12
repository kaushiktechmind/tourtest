"use client";

import { StarIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon, ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const [refreshKey, setRefreshKey] = useState(0);


  const [locations, setLocations] = useState<{ id: number; location_name: string }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_location");
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Handle location selection (only update state)
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  const handleSearch = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default link behavior
  
    if (selectedLocation) {
      localStorage.setItem("storedLocation", selectedLocation);
      setRefreshKey((prevKey) => prevKey + 1);  // Trigger re-render of children
    } else {
      alert("Please select a location before searching.");
    }
  };
  
  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3 ">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[100px]">
          <div className="col-span-12 lg:col-span-4 order-2 order-lg-1">
            <div className="p-3 sm:p-4 lg:py-6 lg:px-8 bg-white rounded-2xl shadow-lg">
              <h4 className="mb-0 text-2xl font-semibold">Filter</h4>
              <div className="border-t border-dashed my-6"></div>

              {/* Location Dropdown */}
              <div className="flex items-center justify-between rounded-full border border-neutral-40 bg-[var(--bg-2)] px-5 py-3">
                <select
                  className="w-full bg-transparent border-0 focus:outline-none"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.location_name}>
                      {location.location_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-dashed my-6"></div>
              <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">Star Category</p>
              <ul className="flex flex-col gap-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <li key={star} className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      {star} Star
                    </label>
                  </li>
                ))}
              </ul>

              <div className="border-t border-dashed my-6"></div>
              <Link
                href="#"
                onClick={handleSearch}
                className="btn btn-outline w-full font-semibold text-primary flex justify-center items-center gap-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Search
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 order-1 lg:order-2">
            <div key={refreshKey} className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12">
                <div className="bg-white rounded-lg py-2 px-6 shadow-lg">
                  <ul className="flex justify-between items-center flex-wrap gap-3">
                    <li className="hidden xl:block"></li>
                    <li className="flex-grow">
                      <ul className="flex flex-wrap justify-start gap-4">
                        <li className="flex items-center gap-4">
                          <Link
                            href={`/activities`}
                            className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${
                              path === "/activities" && "text-primary"
                            }`}
                          >
                            <Squares2X2Icon className="w-5 h-5" />
                            <span className="inline-block font-medium">Grid</span>
                          </Link>

                          <Link
                            href={`/activitylist`}
                            className={`link flex items-center gap-2 clr-neutral-500 hover:text-primary ${
                              path === "/activitylist" && "text-primary"
                            }`}
                          >
                            <ListBulletIcon className="w-5 h-5" />
                            <span className="inline-block font-medium">List</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
