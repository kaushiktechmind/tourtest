"use client";
import Link from "next/link";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import LocationEntry from "../home-3/LocationEntry";
import AddRoom from "./AddRoom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Hero = () => {
  const [isOpen, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [locationName, setLocationName] = useState(""); // State to hold the location name
  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    // Check if any field is empty
    if (!locationName || !startDate || !endDate) {
      alert("Please fill all fields before searching.");
      return; // Stop execution if any field is empty
    }

    const formattedStartDate = startDate.toISOString().split("T")[0]; // Format the start date
    const formattedEndDate = endDate.toISOString().split("T")[0]; // Format the end date

    // Generate the search URL
    const searchUrl = `/hotel-listing?loc=${encodeURIComponent(locationName)}&startdate=${encodeURIComponent(formattedStartDate)}&enddate=${encodeURIComponent(formattedEndDate)}`;

    // Redirect to the search URL
    window.location.href = searchUrl; 
  };

  return (
    <section className="bg-[url('/img/andban-hero.jpg')] bg-cover bg-no-repeat relative isolate min-h-screen flex items-center py-20">
      <div className="container mx-auto text-center relative">
        <h1 className="text-white font-semibold mb-10 text-3xl md:text-5xl">
          Welcome to Andman Mangroves
        </h1>

        <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center">
          <LocationEntry 
            placeholder="Location" 
            onChange={(value) => setLocationName(value)} // Set location name on change
          />

          <div className="relative w-full md:w-[50%] xl:w-[25%] flex items-center bg-gray-100 rounded-full p-3 border">
            <DatePicker
              placeholderText="01/01/2024 - 01/01/2024"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="w-full text-center bg-transparent outline-none"
              dateFormat="MM/dd/yyyy"
            />
            <button
              type="button"
              className="absolute right-3"
              onClick={() => setOpen((prev) => !prev)}
            >
              <CalendarDaysIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="w-full md:w-[50%] xl:w-[25%]">
            <AddRoom />
          </div>

          <button
            onClick={handleSearch} // Call the search function on click
            className="py-3 px-6 w-full md:w-auto flex justify-center items-center bg-primary text-white rounded-full"
          >
            <span className="ml-2">Search</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
