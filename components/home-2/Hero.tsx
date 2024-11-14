"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  const [total, setTotal] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    noOfRooms: 0,
  });

  // Set initial values from localStorage if available
  useEffect(() => {
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');
    
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
  }, []);

  const [startDate, endDate] = dateRange;

  const handleSearch = () => {
    if (!locationName || !startDate || !endDate) {
      alert("Please fill all fields before searching.");
      return;
    }

    const formatDate = (date: Date | null) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Store the startDate and endDate in localStorage
    localStorage.setItem('startDate', formattedStartDate);
    localStorage.setItem('endDate', formattedEndDate);
    localStorage.setItem('storedLocation', locationName);

    const searchUrl = `/hotel-listing?loc=${encodeURIComponent(locationName)}&startdate=${encodeURIComponent(formattedStartDate)}&enddate=${encodeURIComponent(formattedEndDate)}&noOfRooms=${total.noOfRooms}`;

    window.location.href = searchUrl;
  };

  return (
    <section className="bg-[url('/img/andban-hero.jpg')] bg-cover bg-no-repeat relative isolate min-h-screen flex items-center py-20 z-[10]">
      <div className="container mx-auto text-center relative z-100">
        <h1 className="text-white font-semibold mb-10 text-3xl md:text-5xl">
          Welcome to Andman Mangroves
        </h1>

        {/* <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center"> */}
        <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center w-[60%] mx-auto">
          
          <LocationEntry
            placeholder="Location"
            onChange={(value) => setLocationName(value)} // Set location name on change
          />

          <div className="relative w-full md:w-[65%] xl:w-[35%] flex items-center bg-gray-100 rounded-full p-3 border">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="w-full text-center bg-transparent outline-none"
              dateFormat="MM/dd/yyyy"
              placeholderText="2024-11-11-2024-11-12"
              minDate={new Date()} 
            />
            <button
              type="button"
              className="absolute right-3"
              onClick={() => setOpen((prev) => !prev)}
            >
              <CalendarDaysIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>z

<<<<<<< HEAD
          {/* <div className="w-full md:w-[55%] xl:w-[27%]">
            <AddRoom setTotal={setTotal} />
          </div> */}
=======
          <div className="w-full md:w-[55%] xl:w-[27%]">
            <AddRoom setTotal={setTotal} /> {/* Pass setTotal to AddRoom */}
          </div>
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de

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
