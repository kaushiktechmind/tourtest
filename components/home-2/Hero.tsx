"use client";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import LocationEntry from "../home-3/LocationEntry";
import "react-datepicker/dist/react-datepicker.css";
import HeroDropdown4 from "../home-1/HeroDropdown4";
import { SearchIcon } from "@/public/data/icons";
import AddRoom from "./AddRoom";

const Hero = () => {
  const [isOpen, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const handleSelect = (date: Date | null, type: "checkIn" | "checkOut") => {
    if (type === "checkIn") {
      setCheckInDate(date);
    } else {
      setCheckOutDate(date);
    }
    setDatePickerOpen(false); // Close date picker after selection
  };

  return (
    <section className="bg-[url('/img/secondary-hero-bg.jpg')] bg-cover bg-no-repeat relative isolate bg-[50%] top-0 min-h-screen after:w-full after:absolute after:h-full after:bottom-0 after:left-0 after:bg-gradient-to-t after:rounded-b-2xl after:from-[#04052f5b] after:to-[#04052f5b] z-10">
      <div className="container grid place-items-center py-20 lg:pb-[180px] lg:pt-[260px]">
        <div className="max-w-[1700px] mx-auto z-10 relative px-3 xl:px-0">
          <h1 className="h1 text-white font-semibold mb-10 lg:mr-36 leading-tight">
            Welcome to Andman Mangroves
          </h1>

          <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg">
            <LocationEntry placeholder="Location" />

            <div className="w-full md:w-[40%] xl:w-[20%] flex pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
              <DatePicker
                selected={startDate}
                placeholderText="Check In"
                onChange={(date: any) => setStartDate(date)}
                className="w-full bg-[var(--bg-1)] p-3 rounded-full focus:outline-none"
              />
              <CalendarDaysIcon className="w-6 h-6 text-gray-600 shrink-0" />
            </div>
            <div className="w-full md:w-[48%] xl:w-[22%] flex pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
              <DatePicker
                selected={startDate}
                placeholderText="Check Out"
                onChange={(date: any) => setStartDate(date)}
                className="w-full bg-[var(--bg-1)] p-3 rounded-full focus:outline-none"
              />
              <CalendarDaysIcon className="w-6 h-6 text-gray-600 shrink-0" />
            </div>

            {/* <HeroDropdown4 /> */}

            <AddRoom />
            <Link
              href="#"
              className="py-[14px] px-6 w-full flex justify-center xl:w-auto text-white bg-primary rounded-full"
            >
              <SearchIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
