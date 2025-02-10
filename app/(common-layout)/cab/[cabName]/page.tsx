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


import faq1 from "@/public/img/faq-el-1.png";
import faq2 from "@/public/img/faq-el-2.png";
import SubHeadingBtn from "@/components/SubHeadingBtn";
import AnimateHeight from "react-animate-height";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface CabDetails {
  time: ReactNode;
  drop_point: ReactNode;
  pickup_point: ReactNode;
  policies: any;
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
  faqs?: string[];
}

interface CabSubForm {
  min_pax: number;
  max_pax: number;
  car_count: number;
  cargo_count: number;
  price: number;
}


export default function Page({
  params,
}: {
  params: { cabName: string };
}) {
  const { cabName } = params;

  const [cabDetails, setCabDetails] = useState<CabDetails | null>(null);
  const [cabId, setCabId] = useState<CabDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const router = useRouter();

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
  const [cargo, setCargo] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState<number[]>([]);


  const [opened, setOpened] = useState<number | null>(null);





  const [couponCode, setCouponCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('https://yrpitsolutions.com/tourism_api/api/get_all_coupon');
        const data = await response.json();
        setCoupons(data);
      } catch (err) {
        console.error('Error fetching coupons:', err);
      }
    };
    fetchCoupons();
  }, []);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const validCoupon = coupons.find(
      (coupon: any) =>
        coupon.status === '1' &&
        coupon.model_name === 'Cab' &&
        coupon.coupon_code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!validCoupon) {
      setCouponMessage("Coupon Not Applicable")
      return;
    }



    let discount = 0;
    if (validCoupon.type === '%') {
      discount = (parseFloat(validCoupon.discount_price) / 100) * selectedPrice;
    } else {
      discount = parseFloat(validCoupon.discount_price);
    }

    const finalPrice = selectedPrice - discount;
    setDiscountedPrice(finalPrice > 0 ? finalPrice : 0); // Ensure price doesn't go below 0
    setCouponMessage("Coupon Applied")
  };


  const handlePaxChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPax(event.target.value); // Update the state with the selected pax number
  };


  const [selectedPax, setSelectedPax] = useState<string | number>('');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };



  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;


  const [pickupPoints, setPickupPoints] = useState<string[]>([]);
  const [hotelName, sethotelName] = useState<string>("");

  useEffect(() => {
    const fetchPickupPoints = async () => {
      try {
        const response = await fetch("https://yrpitsolutions.com/tourism_api/api/get_all_cab_pickup_point_name");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setPickupPoints(data.map((item) => item.cab_pickup_point_name));
        }
      } catch (error) {
        console.error("Error fetching pickup points:", error);
      }
    };

    fetchPickupPoints();
  }, []);

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
          `https://yrpitsolutions.com/tourism_api/api/cab-main-form/seo_title/${cabName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cab details");
        }
        const data = await response.json();
        setCabId(data.id);

        // Parse FAQs if they are stringified
        const parsedFAQs = data.faqs && typeof data.faqs === "string" ? JSON.parse(data.faqs) : data.faqs;

        // Parse Policies if they are stringified
        const parsedPolicies = data.policies && typeof data.policies === "string" ? JSON.parse(data.policies) : data.policies;

        setCabDetails({ ...data, faqs: parsedFAQs, policies: parsedPolicies });

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabDetails();
  }, [cabName]);



  useEffect(() => {
    if (!cabId) return;  // Prevent the API call if cabId is null or undefined

    const fetchCabSubForms = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/filter/cabsubforms/by-cab-main-form-id/${cabId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cab sub-forms");
        }
        const data = await response.json();
        setCabSubForms(data); // Assuming the response is directly an array
      } catch (error) {
        console.error("Error fetching cab sub-forms:", error);
      }
    };

    fetchCabSubForms();
  }, [cabId]);


  const handleBook = (price: number, minPax: number, maxPax: number, cargo_count: number) => {
    setCargo(cargo_count);
    setSelectedPrice(price);
    setDropdownOptions(Array.from({ length: maxPax - minPax + 1 }, (_, i) => i + minPax));
  };








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
      alert("Please Select Date");
      return;
    }

    if (!accessToken) {
      router.push("/sign-in");
      return;
    }


    // const selectedPax = (document.querySelector('select') as HTMLSelectElement)?.value || "";

    // Validate required fields
    // if (!hotelName) {
    //   alert("Select Pickup point");
    //   return;
    // }

    if (!selectedPax) {
      alert("Select Pax");
      return;
    }

    // Store booking details in localStorage
    const storedCabDetails = {
      hotelName: cabDetails?.pickup_point,
      selectedDate: selectedDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      totalPrice: discountedPrice !== null ? discountedPrice : selectedPrice,
      selectedPax,
      cargo: cargo,
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
                                        Number(cab.max_pax),
                                        Number(cab.cargo_count),
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



                <section className="relative bg-white py-[60px] lg:py-[120px]">
                  <div className="container">
                    <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3">
                      <SubHeadingBtn text="Policies" classes="bg-[var(--primary-light)]" />
                      <h2 className="h2 mt-3 leading-snug">
                        Our Policies for a Better Experience
                      </h2>
                      <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
                        Review our policies to ensure a smooth and enjoyable journey.
                      </p>
                    </div>

                    <div className="max-w-[856px] flex flex-col gap-4 lg:gap-6 mx-auto px-3 xl:px-0">
                      {cabDetails?.policies?.map((policy: { policy_title: string, policy_description: string }, index: number) => (
                        <div
                          key={index}
                          onClick={() => setOpened((prev) => (prev === index ? null : index))}
                          className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
                        >
                          <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
                            {policy.policy_title}
                            <span
                              className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${opened === index ? "rotate-180" : ""
                                }`}
                            >
                              {opened === index ? (
                                <MinusIcon className="w-6 h-6" />
                              ) : (
                                <PlusIcon className="w-6 h-6" />
                              )}
                            </span>
                          </button>
                          <AnimateHeight duration={300} height={opened === index ? "auto" : 0}>
                            <p className="border-t border-dash-long pt-4 mt-4">
                              {policy.policy_description}
                            </p>
                          </AnimateHeight>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>







                <section className="relative bg-white py-[60px] lg:py-[120px]">
                  <Image
                    src={faq1}
                    className="hidden lg:block absolute top-10 right-10"
                    alt="faq element"
                  />
                  <Image
                    src={faq2}
                    className="hidden lg:block absolute bottom-0 left-0"
                    alt="faq element"
                  />
                  <div className="container">
                    <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3">
                      <SubHeadingBtn text="FAQs" classes="bg-[var(--primary-light)]" />
                      <h2 className="h2 mt-3 leading-snug">
                        If you have any questions, we have the answers
                      </h2>
                      <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
                        Real estate can be bought, sold, leased, or rented, and can be a
                        valuable investment opportunity. The value of real estate can be
                      </p>
                    </div>

                    {/* Dynamically Rendered FAQs */}
                    <div className="max-w-[856px] flex flex-col gap-4 lg:gap-6 mx-auto px-3 xl:px-0">
                      {faqs.length > 0 ? (
                        faqs.map((faq: { question: string; answer: string }, index: number) => (
                          <div
                            key={index}
                            onClick={() => setOpened((prev) => (prev === index ? null : index))}
                            className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
                          >
                            <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
                              {faq.question}
                              <span
                                className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${opened === index ? "rotate-180" : ""
                                  }`}
                              >
                                {opened === index ? (
                                  <MinusIcon className="w-6 h-6" />
                                ) : (
                                  <PlusIcon className="w-6 h-6" />
                                )}
                              </span>
                            </button>
                            <AnimateHeight duration={300} height={opened === index ? "auto" : 0}>
                              <p className="border-t border-dash-long pt-4 mt-4">
                                {faq.answer}
                              </p>
                            </AnimateHeight>
                          </div>
                        ))
                      ) : (
                        <p className="text-center">No FAQs available</p>
                      )}
                    </div>
                  </div>
                </section>


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
                              <div className="flex-grow bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5 text-gray-500">
                                {cabDetails?.pickup_point}
                              </div>
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-map-marker-alt"></i>
                              </span>
                            </div>
                          </div>



                          <div className="col-span-1">
                            <div className="w-full flex">
                              <div className="flex-grow bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5 text-gray-500">
                                {cabDetails?.drop_point}
                              </div>
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-map-marker-alt"></i>
                              </span>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="w-full flex">
                              <div className="flex-grow bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5 text-gray-500">
                                {cabDetails?.time}
                              </div>
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
                                onChange={(date) => {
                                  if (date) {
                                    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                    setSelectedDate(utcDate);
                                  }
                                }}
                                minDate={new Date()}
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
                                value={selectedPax} // Set the value of the select to the selectedPax state
                                onChange={handlePaxChange} // Call handlePaxChange when selection changes
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
                        <div className="p-4 bg-white rounded-xl shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <p className="clr-neutral-500">Total Price</p>
                            <p className="font-medium">₹{discountedPrice !== null ? discountedPrice : selectedPrice}</p>
                          </div>

                          {/* Display the coupon message with red color */}
                          {couponMessage && (
                            <p className="text-red-500 mt-2">{couponMessage}</p>
                          )}

                          <div className="flex items-center gap-2 mt-4">
                            <input
                              type="text"
                              placeholder="Enter Coupon Code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                            <button
                              onClick={applyCoupon}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                              Apply
                            </button>
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
                      href={`cab-payment?cabId=${cabId}`}
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
    </>
  );
};
