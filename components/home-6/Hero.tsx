import { SearchIcon } from "@/public/data/icons";
import arrow from "@/public/img/hero-flight/arrow.png";
import flight from "@/public/img/hero-flight/flight.png";
import HeroFlightImg1 from "@/public/img/hero-flight/img-1.png";
import HeroFlightImg2 from "@/public/img/hero-flight/img-2.png";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalVideo from "react-modal-video";
import SubHeadingBtn from "../SubHeadingBtn";
import ClassEntry from "./ClassEntry";
import LocationEntry from "./LocationEntry";
import SelectPeople from "./SelectPeople";

const Hero = () => {
  const [isOpen, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);

  return (
    <section className="relative px-3 xl:px-0">
      <div className="w-[500px] h-[540px] lg:w-[638px] lg:h-[700px] absolute max-xl:hidden right-4 top-0 xxl:right-10 3xl:right-[10%] grid grid-cols-2 gap-6">
        <div className="col-span-1 flex flex-col gap-5 ">
          <Image src={arrow} className="self-end mt-6" alt="img" />
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
              Book Your Next Flight with Ease
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
                defaultChecked={true}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="one">One Way</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="round"
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="round">Round Trip</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="multi"
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="multi">Multi City</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 mt-6">
            <LocationEntry placeholder="From" />
            <LocationEntry placeholder="To" />
            <div className="w-full md:w-[48%] xxl:w-[17%] flex pl-2 pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
              <DatePicker
                selected={startDate}
                onChange={(date: any) => setStartDate(date)}
                placeholderText="Depart Date"
                className="w-full bg-[var(--bg-1)] p-2 rounded-full focus:outline-none"
              />
              <CalendarDaysIcon className="w-5 h-5 text-gray-600 shrink-0" />
            </div>
            <ClassEntry />
            <SelectPeople />
            <Link
              href="#"
              className="py-[14px] px-6 w-full flex justify-center md:w-auto text-white bg-primary rounded-full">
              <SearchIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
