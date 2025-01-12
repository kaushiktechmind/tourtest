"use client";
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
import { Suspense, useEffect, useState, useRef } from "react";
import CheckboxCustom from "@/components/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}


interface ActivityData {
  banner_image_multiple: any;
  id: number;
  location_name: string;
  activity_title: string;
  activity_content: string;
  youtube_video_link: string;
  duration: string;
  tour_min_people: string;
  tour_max_people: string;
  pickup_point: string;
  amenities: string;
  activity_includes: string; // JSON string
  activity_excludes: string; // JSON string
  activity_faqs: string;
  [key: string]: string | number | undefined; // This will allow dynamic keys like ticket_name1, ticket_price1, etc.
}



const ActivityListingDetails = () => {

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({
    ticket1: 0,
    ticket2: 0,
    ticket3: 0,
    ticket4: 0,
    ticket5: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "Activity",
    message: "",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };





  const [faqs, setFaqs] = useState<any[]>([]);
  const [amenitiesArray, setAmenitiesArray] = useState<string[]>([]);



  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId");

  const datePickerRef = useRef<any>(null);

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
    const fetchActivityData = async () => {
      if (!activityId) return; // Add a check to make sure activityId is not null
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/get_activity_by_id/${activityId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activity data");
        }
        const data = await response.json();

        setActivityData(data);

        if (data?.faqs) {
          const parsedFaqs = data.faqs.map((faq: string) => JSON.parse(faq)); // Parse each FAQ string
          setFaqs(parsedFaqs);
        }


        if (data?.activity_attribute) {
          let parsedAmenities = [];

          // If it's a stringified array, parse it
          try {
            parsedAmenities = JSON.parse(data.activity_attribute[0]);
            console.log("Parsed Amenities (Array):", parsedAmenities);
          } catch (e) {
            // If parsing fails, it's a simple string, so treat it as a single element array
            parsedAmenities = [data.activity_attribute[0]];
            console.log("Parsed Amenities (Single String):", parsedAmenities);
          }

          setAmenitiesArray(parsedAmenities);
        } else {
          console.log("No amenities data available");
        }


      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivityData();
  }, [activityId]);


  // Conditional rendering to ensure activityData is not null before accessing its properties
  if (!activityData) {
    return <p>Loading...</p>;
  }

  // const amenitiesArray = JSON.parse(activityData.amenities);
  // const inclusions = activityData ? JSON.parse(activityData.activity_includes) : [];
  // const exclusions = activityData ? JSON.parse(activityData.activity_excludes) : [];
  // Properly parse the faqs field with error handling



  const calculateTotalPrice = () => {
    let total = 0;

    // Iterate through all the tickets and calculate the total price
    for (let i = 1; i <= 5; i++) {
      const ticketName = activityData[`ticket_name${i}`];
      const ticketPrice = activityData[`ticket_price${i}`];
      const selectedQuantity = selectedTickets[`ticket${i}` as keyof typeof selectedTickets];


      // If ticket exists (i.e., not null), calculate the total price
      if (ticketName && ticketPrice) {
        total += Number(ticketPrice) * selectedQuantity;
      }
    }

    return total;
  };

  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!isDateSelected) {
      alert("Select Date First");
      return;
    }

    if (!accessToken) {
      router.push("/sign-in");
      return;
    }

    // Prepare the data for individual ticket details
    const ticketDetails = [];
    let totalPrice = 0;

    for (let i = 1; i <= 5; i++) {
      const ticketName = activityData[`ticket_name${i}`];
      const ticketPrice = Number(activityData[`ticket_price${i}`]);
      const selectedQuantity = selectedTickets[`ticket${i}` as keyof typeof selectedTickets];


      if (ticketName && ticketPrice > 0 && selectedQuantity > 0) {
        const individualTotal = ticketPrice * selectedQuantity;

        ticketDetails.push({
          ticketName,
          pricePerTicket: ticketPrice,
          quantity: selectedQuantity,
          totalPrice: individualTotal,
        });

        totalPrice += individualTotal;
      }
    }

    // Store ticket data along with the selected date
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newActivityData = {
      date: formattedDate,
      tickets: ticketDetails, // Detailed ticket breakdown
      grandTotal: totalPrice, // Total calculated price
    };

    localStorage.setItem("storedActivityData", JSON.stringify(newActivityData));

    if (totalPrice == 0) {
      alert("Choose Ticket");
      return;
    }

    router.push(`/activity-payment?activityId=${activityId}`);
  };


  // const handleRestrict = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const accessToken = localStorage.getItem("access_token");


  //   if (!accessToken) {
  //     router.push("/sign-in");
  //     return;
  //   }

  //   router.push(`/activity-payment?activityId=${activityId}`);
  // };



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
        setFormData({ name: "", phone: "", email: "", message: "", service_type: "Activity" });
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
                          src={activityData.banner_image_multiple[0]}
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
                        src={activityData.banner_image_multiple[1]}
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
                    src={activityData.banner_image_multiple[2]}
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
                        src={activityData.banner_image_multiple[3]}
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
                        src={activityData.banner_image_multiple[4]}
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
                        src={activityData.banner_image_multiple[5]}
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
                      <h2 className="h2 m-0"> {activityData.activity_title}  </h2>
                    </div>
                    <ul className="columns-1 md:columns-2 lg:columns-3 pt-4 border-t border-dashed gap-md-0">
                      <li className="py-2">
                        <p className="mb-0">
                          Location:
                          <span className="text-primary">{activityData.location_name}</span>
                        </p>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Duration:{" "}
                            <span className="text-primary"> {activityData.duration}</span>
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Starting Time:{" "}
                            <span className="text-primary"> {activityData.start_time}</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                    {/* <ul className="columns-1 md:columns-2 lg:columns-3">
                      <li className="py-2">
                        <p className="mb-0">
                          Duration:
                          <span className="text-primary"> {activityData.duration}</span>
                        </p>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-1">
                          <span>
                            Pickup Point:{" "}
                            <span className="text-primary">{activityData.pickup_point}</span>
                          </span>
                        </div>
                      </li>
                    </ul> */}
                  </div>
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-5 text-2xl font-semibold">Description</h4>
                    <p className="mb-5 clr-neutral-500">
                      {isExpanded
                        ? activityData.activity_content
                        : getShortDescription(activityData.activity_content, 50)} {/* Adjust limit as needed */}
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
                  {/* Activity Type / Amenities Section */}
                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-5 text-2xl font-semibold">Activity Type</h4>
                    <div className="grid grid-cols-12 gap-4">
                      {amenitiesArray.length > 0 ? (
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
                        <p>Not Available</p>
                      )}
                    </div>
                  </div>


                  <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                    <h4 className="mb-0 text-2xl font-semibold">FAQ</h4>
                    <div className="hr-dashed my-5"></div>

                    {faqs.length > 0 ? (
                      faqs.map((faq, index) => (
                        <div key={index} className="mb-6">
                          <h6 className="font-semibold mb-2">{faq.title}</h6> {/* Display title */}
                          <p>{faq.description}</p> {/* Display description */}
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
                      <h6 className="line-through text-gray-500">₹{activityData.price}</h6>
                      <h3 className="h3 mb-0">
                        {" "}

                        ₹{activityData.sale_price}{" "}
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
                                ref={datePickerRef} 
                                className="bg-[var(--bg-2)] w-[330px] border border-r-0 border-neutral-40 rounded-s-full py-[14px] text-gray-500 ps-4 focus:outline-none"
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


                          <div className="mb-6">
                            <div className="space-y-4">
                              {['ticket_name1', 'ticket_name2', 'ticket_name3', 'ticket_name4', 'ticket_name5'].map((ticketNameKey, index) => {
                                const ticketName = activityData[ticketNameKey];
                                const ticketPriceKey = `ticket_price${index + 1}`;
                                const ticketPrice = activityData[ticketPriceKey];
                                const ticketAvailabilityKey = `no_of_available_tickets${index + 1}`;
                                const ticketAvailability = activityData[ticketAvailabilityKey];

                                // Only render the ticket if it exists
                                if (ticketName && ticketPrice) {
                                  return (
                                    <div key={index}>
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-gray-600 font-medium">{ticketName}</p>
                                          <p className="text-sm text-gray-400">₹{ticketPrice}</p>
                                        </div>
                                        <div className="relative">
                                          <select
                                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            value={selectedTickets[`ticket${index + 1}`]}
                                            onChange={(e) => setSelectedTickets((prev) => ({
                                              ...prev,
                                              [`ticket${index + 1}`]: Number(e.target.value),
                                            }))}
                                          >
                                            {[...Array(Math.min(Number(ticketAvailability) || 0, 9) + 1).keys()].map((num) => (
                                              <option key={num} value={num}>
                                                {num}
                                              </option>
                                            ))}
                                          </select>
                                          <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                return null;
                              })}
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
                      href={`activity-payment?activityId=${activityId}`}
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

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ActivityListingDetails />
  </Suspense>
);

export default Page;
