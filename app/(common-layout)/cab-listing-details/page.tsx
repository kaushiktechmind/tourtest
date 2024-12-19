"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import Link from "next/link";
import ModalVideo from "react-modal-video";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  ArrowLongLeftIcon,
  ArrowRightIcon,
  ArrowLongRightIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  HandThumbUpIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import ReactPlayer from "react-player";
import { PlayIcon } from "@/public/data/icons";
import { Tab } from "@headlessui/react";
import CheckboxCustom from "@/components/Checkbox";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface CabDetails {
  location: string;
  cab_name: string;
  description: string;
  price: number;
  sale_price: number;
  min_passenger: number;
  max_passenger: number;
  inclusions: string;
  exclusions: string;
  // Add more fields as needed from the API response
}


const Page = () => {
  const [cabDetails, setCabDetails] = useState<CabDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;


  const [isOpen, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent the default link behavior
    setIsExpanded(!isExpanded);
  };

  const getShortDescription = (content: string, limit: number) => {
    return content.split(" ").length > limit
      ? content.split(" ").slice(0, limit).join(" ") + "..."
      : content;
  };





  useEffect(() => {
    const fetchCabDetails = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/cab-main-forms/48"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cab details");
        }
        const data = await response.json();
        setCabDetails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabDetails();
  }, []);


  // Process inclusions
  const inclusions = cabDetails?.inclusion
    ? JSON.parse(cabDetails.inclusion[0]).map((item: string) => item.trim())
    : [];

  // Process exclusions
  const exclusions = cabDetails?.exclusion
    ? JSON.parse(cabDetails.exclusion[0]).map((item: string) => item.trim())
    : [];


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric", // Use full numeric year
    }).format(date);
  };


  if (loading) {
    return <div>Loading cab details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cabDetails) {
    return <div>No cab details available.</div>;
  }



  return (
    <>
    <section className="">
     
      <div >
        <div >
          {/* Only render the Swiper if cabDetails and banner_image_multiple are available */}
          {cabDetails?.banner_image_multiple?.length > 0 && (
            <Swiper
              loop={true}
              slidesPerView="auto"
              spaceBetween={16}
              centeredSlides={true}
              centeredSlidesBounds={true}
              navigation={{
                nextEl: ".btn-next",
                prevEl: ".btn-prev",
              }}
              breakpoints={{
                576: {
                  slidesPerView: 2.25,
                },
                768: {
                  slidesPerView: 2.5,
                },
                1200: {
                  slidesPerView: 3.25,
                },
              }}
              modules={[Navigation]}
              className="swiper property-gallery-slider"
            >
              <div className="swiper-wrapper property-gallery-slider">
                {/* Dynamically render SwiperSlide from banner_image_multiple */}
                {cabDetails.banner_image_multiple.map((image, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <Link href={image} className="link property-gallery">
                      <div className="relative w-full" style={{ height: '500px', marginTop: '100px' }}> {/* Fixed height for all images */}
                        <Image
                          layout="fill"  // Ensures the image fills the parent container
                          objectFit="cover" // Maintains aspect ratio while covering the container
                          src={image}
                          alt={`cab-gallery-${index + 1}`}
                          className=""
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </div>
              <button className="btn-prev absolute top-[45%] left-4 z-[1] bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white duration-300">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button className="btn-next absolute top-[45%] right-4 z-[1] bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white duration-300">
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </Swiper>
          )}
        </div>
      </div>
    </section>

      <div className="bg-[var(--bg-2)] pt-10 lg:pt-14 px-3">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 xl:col-span-8">
              <div className="bg-white p-5 rounded-2xl mb-10">
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border rounded-2xl mb-10">

                  <h2 className="mt-4 mb-8 h2"> {cabDetails.cab_name}</h2>
                  <ul className="flex flex-wrap items-center justify-between gap-4 gap-md-0">
                    <li>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-[var(--secondary-500)]" />
                        <p className="mb-0"> {cabDetails.location}</p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <p className="mb-0">
                        Min Passanger <span className="text-primary"> {cabDetails.min_passenger}</span>
                      </p>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-1">
                        Max Passanger <span className="text-primary"> {cabDetails.max_passenger}</span>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <p className="mb-0">
                        <span className="clr-neutral-500">Published:</span>{" "}
                        {formatDate(cabDetails.created_at)}
                      </p>
                    </li>
                  </ul>
                  {/* <div className="border border-dashed my-8"></div>
                  <ul className="flex flex-wrap items-center justify-between gap-4 gap-md-0">
                    <li>
                      <div className="flex items-center gap-2">
                        <i className="text-[var(--secondary-500)] text-2xl las la-user-friends"></i>
                        <p className="mb-0"> 8 People </p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-2">
                        <i className="text-[var(--secondary-500)] text-2xl las la-gas-pump"></i>
                        <p className="mb-0"> Hybrid </p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-2">
                        <i className="text-[var(--secondary-500)] text-2xl las la-tachometer-alt"></i>
                        <p className="mb-0"> 6.1 km/ 1-litre </p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-2">
                        <i className="text-[var(--secondary-500)] text-2xl las la-tachometer-alt"></i>
                        <p className="mb-0"> Automatic </p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-2">
                        <i className="text-[var(--secondary-500)] text-2xl las la-calendar-alt"></i>
                        <p className="mb-0"> 9 Bags </p>
                      </div>
                    </li>
                  </ul> */}
                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                  <h4 className="mb-5 text-2xl font-semibold">Description</h4>
                  <p className="mb-5 clr-neutral-500">
                    {isExpanded
                      ? cabDetails.description
                      : getShortDescription(cabDetails.description, 50)} {/* Adjust limit as needed */}
                  </p>
                  <Link
                    href="#"
                    onClick={toggleExpand}
                    className="link flex items-center gap-2 text-primary"
                  >
                    <span className="font-semibold inline-block">
                      {isExpanded ? "Read Less" : "Read More"}
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">Inclusions & Exclusions</h4>
                  <div className="border border-dashed my-5"></div>

                  {/* Inclusions */}
                  <h6 className="mb-4 font-semibold">Inclusions</h6>
                  <ul className="flex flex-col gap-4 mb-10">
                    {inclusions.length > 0 ? (
                      inclusions.map((item, index) => (
                        <li key={index}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">{item}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>Not Available</li>
                    )}
                  </ul>

                  {/* Exclusions */}
                  <h6 className="mb-4 font-semibold">Exclusions</h6>
                  <ul className="flex flex-col gap-4 mb-10">
                    {exclusions.length > 0 ? (
                      exclusions.map((item, index) => (
                        <li key={index}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                              <i className="las la-times text-xl text-[#9C742B]"></i>
                            </div>
                            <span className="inline-block">{item}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>Not Available</li>
                    )}
                  </ul>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border rounded-2xl mb-10">
                  <h4 className="mb-5 text-2xl font-semibold">
                    {" "}
                    Driver and Cab details{" "}
                  </h4>
                  <ul className="flex flex-col gap-4 mb-5">
                    <li>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                          <i className="las la-check text-lg text-primary"></i>
                        </div>
                        <span className="inline-block">
                          Driver Name and Photo: We&apos;ve the driver&apos;s
                          name and photo, so you don&apos;t afraid arrive tour.
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                          <i className="las la-check text-lg text-primary"></i>
                        </div>
                        <span className="inline-block">
                          License plate number and car model: You will receive
                          the license plate number and car model of your
                          driver&apos;s vehicle. This will help you identify the
                          correct cab and ensure that you are getting into the
                          right car.
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                          <i className="las la-check text-lg text-primary"></i>
                        </div>
                        <span className="inline-block">
                          Driver rating: You will also be able to view your
                          driver&apos;s rating from other passengers. This
                          rating is based on their driving and customer service
                          skills and can help you determine the quality of your
                          ride.
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                          <i className="las la-check text-lg text-primary"></i>
                        </div>
                        <span className="inline-block">
                          Contact information: You will be provided with the
                          driver&apos;s phone number, so you can contact them if
                          needed.
                        </span>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="link flex items-center gap-2 text-primary">
                    <span className="font-semibold inline-block">
                      Read More
                    </span>
                    <ArrowLongRightIcon className="w-5 h-5" />
                  </Link>
                </div>



                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">FAQ</h4>
                  <div className="hr-dashed my-5"></div>


                  <div className="mb-6">
                    <h6 className="font-semibold mb-2">sdss</h6>
                    <p>sdsdsd</p>
                  </div>


                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-white rounded-2xl">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Link
                      href="#"
                      className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-1">
                      <ArrowLongLeftIcon className="w-5 h-5" />
                      <span className="inline-block font-semibold">
                        Prev Cab
                      </span>
                    </Link>
                    <ul className="flex flex-wrap gap-3 justify-center order-3 flex-grow md:order-2">
                      <li>
                        <Link
                          href="#"
                          className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                          <i className="lab text-xl la-facebook-f"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                          <i className="lab text-xl la-twitter"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                          <i className="lab text-xl la-linkedin-in"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="link grid place-content-center w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                          <i className="lab text-xl la-dribbble"></i>
                        </Link>
                      </li>
                    </ul>
                    <Link
                      href="#"
                      className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-2">
                      <span className="inline-block font-semibold">
                        Next Cab
                      </span>
                      <ArrowLongRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5 mb-10 lg:mb-14">
                  <div className="flex items-center gap-4 justify-between flex-wrap mb-10">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <h3 className="mb-0 h3"> 4.7 (21 reviews) </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="mb-0 clr-neutral-500 shrink-0">
                        {" "}
                        Sort By :{" "}
                      </p>
                      <div className="border rounded-full pr-3">
                        <select className="w-full bg-transparent px-5 py-3 focus:outline-none ">
                          <option>Latest</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-2)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
                    <div className="flex items-center flex-wrap justify-between gap-4 ">
                      <div className="flex gap-5 items-center">
                        <div className="w-15 h-15 shrink-0 rounded-full overflow-hidden">
                          <Image
                            width={60}
                            height={60}
                            src="/img/user-1.jpg"
                            alt="image"
                            className=" w-full h-full object-fit-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="mb-1 font-semibold"> Kiss Laura </h5>
                          <p className="mb-0 clr-neutral-500">
                            {" "}
                            Product Designer{" "}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm-end">
                        <p className="mb-1"> 09:01 am </p>
                        <p className="mb-0"> Mar 03, 2023 </p>
                      </div>
                    </div>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex gap-1 mb-3">
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                    </div>
                    <p className="mb-0 clr-neutral-500">
                      I highly recommend [real estate agent&apos;s name] as a
                      professional and knowledgeable real estate agent. They
                      provided valuable guidance throughout the selling process
                    </p>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex flex-wrap items-center gap-10 mb-6">
                      <div className="flex items-center gap-2 text-primary">
                        <HandThumbUpIcon className="w-5 h-5" />
                        <span className="inline-block"> 178 </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="inline-block"> Reply </span>
                      </div>
                    </div>
                    <div className="flex gap-5 items-center">
                      <div className="w-15 h-15 shrink-0 rounded-full overflow-hidden">
                        <Image
                          width={60}
                          height={60}
                          src="/img/user-2.jpg"
                          alt="image"
                          className=" w-full h-full object-fit-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <input
                          className="border text-base py-4 px-5 rounded-full focus:outline-none w-full"
                          type="text"
                          placeholder="Join the discussion"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-2)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
                    <div className="flex items-center flex-wrap justify-between gap-4">
                      <div className="flex gap-5 items-center">
                        <div className="w-15 h-15 shrink-0 rounded-full overflow-hidden">
                          <Image
                            width={60}
                            height={60}
                            src="/img/user-3.jpg"
                            alt="image"
                            className=" w-full h-full object-fit-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="mb-1 font-semibold">
                            {" "}
                            Kristin Watson{" "}
                          </h5>
                          <p className="mb-0 clr-neutral-500">
                            {" "}
                            Product Designer{" "}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm-end">
                        <p className="mb-1"> 09:01 am </p>
                        <p className="mb-0"> Mar 03, 2023 </p>
                      </div>
                    </div>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex gap-1 mb-3">
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                    </div>
                    <p className="mb-0 clr-neutral-500">
                      I highly recommend [real estate agent&apos;s name] as a
                      professional and knowledgeable real estate agent. They
                      provided valuable guidance throughout the selling process
                    </p>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex flex-wrap items-center gap-10">
                      <div className="flex items-center gap-2 text-primary">
                        <HandThumbUpIcon className="w-5 h-5" />
                        <span className="inline-block"> 178 </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="inline-block"> Reply </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-2)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
                    <div className="flex items-center flex-wrap justify-between gap-4">
                      <div className="flex gap-5 items-center">
                        <div className="w-15 h-15 shrink-0 rounded-full overflow-hidden">
                          <Image
                            width={60}
                            height={60}
                            src="/img/user-4.jpg"
                            alt="image"
                            className=" w-full h-full object-fit-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="mb-1 font-semibold">
                            {" "}
                            Marvin McKinney{" "}
                          </h5>
                          <p className="mb-0 clr-neutral-500">
                            {" "}
                            Product Designer{" "}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm-end">
                        <p className="mb-1"> 09:01 am </p>
                        <p className="mb-0"> Mar 03, 2023 </p>
                      </div>
                    </div>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex gap-1 mb-3">
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                    </div>
                    <p className="mb-0 clr-neutral-500">
                      I highly recommend [real estate agent&apos;s name] as a
                      professional and knowledgeable real estate agent. They
                      provided valuable guidance throughout the selling process
                    </p>
                    <div className="border border-dashed my-6"></div>
                    <div className="flex flex-wrap items-center gap-10">
                      <div className="flex items-center gap-2 text-primary">
                        <HandThumbUpIcon className="w-5 h-5" />
                        <span className="inline-block"> 178 </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="inline-block"> Reply </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="featured-tab link font-semibold clr-primary-400 inline-block py-3 px-6 bg-[var(--primary-light)] hover:bg-primary hover:text-white rounded-full active">
                    See All Reviews
                  </Link>
                </div>

                <div className="mb-10 lg:mb-14">
                  <div className="bg-white rounded-2xl py-8 px-5">
                    <h4 className="mb-0 text-2xl font-semibold">
                      Write a review
                    </h4>
                    <div className="border border-dashed my-6"></div>
                    <p className="text-xl font-medium mb-3">Rating *</p>
                    <div className="flex gap-1 mb-3">
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                    </div>
                    <form action="#">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                          <label
                            htmlFor="review-name"
                            className="text-xl font-medium block mb-3">
                            Name *
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                            placeholder="Enter Name.."
                            id="review-name"
                          />
                        </div>
                        <div className="col-span-12">
                          <label
                            htmlFor="review-email"
                            className="text-xl font-medium block mb-3">
                            Email *
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                            placeholder="Enter Email.."
                            id="review-email"
                          />
                        </div>
                        <div className="col-span-12">
                          <label
                            htmlFor="review-review"
                            className="text-xl font-medium block mb-3">
                            Review *
                          </label>
                          <textarea
                            id="review-review"
                            rows={5}
                            className="bg-[var(--bg-1)] border rounded-2xl py-3 px-5 w-full focus:outline-none"></textarea>
                        </div>
                        <div className="col-span-12">
                          <Link href="#" className="btn-primary">
                            Submit Review
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4">
              <div className="section-space--sm pb-0 mb-6 relative">
                <div className="bg-white rounded-2xl py-8 px-6">
                  <p className="mb-3 text-lg font-medium"> Price </p>
                  <div className="flex items-start gap-2 mb-6">
                    <div className="flex gap-3 items-center">
                      <i className="las la-tag text-2xl"></i>
                      <p className="mb-0"> From </p>
                      <h6 className="line-through text-gray-500">₹{cabDetails.price}</h6>
                      <h3 className="h3 mb-0">
                        {" "}

                        ₹{cabDetails.sale_price}{" "}
                      </h3>
                    </div>
                  </div>

                  <Tab.Group>
                    <Tab.List className="flex gap-3 about-tab mb-7">
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "focus:outline-none",
                            selected ? "text-primary font-medium" : ""
                          )
                        }>
                        Booking Form
                      </Tab>{" "}
                      <span>|</span>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "focus:outline-none",
                            selected ? "text-primary font-medium" : ""
                          )
                        }>
                        Enquiry Form
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="tab-content">
                      <Tab.Panel>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="col-span-1">
                            <div className="w-full flex">
                              <input
                                type="text"
                                className="flex-grow focus:outline-none bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full py-3 px-5"
                                placeholder="Hotel Name"
                              />
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-map-marker-alt"></i>
                              </span>
                            </div>
                          </div>

                           <div className="col-span-1">
                                                    <div className="w-full flex">
                                                      <DatePicker
                                                        placeholderText="Select Date"
                                                        selected={selectedDate}
                                                        dateFormat="dd-MM-yyyy"
                                                        onChange={(date) => setSelectedDate(date)}
                                                        className="bg-[var(--bg-2)] w-[330px] border border-r-0 border-neutral-40 rounded-s-full py-[14px] text-gray-500 ps-4 focus:outline-none"
                                                      />
                                                      <span className="bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-3 text-gray-500 pe-4 ps-0">
                                                        <i className="las text-2xl la-calendar-alt"></i>
                                                      </span>
                                                    </div>
                                                  </div>
                          <div className="col-span-1">
                            <div className="w-full flex">
                              <select
                                className="flex-grow focus:outline-none bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5 text-gray-500 appearance-none"
                                defaultValue=""
                              >

                                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-users"></i>
                              </span>
                            </div>
                          </div>


                        </div>

                        <div className="hr-dashed my-4"></div>
                        <div className="flex items-center justify-between">
                          <p className="mb-0 clr-neutral-500"> Total Price </p>
                          <p className="mb-0 font-medium"> $1025 </p>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <form className="flex flex-col gap-5">
                          <input
                            type="text"
                            placeholder="Name..."
                            className="w-full rounded-full bg-[var(--bg-1)] border focus:outline-none py-2 px-3 md:py-3 md:px-4"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email..."
                            className="w-full rounded-full bg-[var(--bg-1)] border focus:outline-none py-2 px-3 md:py-3 md:px-4"
                            required
                          />
                          <textarea
                            rows={6}
                            placeholder="Message..."
                            className="w-full rounded-3xl bg-[var(--bg-1)] border focus:outline-none py-2 px-3 md:py-3 md:px-4"></textarea>
                          <CheckboxCustom label="I agree with Terms of Service and Privacy Statement" />
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>

                  <Link
                    href="#"
                    className="link inline-flex items-center gap-2 mt-6 lg:mt-8 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6">
                    <span className="inline-block"> Proceed Booking </span>
                  </Link>
                  <ul className="flex justify-center gap-3 flex-wrap">
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/paypal.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/payoneer.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/visa.png"
                        alt="image"
                        className=""
                      />
                    </li>
                    <li>
                      <Image
                        width={83}
                        height={34}
                        src="/img/master-card.png"
                        alt="image"
                        className=""
                      />
                    </li>
                  </ul>
                </div>
              </div>
              {/* <div className="bg-white rounded-2xl py-8 px-6">
                <div className="w-32 h-32 border border-[var(--primary)] rounded-full bg-white p-4 grid place-content-center relative mx-auto mb-10">
                  <Image
                    width={96}
                    height={96}
                    src="/img/team-1.jpg"
                    alt="image"
                    className="rounded-full"
                  />
                  <div className="w-8 h-8 grid place-content-center rounded-full border-2 white text-white bg-primary absolute bottom-0 right-0">
                    <CheckIcon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-center text-2xl font-semibold mb-4">
                  {" "}
                  Savannah Nguyen{" "}
                </h4>
                <ul className="flex items-center gap-3 justify-center flex-wrap mb-7">
                  <li>
                    <p className="mb-0">
                      ID: <span className="text-primary">235</span>
                    </p>
                  </li>
                  <li className="text-primary text-lg">•</li>
                  <li>
                    <p className="mb-0"> Property: 24 </p>
                  </li>
                  <li className="text-primary text-lg">•</li>
                  <li>
                    <div className="flex gap-1 items-center">
                      <i className="las la-star text-[var(--tertiary)]"></i>
                      <p className="mb-0"> 4.8 </p>
                    </div>
                  </li>
                </ul>
                <ul className="flex justify-center flex-wrap gap-3">
                  <li>
                    <Link
                      href="#"
                      className="link grid place-content-center duration-300 w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                      <i className="lab la-facebook-f text-xl"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="link grid place-content-center duration-300 w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                      <i className="lab la-twitter text-xl"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="link grid place-content-center duration-300 w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                      <i className="lab la-instagram text-xl"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="link grid place-content-center duration-300 w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                      <i className="lab la-linkedin-in text-xl"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="link grid place-content-center duration-300 w-9 h-9 rounded-full bg-[var(--primary-light)] text-primary hover:bg-primary hover:text-white">
                      <i className="lab la-dribbble text-xl"></i>
                    </Link>
                  </li>
                </ul>
                <div className="border border-dashed my-7"></div>
                <ul className="flex flex-col gap-4 mb-10 max-text-30 mx-auto">
                  <li>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-5 h-5 text-primary" />
                      <p className="mb-0"> Joined in June 2018 </p>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-[var(--secondary)]" />
                      <p className="mb-0"> Response rate - 100% </p>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-[var(--tertiary)]" />
                      <p className="mb-0"> Fast response </p>
                    </div>
                  </li>
                </ul>
                <div className="text-center">
                  <Link href="#" className="btn-outline  font-semibold">
                    See Host Profile
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
