import { SearchIcon } from "@/public/data/icons";
import HeroHotelImg1 from "@/public/img/hero-hotel/img-1.png";
import HeroHotelImg2 from "@/public/img/hero-hotel/img-2.png";
import HeroHotelImg3 from "@/public/img/hero-hotel/img-3.png";
import HeroHotelImg4 from "@/public/img/hero-hotel/rounded-1.png";
import HeroHotelImg5 from "@/public/img/hero-hotel/rounded-2.png";
import hotelheroel1 from "@/public/img/hotel-hero-el-1.png";
import hotelheroel2 from "@/public/img/hotel-hero-el-2.png";
import hotelheroel3 from "@/public/img/hotel-hero-el-3.png";
import hotelheroel4 from "@/public/img/hotel-hero-el-4.png";
import hotelheroel5 from "@/public/img/hotel-hero-el-5.png";
import videoimg from "@/public/img/video-img.png";
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

const Hero = () => {
  const [isOpen, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="relative py-[60px] lg:pt-[80px] lg:pb-[100px]">
      <div className="absolute top-0 right-0 xxl:right-[5%] 4xl:right-[8%] w-[500px] h-[470px] xxl:w-[684px] xxl:h-[638px] grid grid-cols-2 gap-4 xxl:gap-6 max-lg:hidden">
        <div className="col-span-1 flex flex-col gap-4 xxl:gap-6">
          <div className="relative">
            <Image
              className="rounded-lg"
              src={HeroHotelImg1}
              alt="hero image"
            />
            <Image
              width={100}
              height={100}
              className="absolute -left-12 top-1/2 -translate-y-1/2 rounded-full border-[5px] border-white"
              src={HeroHotelImg4}
              alt="hero image"
            />
          </div>
          <div>
            <Image
              className="rounded-lg"
              src={HeroHotelImg2}
              alt="hero image"
            />
          </div>
        </div>
        <div className="col-span-1 flex items-end">
          <div className="relative bottom-14">
            <Image
              className="rounded-lg"
              src={HeroHotelImg3}
              alt="hero image"
            />
            <Image
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full border-[5px] border-white"
              src={HeroHotelImg5}
              alt="hero image"
            />
          </div>
        </div>
      </div>

      <Image
        src={hotelheroel1}
        alt="image"
        className="hidden xl:block absolute bottom-10 right-10"
      />
      <Image
        src={hotelheroel2}
        alt="image"
        className="hidden xl:block absolute bottom-10 left-10"
      />
      <Image
        src={hotelheroel3}
        alt="image"
        className="hidden xl:block absolute top-14 left-[48%]"
      />
      <Image
        src={hotelheroel4}
        alt="image"
        className="hidden xl:block absolute top-[2.75rem] left-[4.87rem]"
      />
      <Image
        src={hotelheroel5}
        alt="image"
        className="hidden xl:block absolute top-[17.5rem] left-[40%]"
      />

      <div className="container px-3 lg:pb-32 relative">
        <span
          onClick={() => setOpen(true)}
          className="video-popup cursor-pointer hidden lg:block absolute top-0 lg:right-4">
          <Image src={videoimg} alt="image" className="" />
        </span>
        <div className="grid grid-cols-12 ">
          <div className="col-span-12 lg:col-span-8 xl:col-span-6">
            <SubHeadingBtn text="Book Your Dream Vacation" classes="bg-white" />

            <h1 className="h1 font-semibold mt-4 leading-tight mb-6">
              Find the Best Hotel Deals with us
            </h1>
            <p className="mb-10 text-xl">
              Welcome to our hotel booking website, where you can easily find
              the perfect hotel for your next trip.
            </p>
          </div>
        </div>


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
        videoId="115041822"
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Hero;
