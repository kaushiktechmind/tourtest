"use client";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LocationEntry from "../home-3/LocationEntry";
import "react-datepicker/dist/react-datepicker.css";

const Hero = () => {
  const [locationName, setLocationName] = useState(""); // State to hold the location name
  const handleSearch = () => {
    localStorage.setItem("fromHome", "200");
    if (!locationName) {
      alert("Please fill all fields before searching.");
      return;
    }
    const searchUrl = `/hotel-listing?loc=${encodeURIComponent(locationName)}`;
    window.location.href = searchUrl;
  };

  return (
    <section className="bg-[url('/img/andban-hero.jpg')] bg-cover bg-no-repeat relative isolate min-h-screen flex items-center py-20 z-[10]">
      <div className="container mx-auto text-center relative z-100">
        <h1 className="text-white font-semibold mb-10 text-3xl md:text-5xl">
          Welcome to Andman Mangroves
        </h1>

        {/* <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center"> */}
        <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center w-[40%] mx-auto">

          <LocationEntry
            placeholder="Location"
            onChange={(value) => setLocationName(value)} // Set location name on change
          />
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
