"use client";
import React, { useRef } from "react";
import { Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  HeartIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import CheckboxCustom from "@/components/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}


interface PackageData {
  banner_image: any;
  id: number;
  location_name: string;
  package_title: string;
  package_content: string;
  youtube_video_link: string;
  duration: string;
  tour_min_people: string;
  tour_max_people: string;
  pickup_point: string;
  amenities: string;
  package_includes: string; // JSON string
  package_excludes: string; // JSON string
  package_faqs: string;
}


const Page = () => {
  const [selectedAdults, setSelectedAdults] = useState(0);
  const [selectedChildren1, setSelectedChildren1] = useState(0);
  const [selectedChildren2, setSelectedChildren2] = useState(0);
  const [selectedChildren3, setSelectedChildren3] = useState(0);
  const [selectedInfants1, setSelectedInfants1] = useState(0);
  const [selectedInfants2, setSelectedInfants2] = useState(0);
  const datePickerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });


  const [selectedIndex, setSelectedIndex] = useState(0);

  // Function to handle the tab change and update the selectedIndex
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };



  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

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


  const [itineraryData, setItineraryData] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!packageId) return; // Add a check to make sure packageId is not null
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/get_package_by_id/${packageId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch package data");
        }
        const data = await response.json();

        // Parse the itinerary string to an array of objects
        const itinerary = JSON.parse(data.itinerary || "[]");
        setPackageData(data);
        setItineraryData(itinerary); // Set the parsed itinerary data

        const min1 = Number(data.person_min1 || 0);
        setSelectedAdults(min1);

        const min2 = Number(data.person_min2 || 0);
        setSelectedChildren1(min2);

        const min3 = Number(data.person_min3 || 0);
        setSelectedChildren2(min3);

        const min4 = Number(data.person_min4 || 0);
        setSelectedChildren3(min4);

        const min5 = Number(data.person_min5 || 0);
        setSelectedInfants1(min5);

        const min6 = Number(data.person_min6 || 0);
        setSelectedInfants2(min6);
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    fetchPackageData();
  }, [packageId]);


  // Conditional rendering to ensure packageData is not null before accessing its properties
  if (!packageData) {
    return <p>Loading...</p>;
  }

  const amenitiesArray = JSON.parse(packageData.amenities);
  const inclusions = packageData ? JSON.parse(packageData.package_includes) : [];
  const exclusions = packageData ? JSON.parse(packageData.package_excludes) : [];
  const faqs = packageData ? JSON.parse(packageData.package_faqs) : [];



  // Calculate the total price based on the selections
  const calculateTotalPrice = () => {
    const adultPrice = packageData.person_type_price1;
    const childPrice1 = packageData.person_type_price2;
    const childPrice2 = packageData.person_type_price3;
    const childPrice3 = packageData.person_type_price4;
    const infantPrice1 = packageData.person_type_price5;
    const infantPrice2 = packageData.person_type_price6;

    return (selectedAdults * adultPrice) + (selectedChildren1 * childPrice1) + (selectedChildren2 * childPrice2) + (selectedChildren3 * childPrice3) + (selectedInfants1 * infantPrice1) + (selectedInfants2 * infantPrice2);
  };


  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent the default anchor navigation behavior

    const accessToken = localStorage.getItem("access_token");

    if (!isDateSelected) {
      alert("Please Select Date");
      return; // Stop execution here if date is not selected
    }

    if (!accessToken) {
      router.push("/sign-in"); // Redirect to sign-in page if access token is missing
      return; // Stop execution here if access token is not found
    }

    // Calculate package data and store it in localStorage
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newPackageData = {
      date: formattedDate,
      adult: selectedAdults.toString(),
      child1: selectedChildren1.toString(),
      child2: selectedChildren2.toString(),
      child3: selectedChildren3.toString(),
      infant1: selectedInfants1.toString(),
      infant2: selectedInfants2.toString(),
      adultPrice: packageData.person_type_price1 * selectedAdults,
      childPrice1: packageData.person_type_price2 * selectedChildren1,
      childPrice2: packageData.person_type_price3 * selectedChildren2,
      childPrice3: packageData.person_type_price4 * selectedChildren3,
      infantPrice1: packageData.person_type_price5 * selectedInfants1,
      infantPrice2: packageData.person_type_price6 * selectedInfants2,
      totalPrice: calculateTotalPrice(),
    };

    localStorage.setItem("packageData", JSON.stringify([newPackageData]));
    router.push(`/package-payment?packageId=${packageId}`); // Navigate to the next page
  };

  const min1 = Number(packageData.person_min1);
  const max1 = Number(packageData.person_max1);
  const min2 = Number(packageData.person_min2);
  const max2 = Number(packageData.person_max2);
  const min3 = Number(packageData.person_min3);
  const max3 = Number(packageData.person_max3);
  const min4 = Number(packageData.person_min4);
  const max4 = Number(packageData.person_max4);
  const min5 = Number(packageData.person_min5);
  const max5 = Number(packageData.person_max5);
  const min6 = Number(packageData.person_min6);
  const max6 = Number(packageData.person_max6);

  // console.log(min1, min2, min3, min4, min5, min6, max1, max2, max3, max4, max5, max6);


  const handleRestrict = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access_token");


    if (!accessToken) {
      router.push("/sign-in");
      return; // Exit if no accessToken is found
    }

    router.push(`/package-payment?packageId=${packageId}`);
  };


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
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };




  return (
    <main>
      <div className="bg-[var(--bg-2)]">
        <div className="py-4">
          <div className="px-3">
            <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[70px]">
              {/* Left Column */}
              <div className="col-span-12 xl:col-span-4">
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  {/* Image 1 */}
                  <div className="col-span-12 sm:col-span-6 xl:col-span-12">
                    <div className="h-[288px]"> {/* Consistent height */}
                      <Link
                        href="/img/tour-details-img-4.jpg"
                        className="link property-gallery">
                        <Image
                          width={610}
                          height={288}
                          src={packageData.banner_image[0]}
                          alt="image"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </Link>
                    </div>
                  </div>
                  {/* Button and Image */}
                  <div className="col-span-12 sm:col-span-6 xl:col-span-12 relative h-[288px]">
                    <Link
                      href="#"
                      className="absolute btn-outline bottom-6 bg-white border-none left-6">
                      <PhotoIcon className="w-6 h-6" />
                      See All Images
                    </Link>
                    <Link
                      href="/img/tour-details-img-2.jpg"
                      className="link property-gallery">
                      <Image
                        width={610}
                        height={288}
                        src={packageData.banner_image[1]}
                        alt="image"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Center Column */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <Link
                  href="/img/tour-details-img-3.jpg"
                  className="link block property-gallery h-full"> {/* Combined height */}
                  <Image
                    width={610}
                    height={576}
                    src={packageData.banner_image[2]}
                    alt="image"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </Link>
              </div>

              {/* Right Column */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  {/* Image 4 */}
                  <div className="col-span-12 h-[288px]"> {/* Ensure consistent height */}
                    <Link
                      href="/img/tour-details-img-4.jpg"
                      className="link property-gallery">
                      <Image
                        width={610}
                        height={288}
                        src={packageData.banner_image[3]}
                        alt="image"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </Link>
                  </div>
                  {/* Image 5 */}
                  <div className="col-span-12 sm:col-span-6 h-[288px]">
                    <Link
                      href="/img/tour-details-img-5.jpg"
                      className="link property-gallery">
                      <Image
                        width={293}
                        height={288}
                        src={packageData.banner_image[4]}
                        alt="image"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </Link>
                  </div>
                  {/* Image 6 */}
                  <div className="col-span-12 sm:col-span-6 h-[288px]">
                    <Link
                      href="/img/tour-details-img-6.jpg"
                      className="link property-gallery">
                      <Image
                        width={293}
                        height={288}
                        src={packageData.banner_image[5]}
                        alt="image"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-[30px] lg:py-[60px] px-3">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 xl:col-span-8">
              <div>
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                      <h2 className="h2 m-0"> {packageData.package_title}  </h2>
                    </div>
                    <ul className="columns-1 md:columns-2 lg:columns-3 pt-4 border-t border-dashed gap-md-0">
                      <li className="py-2">
                        <p className="mb-0">
                          Location:
                          <span className="text-primary">{packageData.location_name}</span>
                        </p>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Min People:{" "}
                            <span className="text-primary">{packageData.tour_max_people}</span>
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Max People:{" "}
                            <span className="text-primary">{packageData.tour_min_people}</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                    <ul className="columns-1 md:columns-2 lg:columns-3">
                      <li className="py-2">
                        <p className="mb-0">
                          Duration:
                          <span className="text-primary">{packageData.duration}</span>
                        </p>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Pickup Point:{" "}
                            <span className="text-primary">{packageData.pickup_point}</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-5 text-2xl font-semibold">Description</h4>
                    <p className="mb-5 clr-neutral-500">
                      {isExpanded
                        ? packageData.package_content
                        : getShortDescription(packageData.package_content, 50)} {/* Adjust limit as needed */}
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
                    <h4 className="mb-5 text-2xl font-semibold">Attributes</h4>
                    <div className="grid grid-cols-12 gap-4">
                      {(amenitiesArray && amenitiesArray.length > 0) ? (
                        amenitiesArray.slice(0, 4).map((amenity, index) => (
                          <div className="col-span-12 md:col-span-4 lg:col-span-3" key={index}>
                            <ul className="flex flex-col gap-4">
                              <li>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                    <i className="las la-check text-lg text-primary"></i>
                                  </div>
                                  <span className="inline-block">{amenity}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p>
                          Not Available
                        </p>
                      )}
                    </div>
                  </div>


                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-6 text-2xl font-semibold"> Itinerary </h4>
                    <div>
                      {itineraryData.length > 0 && (
                        <ul className="flex flex-col gap-6">
                          {itineraryData.map(({ day, title, description, image }, index) => (
                            <li
                              key={index}
                              className="relative md:before:absolute before:top-[120px] before:bottom-[-14px] before:left-[52px] before:w-[1px] md:before:border-l before:border-dashed before:border-[var(--primary)]"
                            >
                              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                <div className="grid place-content-center ml-3 md:ml-0 relative w-28 h-28 rounded-full bg-primary after:scale-[1.18] text-white shrink-0 after:w-full after:h-full after:absolute after:border-dashed after:border after:border-[var(--primary)] after:rounded-full">
                                  <div className="text-center">
                                    <p className="text-lg mb-0">Day</p>
                                    <h2 className="mb-0 text-white">{day}</h2>
                                  </div>
                                </div>
                                <div className="flex-grow rounded-2xl bg-white shadow-lg p-3 sm:p-4 lg:p-6">
                                  <h5 className="font-semibold text-xl">{title}</h5>
                                  <p className="mb-0 clr-neutral-500">{description}</p>
                                  <div className="border border-dashed my-6"></div>
                                  <div className="flex flex-col lg:flex-row md:items-center gap-5">
                                    <Link href="tour-listing-details" className="link block shrink-0 w-full lg:w-auto">
                                      <Image
                                        width={241}
                                        height={153}
                                        src={image}
                                        alt="image"
                                        className="rounded-2xl object-fit-cover"
                                      />
                                    </Link>
                                    <div className="flex-grow">
                                      <Link href="tour-listing-details" className="link block text-lg text-[var(--neutral-700)] hover:text-primary mb-2">
                                        {title}
                                      </Link>
                                      <p className="mb-0 clr-neutral-500 text-sm">{description}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Link
                      href="#"
                      className="link flex items-center gap-2 text-primary mt-8">
                      <span className="font-semibold inline-block">
                        Book Now
                      </span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-0 text-2xl font-semibold">
                      Inclusions & Exclusions
                    </h4>
                    <div className="border border-dashed my-5"></div>

                    {/* Inclusions */}
                    <h6 className="mb-4 font-semibold">Inclusions</h6>
                    <ul className="flex flex-col gap-4 mb-10">
                      {(inclusions || []).length > 0 ? (
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
                      {(exclusions || []).length > 0 ? (
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


                    <Link
                      href="#"
                      className="link flex items-center gap-2 text-primary mt-8">
                      <span className="font-semibold inline-block">
                        Read More
                      </span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-0 text-2xl font-semibold">FAQ</h4>
                    <div className="hr-dashed my-5"></div>

                    {/* FAQ content */}
                    {faqs.length > 0 ? (
                      faqs.map((faq, index) => (
                        <div key={index} className="mb-6">
                          <h6 className="font-semibold mb-2">{faq.question}</h6>
                          <p>{faq.answer}</p>
                        </div>
                      ))
                    ) : (
                      <p>Loading FAQ...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl my-10">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href="#"
                    className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-1">
                    <ArrowLongLeftIcon className="w-5 h-5" />
                    <span className="inline-block font-semibold">
                      Prev Tour
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
                      Next Tour
                    </span>
                    <ArrowLongRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5 mb-10 lg:mb-14">
                <div className="flex items-center gap-4 justify-between flex-wrap mb-10">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                    <h3 className="mb-0 h3"> 4.7 (21 reviews) </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="mb-0 clr-neutral-500 shrink-0"> Sort By : </p>
                    <select className="w-full border bg-transparent px-5 py-3 focus:outline-none rounded-full">
                      <option>Latest</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[var(--bg-)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
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
                <div className="bg-[var(--bg-)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
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
                        <h5 className="mb-1 font-semibold"> Kristin Watson </h5>
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
                <div className="bg-[var(--bg-)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8">
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
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
                  <h4 className="mb-0 text-2xl font-semibold">
                    Write a review
                  </h4>
                  <div className="border border-dashed my-6"></div>
                  <p className="text-xl font-medium mb-2">Rating *</p>
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

            <div className="col-span-12 xl:col-span-4">
              <div className="pb-0 mb-6 relative">
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-6">
                  <p className="mb-3 text-lg font-medium"> Price </p>
                  <div className="flex items-start gap-2 mb-6">
                    <div className="flex gap-3 items-center">
                      <i className="las la-tag text-2xl"></i>
                      <p className="mb-0"> From </p>
                      <h3 className="h3 mb-0"> ₹{packageData.sale_price} </h3>
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
                    <Tab.Panels className="tab-content mb-8">
                      <Tab.Panel>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="col-span-1">
                            <div className="w-full flex">
                              <DatePicker
                                placeholderText="Select Date"
                                selected={selectedDate}
                                dateFormat="dd-MM-yyyy"
                                onChange={(date) => setSelectedDate(date)}
                                className="bg-[var(--bg-2)] w-[330px] border border-r-0 border-neutral-40 rounded-s-full py-[14px] text-gray-500 ps-4 focus:outline-none"
                                ref={datePickerRef} // Attach the ref to DatePicker
                              />
                              <span
                                className="bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-3 text-gray-500 pe-4 ps-0 cursor-pointer"
                                onClick={() => {
                                  if (datePickerRef.current) {
                                    datePickerRef.current.setFocus(); // Call only if ref is not null
                                  }
                                }}
                              >
                                <i className="las text-2xl la-calendar-alt"></i>
                              </span>
                            </div>
                          </div>

                          {/* Adult Price */}
                          <div className="mb-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-gray-500 text-sm">Age: 12+</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Adult</p>
                                    <p className="text-sm text-gray-400"> {packageData.person_type_price1} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedAdults}
                                      onChange={(e) => setSelectedAdults(Number(e.target.value))}
                                    >

                                      {Array.from(
                                        { length: max1 - min1 + 1 },
                                        (_, index) => index + min1
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>

                                    {/* <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i> */}
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>

                              {/* Child Price */}
                              <div>
                                <p className="text-gray-500 text-sm">Age: 9-11</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Child</p>
                                    <p className="text-sm text-gray-400">{packageData.person_type_price2} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedChildren1}
                                      onChange={(e) => setSelectedChildren1(Number(e.target.value))}
                                    >
                                      {Array.from(
                                        { length: max2 - min2 + 1 },
                                        (_, index) => index + min2
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>

                              {/* Child Price */}
                              <div>
                                <p className="text-gray-500 text-sm">Age: 6-8</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Child</p>
                                    <p className="text-sm text-gray-400">{packageData.person_type_price3} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedChildren2}
                                      onChange={(e) => setSelectedChildren2(Number(e.target.value))}
                                    >
                                      {Array.from(
                                        { length: max3 - min3 + 1 },
                                        (_, index) => index + min3
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>

                              {/* Child Price */}
                              <div>
                                <p className="text-gray-500 text-sm">Age: 3-5</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Child</p>
                                    <p className="text-sm text-gray-400">{packageData.person_type_price4} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedChildren3}
                                      onChange={(e) => setSelectedChildren3(Number(e.target.value))}
                                    >
                                      {Array.from(
                                        { length: max4 - min4 + 1 },
                                        (_, index) => index + min4
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>



                              <div>
                                <p className="text-gray-500 text-sm">Age: 1+</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Infant</p>
                                    <p className="text-sm text-gray-400">{packageData.person_type_price5} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedInfants1}
                                      onChange={(e) => setSelectedInfants1(Number(e.target.value))}
                                    >
                                      {Array.from(
                                        { length: max5 - min5 + 1 },
                                        (_, index) => index + min5
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-gray-500 text-sm">Age: 0-1</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-gray-600 font-medium">Infant</p>
                                    <p className="text-sm text-gray-400">{packageData.person_type_price6} per person</p>
                                  </div>
                                  <div className="relative">
                                    <select
                                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      value={selectedInfants2}
                                      onChange={(e) => setSelectedInfants2(Number(e.target.value))}
                                    >
                                      {Array.from(
                                        { length: max6 - min6 + 1 },
                                        (_, index) => index + min6
                                      ).map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>



                          {/* Total Price */}
                          <div className="flex items-center justify-between">
                            <p className="mb-0 clr-neutral-500"> Total </p>
                            <p className="mb-0 font-medium">₹{calculateTotalPrice()}</p>
                          </div>
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
                    href={`package-payment?packageId=${packageId}`}
                    className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white :bg-primary-400 hover:text-white font-medium w-full justify-center mb-6"
                    onClick={handleBookingClick}  // Use the new function here
                  >
                    <span className="inline-block"> Proceed Booking </span>
                  </Link>
                     )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
