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
import { useState, useEffect, Key, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StarIcon } from "@heroicons/react/20/solid";
import { Suspense } from "react";
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
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { UrlObject } from "url";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface CabDetails {
  created_at: string;  // Ensure it's a string
  banner_image_multiple: any;
  location: string;
  cab_name: string;
  description: string;
  price: number;
  sale_price: number;
  min_passenger: number;
  max_passenger: number;
  inclusions: string;
  exclusions: string;
  inclusion?: string[];
  exclusion?: string[];
  faqs?: string[]; // Assuming 'faqs' is an array of strings
}

interface CabSubForm {
  min_pax: number;
  max_pax: number;
  car_count: number;
  cargo_count: number;
  price: number;
}


const CabListingDetails = () => {
  const [cabDetails, setCabDetails] = useState<CabDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId");
  // const isDateSelected = selectedDate !== null;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "Cab",
    message: "",
  });

  const [cabSubForms, setCabSubForms] = useState<CabSubForm[]>([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState<number[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };



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
    // Fetch the API data
    const fetchCabSubForms = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/filter/cabsubforms/by-cab-main-form-id/${cabId}`
        );
        const data = await response.json();
        setCabSubForms(data); // Assuming the response is directly an array
      } catch (error) {
        console.error("Error fetching cab sub-forms:", error);
      }
    };

    fetchCabSubForms();
  }, []);


  const handleBook = (price: number, minPax: number, maxPax: number) => {
    setSelectedPrice(price);
    setDropdownOptions(Array.from({ length: maxPax - minPax + 1 }, (_, i) => i + minPax));
  };



  useEffect(() => {
    const fetchCabDetails = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/cab-main-forms/${cabId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cab details");
        }
        const data = await response.json();

        // Parse the FAQs if they are stringified
        if (data.faqs && typeof data.faqs === "string") {
          const parsedFAQs = JSON.parse(data.faqs);
          setCabDetails({ ...data, faqs: parsedFAQs });
        } else {
          setCabDetails(data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabDetails();
  }, [cabId]);





  const faqs = cabDetails?.faqs
    ? JSON.parse(cabDetails.faqs[0] || "[]") // Parse the FAQ string
    : [];


  // Process inclusions
  const inclusions = cabDetails?.inclusion || [];
  const exclusions = cabDetails?.exclusion || [];







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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/save_enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Enquiry submitted successfully!");
        setFormData({ name: "", phone: "", email: "", message: "", service_type: "Cab" });
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };


  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!selectedDate) {
      alert("please Select Date");
      return;
    }

    if (!accessToken) {
      router.push("/sign-in");
      return;
    }

    // Retrieve input values
    const hotelName = (document.querySelector('input[placeholder="Hotel Name"]') as HTMLInputElement)?.value || "";
    const selectedPax = (document.querySelector('select') as HTMLSelectElement)?.value || "";

    // Validate required fields
    if (!hotelName) {
      alert("Enter Hotel Name");
      return;
    }

    if (!selectedPax) {
      alert("Select Pax");
      return;
    }

    // Store booking details in localStorage
    const storedCabDetails = {
      hotelName,
      selectedDate: selectedDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      totalPrice: selectedPrice || 0,
      selectedPax,
    };
    localStorage.setItem("storedCabDetails", JSON.stringify(storedCabDetails));

    // Redirect to the payment page
    router.push(`/cab-payment?cabId=${cabId}`);
  };




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
                  {cabDetails.banner_image_multiple.map((image: (string | UrlObject) | StaticImport, index: Key | null | undefined) => {
                    // Check if the image is a valid string (for string URLs or StaticImport)
                    const imageUrl = typeof image === 'string' ? image : (image as UrlObject)?.href;

                    // If the image is invalid (undefined or null), skip rendering the image
                    if (!imageUrl) {
                      return null;
                    }

                    return (
                      <SwiperSlide key={index} className="swiper-slide">
                        <Link href="#" className="link property-gallery">
                          <div className="relative w-full" style={{ height: '500px', marginTop: '100px' }}>
                            {/* Fixed height for all images */}
                            <Image
                              layout="fill"  // Ensures the image fills the parent container
                              objectFit="cover" // Maintains aspect ratio while covering the container
                              src={imageUrl}    // Ensures the src is a valid string
                              alt={`cab-gallery`}
                              className=""
                            />
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}

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
                      inclusions.map((item: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
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
                  <h4 className="mb-5 text-2xl font-semibold">{cabDetails.cab_name}</h4>

                  <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                          <th className="py-3 px-2">Pax</th>
                          <th className="py-3 px-2">Car</th>
                          <th className="py-3 px-2">Cargo</th>
                          <th className="py-3 px-2">Cost</th>
                          <th className="py-3 px-2">Select</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cabSubForms.length > 0 ? (
                          cabSubForms.map((cab, index) => (
                            <tr
                              key={index}
                              className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                            >
                              <td className="py-3 px-2">
                                {cab.min_pax}-{cab.max_pax}
                              </td>
                              <td className="py-3 px-2">{cab.car_count}</td>
                              <td className="py-3 px-2">{cab.cargo_count}</td>
                              <td className="py-3 px-2">{cab.price}</td>
                              <td className="py-3 px-2">
                                <div className="col-span-12">
                                  <button
                                    onClick={() =>
                                      handleBook(
                                        Number(cab.price),
                                        Number(cab.min_pax),
                                        Number(cab.max_pax)
                                      )
                                    }
                                    className="btn-primary"
                                  >
                                    Book
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-3 px-2 text-center">
                              No Cab Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>


                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                  <h4 className="mb-0 text-2xl font-semibold">FAQ</h4>
                  <div className="hr-dashed my-5"></div>
                  {faqs.length > 0 ? (
                    faqs.map((faq: { question: string; answer: string }, index: number) => (
                      <div className="mb-6" key={index}>
                        <h6 className="font-semibold mb-2">{faq.question}</h6>
                        <p>{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <p>No FAQs available</p>
                  )}
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
                      {/* <div className="border rounded-full pr-3">
                        <select className="w-full bg-transparent px-5 py-3 focus:outline-none ">
                          <option>Latest</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                      </div> */}
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

                  <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
                    <Tab.List className="flex gap-3 about-tab mb-7">
                      <Tab className={({ selected }) => classNames("focus:outline-none", selected ? "text-primary font-medium" : "")}>
                        Booking Form
                      </Tab>
                      <span>|</span>
                      <Tab className={({ selected }) => classNames("focus:outline-none", selected ? "text-primary font-medium" : "")}>
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
                                <option value="" disabled>
                                  Select Pax
                                </option>
                                {dropdownOptions.map((num) => (
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
                        <div className="flex items-center justify-between mb-[10px]">
                          <p className="mb-0 clr-neutral-500"> Total Price </p>
                          <p className="mb-0 font-medium"> ₹{selectedPrice || 0} </p>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name..."
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-full bg-[var(--bg-1)] border focus:outline-none py-2 px-3"
                            required
                          />
                          <input
                            type="number"
                            name="phone"
                            placeholder="Phone..."
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-full bg-[var(--bg-1)] border focus:outline-none py-2 px-3"
                            required
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email..."
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-full bg-[var(--bg-1)] border focus:outline-none py-2 px-3"
                            required
                          />
                          <textarea
                            name="message"
                            placeholder="Message..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            className="w-full rounded-3xl bg-[var(--bg-1)] border focus:outline-none py-2 px-3"
                          ></textarea>
                          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-full">
                            Submit
                          </button>
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>

                  {selectedIndex === 0 && (
                    <Link
                      href={`cab-payment?cabId=${cabId}`}
                      className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6"
                      onClick={handleBookingClick}  // Use the new function here
                    >
                      <span className="inline-block"> Proceed Booking </span>
                    </Link>
                  )}

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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CabListingDetails />
  </Suspense>
);

export default Page;
