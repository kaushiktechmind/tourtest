"use client";
import { SearchIcon } from "@/public/data/icons";
import HeroImg1 from "@/public/img/tour/img-1.png";
import HeroImg2 from "@/public/img/tour/img-2.png";
import Video from "@/public/img/tour/video.png";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalVideo from "react-modal-video";
import SubHeadingBtn from "../SubHeadingBtn";
import HeroDropdown4 from "../home-1/HeroDropdown4";
import LocationEntry from "../home-3/LocationEntry";
import GuestDropdown from "./GuestDropdown";

const Hero = () => {
  const [isOpen, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  return (
    <div className="relative px-3 3xl:after:bg-[url('/img/tour-hero-el.png')] after:bg-no-repeat after:w-full after:h-full after:absolute after:right-20 after:top-20 after:bg-right-top after:-z-[2]">
      <div className="w-[500px] h-[540px] lg:w-[638px] lg:min-h-[700px] xxl:w-[832px] absolute max-lg:hidden right-4 top-0 xxl:right-[6%] 3xl:right-[8%]">
        <Image
          className="absolute top-0 left-[12%]"
          src={HeroImg1}
          alt="hero img"
        />
        <Image
          className="absolute bottom-0 right-0 border-4 border-white"
          src={HeroImg2}
          alt="hero img"
        />
        <div className="relative left-0 top-8 ">
          <Image
            className="absolute rounded-full border-4 border-white"
            src={Video}
            alt="video img"
          />
        </div>
        <Image
          width={48}
          height={48}
          onClick={() => setOpen(true)}
          src="/img/video-btn.png"
          alt="image"
          className="absolute top-[18%] left-[16%] xxl:left-[12%] -translate-y-1/2 -translate-x-1/2 hidden xl:block cursor-pointer z-10"
        />
      </div>

      <div className="container py-[60px] lg:py-[100px] xl:pt-[160px] xl:pb-[150px] relative">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 xl:col-span-6">
            <SubHeadingBtn
              text="It's time to go"
              classes="bg-[var(--primary-light)]"
            />
            <h1 className="h1 mt-4 mb-6 max-w-lg font-semibold leading-tight">
              Explore the World with
              <span className="text-primary"> Placewise</span>
            </h1>
            <p className="mb-5 text-xl">
              Welcome to Placewise, your one-stop-shop for adventure, culture,
              and unforgettable experiences!
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg">
          <LocationEntry placeholder="Location" />

          <div className="w-full md:w-[48%] xl:w-[22%] flex pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
            <DatePicker
              placeholderText="Check In - Check Out"
              selectsRange={true}
              startDate={startDate}
              dateFormat="dd-MM-yyyy"
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="w-full bg-[var(--bg-1)] p-3 rounded-full focus:outline-none"
            />
            <CalendarDaysIcon className="w-6 h-6 text-gray-600 shrink-0" />
          </div>
          <GuestDropdown />
          <HeroDropdown4 />
          <Link
            href="#"
            className="py-[14px] px-6 w-full flex justify-center xl:w-auto text-white bg-primary rounded-full">
            <SearchIcon />
          </Link>
        </div>
      </div>
      <ModalVideo
        channel="vimeo"
        isOpen={isOpen}
        videoId="779229876"
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Hero;
