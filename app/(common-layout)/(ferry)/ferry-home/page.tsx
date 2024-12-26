"use client";
import { useState } from "react";
import { SearchIcon, PlusIcon } from "@/public/data/icons";
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

const Page = () => {
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [trips, setTrips] = useState([{ id: 1, from: "", to: "" }]); // Initialize with one trip row
  const [tripType, setTripType] = useState("one"); // State for the selected trip type (one or round)

  // List of locations to choose from
  const locations = ["Port Blair", "Havelock", "Neil Island"];

  // Function to add a new trip row and set tripType to 'round'
  const addTrip = () => {
    if (trips.length < 3) { // Check if there are less than 3 trips
      setTrips((prevTrips) => [...prevTrips, { id: prevTrips.length + 1, from: "", to: "" }]);
      setTripType("round"); // Set tripType to "round" when adding a trip
    }
  };

  // Function to remove a trip row by ID
  const removeTrip = (id: number) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  // Handle radio button change
  const handleTripTypeChange = (type: string) => {
    setTripType(type);
    // Reset trips based on the trip type selected
    if (type === "one") {
      setTrips([{ id: 1, from: "", to: "" }]); // One-way: reset to one trip
    } else {
      setTrips([{ id: 1, from: "", to: "" }, { id: 2, from: "", to: "" }]); // Round-trip: set two trips by default
    }
  };

  return (
    <section className="relative px-3 xl:px-0">
      <div className="w-full lg:w-[638px] lg:h-[700px] absolute max-xl:hidden right-4 top-0 xxl:right-10 3xl:right-[10%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 flex flex-col gap-5 ">
          <Image src={HeroFlightImg1} alt="img" />
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          <Image src={HeroFlightImg2} alt="img" />
          <Image src={flight} className="self-end" alt="img" />
        </div>
      </div>

      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="L61p2uyiMSo"
        onClose={() => setOpen(false)}
      />
      <Image
        width={117}
        height={117}
        src="/img/flight-hero-el-1.png"
        alt="image"
        className="hidden xl:block absolute left-16 top-14"
      />
      <Image
        height={100}
        width={100}
        src="/img/flight-hero-el-2.png"
        alt="image"
        className="hidden xl:block absolute top-[50%] left-[50%]"
      />
      <span
        onClick={() => setOpen(true)}
        style={{ zIndex: 2 }}
        className="cursor-pointer absolute hidden lg:block top-[84px] right-[22%]">
        <Image
          height={80}
          width={80}
          src="/img/video-img.png"
          alt="image"
          className=""
        />
      </span>

      <div className="container relative py-[60px] lg:py-[120px]">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8 xl:col-span-6 xxl:col-span-5">
            <SubHeadingBtn
              text="Fly Anywhere with Confidence"
              classes="bg-[var(--primary-light)]"
            />
            <h1 className="h1 mt-4 mb-6 font-semibold leading-tight">
              Book Your Next Ferry with Ease
            </h1>
            <p className="mb-10 text-lg max-w-lg">
              Ready to explore the world? Our flight booking website makes it
              easy to unlock new destinations and experiences.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 md:p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-lg">
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="one"
                checked={tripType === "one"}
                onChange={() => handleTripTypeChange("one")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="one">One Way</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="round"
                checked={tripType === "round"}
                onChange={() => handleTripTypeChange("round")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="round">Round Trip</label>
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
                      className="w-full bg-[var(--bg-1)] border-none py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Select Location</option>
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
                      className="w-full bg-[var(--bg-1)] border-none py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Select Location</option>
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
                    selected={startDate}
                    onChange={(date: any) => setStartDate(date)}
                    placeholderText="Depart Date"
                    className="w-full bg-[var(--bg-1)] p-2 rounded-full focus:outline-none"
                  />
                  <CalendarDaysIcon className="w-5 h-5 text-gray-600 shrink-0" />
                </div>

                <SelectPeople />

                {/* Conditionally render the delete button if more than one trip */}
                {trips.length > 1 && (
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="text-red-500 py-2 px-4 bg-white rounded-full hover:bg-gray-200"
                  >
                    Delete
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
            <Link
              href="#"
              className="py-[14px] px-6 flex justify-center text-white bg-primary rounded-full"
            >
              <SearchIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
