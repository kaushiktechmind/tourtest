"use client";
import { useState, useEffect } from "react";


import { SearchIcon } from "@/public/data/icons";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sectors from "@/components/home-3/Sectors";
import SelectPeople from "@/components/home-6/SelectPeople";
import Image from "next/image";
import Link from "next/link";
import ModalVideo from "react-modal-video";
import SubHeadingBtn from "@/components/SubHeadingBtn";
import flight from "@/public/img/hero-flight/flight.png";
import HeroFlightImg1 from "@/public/img/hero-flight/img-1.png";
import HeroFlightImg2 from "@/public/img/hero-flight/img-2.png";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";


interface Trip {
  id: number;
  from: string;
  to: string;
  date: Date | null; // Assuming `date` can be a Date object or null
}




const Page = () => {
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([{ id: 1, from: "", to: "", date: null }]);
  const [tripType, setTripType] = useState("single_trip"); // State for the selected trip type (single_trip or return_trip)
  const router = useRouter();

  const [adult, setAdult] = useState(1);
  const [infants, setInfants] = useState(0);

  // List of locations to choose from
  const locations = ["Port Blair", "Swaraj Dweep  (Havelock) ", "Shaheed Dweep (Neil)"];

  const addTrip = () => {
    if (trips.length < 3) { // Check if there are less than 3 trips
      setTrips((prevTrips) => {
        const lastTrip = prevTrips[prevTrips.length - 1]; // Get the last trip
        const newTrip = { id: prevTrips.length + 1, from: lastTrip.to || "", to: "", date: null }; // Prefill the 'from' field with the last 'to' field
        return [...prevTrips, newTrip];
      });
      setTripType("return_trip"); // Set tripType to "return_trip" when adding a trip
    }
  };

  const removeTrip = (id: number) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  // const updateLocalStorage = () => {
  //   if (trips.length > 0) {
  //     const travelData = {};

  //     trips.forEach((trip, index) => {
  //       const tripIndex = index + 1; // Start index from 1 (e.g., from1, to1, etc.)

  //       const formatDate = (date: { getTime: () => number; getTimezoneOffset: () => number; }) => {
  //         if (!date) return "";
  //         const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  //         return offsetDate.toISOString().split("T")[0]; // Extract only the date part
  //       };

  //       // Store trip details dynamically as from1, to1, travel_date1, from2, to2, travel_date2, etc.
  //       travelData[`from${tripIndex}`] = trip.from || "";
  //       travelData[`to${tripIndex}`] = trip.to || "";
  //       travelData[`travel_date${tripIndex}`] = formatDate(trip.date); // format date

  //     });
  //     travelData["adults"] = adult;
  //     travelData["infants"] = infants;
  //     travelData["no_of_passengers"] = adult + infants;

  //     // Store the entire travelData object in localStorage
  //     localStorage.setItem("travelData", JSON.stringify(travelData));
  //   }
  // };

  const updateLocalStorage = () => {
    if (trips.length > 0) {
      const travelData: { [key: string]: string | number } = {}; // Allow dynamic keys with string or number values

      trips.forEach((trip, index) => {
        const tripIndex = index + 1; // Start index from 1 (e.g., from1, to1, etc.)

        const formatDate = (date: Date | null) => {
          if (!date) return ""; // Return an empty string if date is null
          const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          return offsetDate.toISOString().split("T")[0]; // Extract only the date part
        };
        
        // Store trip details dynamically as from1, to1, travel_date1, from2, to2, travel_date2, etc.
        travelData[`from${tripIndex}`] = trip.from || "";
        travelData[`to${tripIndex}`] = trip.to || "";
        travelData[`travel_date${tripIndex}`] = formatDate(trip.date); 
      });

      travelData["adults"] = adult;
      travelData["infants"] = infants;
      travelData["no_of_passengers"] = adult + infants;

      // Store the entire travelData object in localStorage
      localStorage.setItem("travelData", JSON.stringify(travelData));
    }
  };


  const handleTripTypeChange = (type: string) => {
    setTripType(type);
    // Reset trips based on the trip type selected
    if (type === "single_trip") {
      setTrips([{
        id: 1, from: "", to: "",
        date: null
      }]); // single_trip: reset to single_trip
    } else {
      setTrips([{
        id: 1, from: "", to: "",
        date: null
      }, {
        id: 2, from: "", to: "",
        date: null
      }]); // return_trip: set two trips by default
    }
  };

  const handleLogin = async () => {
    const loginPayload = {
      data: {
        username: "am@makruzz.com",
        password: "maki3004",
      },
    };

    try {
      const response = await fetch("https://staging.makruzz.com/booking_api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data?.data?.token;

        if (token) {
          localStorage.setItem("Mak_Authorization", token);
          localStorage.setItem("nautika_token", "U2FsdGVkX18wFH8L127Sgd0wBwCSQMhE3y2kxDFXgc5zItPTXXqvjfTLuSAeD1ySsGVF5lj9i5LUoR/JhwJvSQ==");
          // alert("Login successful!");
          router.push(`/ferry-list?tripType=${tripType}`);
        } else {
          alert("Failed to retrieve token.");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  const handleSearch = () => {
    const allFieldsFilled = trips.every((trip) => trip.from && trip.to && trip.date);

    if (!allFieldsFilled) {
      alert("Please fill all fields before searching.");
      return; // Stop further execution
    }

    // Proceed with your login or search logic
    updateLocalStorage();
    handleLogin();
  };


  return (
    <section className="relative px-3 xl:px-0">
      <div
        className="relative w-full h-[550px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/img/ferry-bg.jpg)' }} // Set the background image
      >
        {/* Content over the background image */}
        <div className="container relative py-[60px] lg:py-[120px] text-white">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 xl:col-span-6 xxl:col-span-5">
              {/* <SubHeadingBtn
                text="4.8 rated service"
                classes="bg-[var(--primary-light)]"
              /> */}
              <h1 className="h1 mt-4 mb-6 font-semibold leading-tight">
                Book Your Andaman Ferry
              </h1>
              <p className="mb-10 text-lg max-w-lg">
                Compare & book all hi-speed ferries in Andamans in 3 easy steps
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="container relative -mt-[40px]">
        <div className="bg-white rounded-xl p-3 md:p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-lg">
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="single_trip"
                checked={tripType === "single_trip"}
                onChange={() => handleTripTypeChange("single_trip")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="single_trip">Single Trip</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="return_trip"
                checked={tripType === "return_trip"}
                onChange={() => handleTripTypeChange("return_trip")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="return_trip">Multiple Trip</label>
            </div>
          </div>

          {trips.map((trip, index) => {
            // Filter the locations to exclude the selected "from" location
            const availableLocations = locations.filter(
              (location) => location !== trip.from
            );

            return (
              <div key={trip.id} className="flex flex-wrap gap-5 mt-6 items-center">
                {/* Conditionally render "Trip {index + 1}" only when more than 1 trip */}
                {trips.length > 1 && (
                  <div className="w-full text-xl text-gray-600 font-semibold">
                    Trip {index + 1}
                  </div>
                )}

                <div className="flex w-full md:w-[35%] gap-3 mr-10">
                  {/* From Location */}
                  <div className="relative w-full">
                    <select
                      value={trip.from || ""}
                      onChange={(e) => {
                        const updatedTrips = [...trips];
                        updatedTrips[index].from = e.target.value;
                        setTrips(updatedTrips); // Update the "from" location
                      }}
                      className="w-full bg-[var(--bg-1)] rounded-full border py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>From</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <MapPinIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>

                  {/* To Location */}
                  <div className="relative w-full">
                    <select
                      value={trip.to || ""}
                      onChange={(e) => {
                        const updatedTrips = [...trips];
                        updatedTrips[index].to = e.target.value;
                        setTrips(updatedTrips); // Update the "to" location
                        // If this is not the last trip, prefill the next trip's "from"
                        if (index < trips.length - 1) {
                          const nextTrip = [...trips];
                          nextTrip[index + 1].from = e.target.value;
                          setTrips(nextTrip);
                        }
                      }}
                      className="w-full bg-[var(--bg-1)] rounded-full border py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>To</option>
                      {availableLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <MapPinIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[30%] xxl:w-[20%] flex pl-2 pt-1 pb-1 pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
                  <DatePicker
                    selected={trip.date}
                    onChange={(date: Date) => {
                      const updatedTrips = [...trips];
                      updatedTrips[index].date = date;
                      setTrips(updatedTrips);
                    }}
                    placeholderText="Depart Date"
                    className="w-full bg-[var(--bg-1)] p-2 rounded-full focus:outline-none"
                  />
                  <CalendarDaysIcon className="w-5 h-5 text-gray-600 shrink-0" />
                </div>

                {/* Only show SelectPeople for the first row */}
                {index === 0 && (
                  <SelectPeople
                    adult={adult}
                    setAdult={setAdult}
                    infants={infants}
                    setInfants={setInfants}
                  />
                )}

                {/* Conditionally render the delete button if more than single_trip */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTrip(trip.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Trip
                  </button>
                )}
              </div>
            );
          })}


          {/* Add Trip and Search buttons in the same row */}
          <div className="flex justify-between items-center mt-6">
            {/* Add Trip Button */}
            <button
              onClick={addTrip}
              type="button"
              className="py-[10px] px-5 w-auto text-black rounded-full sm:text-sm bg-[var(--bg-1)] border"
              disabled={trips.length >= 3}
            >
              + Add Trip
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="py-[14px] px-6 flex justify-center text-white bg-primary rounded-full"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>



      <div className="container relative py-[60px] lg:py-[120px]">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8 xl:col-span-8 xxl:col-span-12">
            <SubHeadingBtn
              text="4.8 rated service"
              classes="bg-[var(--primary-light)]"
            />
            <h1 className="h1 mt-4 mb-6 font-semibold leading-tight">
              Your One-Stop Shop for All Hi-Speed
            </h1>
            <p className="mb-10 text-lg max-w-lg">
              The Simplest Process Ever. Book Ferry in 3 Steps
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Page;
