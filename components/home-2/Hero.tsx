"use client";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LocationEntry from "../home-3/LocationEntry";

// Icons for each category
import { FaHotel, FaHome, FaCar, FaSuitcase, FaMountain } from "react-icons/fa"; // Use your preferred icons

const Hero = () => {
  const [locationName, setLocationName] = useState(""); // State to hold the location name
  const [selectedCategory, setSelectedCategory] = useState("Hotel"); // State for the selected category

  const handleSearch = () => {
    localStorage.setItem("fromHome", "200");
    localStorage.setItem("storedLocation", locationName);
    if (!locationName) {
      alert("Please Select Location.");
      return;
    }

    // Determine the path based on the selected category
    let searchUrl = "";
    switch (selectedCategory) {
      case "Hotel":
        searchUrl = `/hotel-listing`;
        break;
      case "Homestay":
        searchUrl = `/homestay-listing`;
        break;
      case "Package":
        searchUrl = `/package-listing`;
        break;
      case "Cab":
        searchUrl = `/cab-listing`;
        break;
      case "Activity":
        searchUrl = `/activity-listing`;
        break;
      default:
        searchUrl = `/hotel-listing`;
        break;
    }

    // Navigate to the appropriate URL
    window.location.href = searchUrl;
  };

  const categories = [
    { name: "Hotel", icon: FaHotel },
    { name: "Homestay", icon: FaHome },
    { name: "Package", icon: FaSuitcase },
    { name: "Cab", icon: FaCar },
    { name: "Activity", icon: FaMountain },
  ];

  return (
    <section className="bg-[url('/img/andban-hero.jpg')] bg-cover bg-no-repeat relative isolate min-h-screen flex items-center py-20 z-[10]">
      <div className="container mx-auto text-center relative z-100">
        <h1 className="text-white font-semibold mb-10 text-3xl md:text-5xl">
          Welcome to Andman Mangroves
        </h1>

        {/* Category Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center gap-2 text-white font-bold transition-all duration-300 ease-in-out ${
                  selectedCategory === category.name
                    ? "hover:text-white "
                    : "hover:text-white/80"
                }`}
              >
                <div
                  className={`p-3 rounded-full transition-all ${
                    selectedCategory === category.name
                      ? "bg-white text-primary shadow-lg"
                      : "bg-transparent text-white border border-white"
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input and Button */}
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
