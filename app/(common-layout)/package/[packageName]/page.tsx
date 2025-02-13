"use client";
import React, { Suspense, useRef } from "react";
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
import axios from "axios";


import faq1 from "@/public/img/faq-el-1.png";
import faq2 from "@/public/img/faq-el-2.png";
import SubHeadingBtn from "@/components/SubHeadingBtn";
import AnimateHeight from "react-animate-height";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";



function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}


interface Coupon {
  status: string;
  model_name: string;
  coupon_code: string;
  type: string;
  discount_price: string;
}


interface PackageData {
  person_type_price1: any;
  person_type_price2: any;
  person_type_price3: any;
  person_type_price4: any;
  person_type_price5: any;
  person_type_price6: any;
  person_type_description1: any;
  person_type_description2: any;
  person_type_description3: any;
  person_type_description4: any;
  person_type_description5: any;
  person_type_description6: any;
  person_min1(person_min1: any): unknown;
  person_max1(person_max1: any): unknown;
  person_min2(person_min2: any): unknown;
  person_max2(person_max2: any): unknown;
  person_min3(person_min3: any): unknown;
  person_max3(person_max3: any): unknown;
  person_min4(person_min4: any): unknown;
  person_max4(person_max4: any): unknown;
  person_min5(person_min5: any): unknown;
  person_max5(person_max5: any): unknown;
  person_min6(person_min6: any): unknown;
  person_max6(person_max6: any): unknown;
  sale_price: number;
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

interface ItineraryItem {
  day: string;
  title: string;
  description: string;
  image: string;
}


export default function Page({
  params,
}: {
  params: { packageName: string };
}) {
  const { packageName } = params;
  const [selectedAdults, setSelectedAdults] = useState(0);
  const [selectedChildren1, setSelectedChildren1] = useState(0);
  const [selectedChildren2, setSelectedChildren2] = useState(0);
  const [selectedChildren3, setSelectedChildren3] = useState(0);
  const [selectedInfants1, setSelectedInfants1] = useState(0);
  const [selectedInfants2, setSelectedInfants2] = useState(0);
  const datePickerRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "Package",
    message: "",
  });


  const [selectedIndex, setSelectedIndex] = useState(0);

  // Function to handle the tab change and update the selectedIndex
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0); // Rating value (1-5)
  const [hoverRating, setHoverRating] = useState(0); // Hover effect for rating

  const handleRatingClick = (value: number) => setRating(value);
  const handleRatingHover = (value: number) => setHoverRating(value);
  const handleRatingLeave = () => setHoverRating(0);


  const [opened, setOpened] = useState<number | null>(null);

  const [policies, setPolicies] = useState<{ title: string; description: string }[]>([]);
  const [openedPolicy, setOpenedPolicy] = useState<number | null>(null);



  const [packageData, setPackageData] = useState<PackageData | null>(null);

  const [packageId, setPackageId] = useState<PackageData | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;
  const router = useRouter();


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


  const [couponCode, setCouponCode] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
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

    // Check if selectedPrice is greater than 0
    if (calculateTotalPrice() <= 0) {
      setCouponMessage("Cannot Apply Coupon.");
      setDiscountedPrice(0);
      setDiscountAmount(0);
      return;
    }

    const validCoupon = coupons.find(
      (coupon: any) =>
        coupon.status === '1' &&
        coupon.model_name === 'Package' &&
        coupon.coupon_code === couponCode
    );

    if (!validCoupon) {
      setCouponMessage("Coupon Not Applicable");
      setDiscountedPrice(null);
      setDiscountAmount(0);
      return;
    }

    let discount = 0;
    if (validCoupon.type === '%') {
      discount = (parseFloat(validCoupon.discount_price) / 100) * calculateTotalPrice();
    } else {
      discount = parseFloat(validCoupon.discount_price);
    }

    const finalPrice = calculateTotalPrice() - discount;
    setDiscountAmount(discount);
    setDiscountedPrice(finalPrice > 0 ? finalPrice : 0); // Ensure price doesn't go below 0
    setCouponMessage("Coupon Applied");
  };



  const [itineraryData, setItineraryData] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!packageName) return; // Add a check to make sure packageId is not null
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/package/seo_title/${packageName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch package data");
        }
        const data = await response.json();

        // Parse the itinerary string to an array of objects
        const itinerary = JSON.parse(data.itinerary || "[]");
        setPackageData(data);
        setPackageId(data.id);
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


        const policies = [];
        for (let i = 1; i <= 5; i++) {
          const title = data[`package_policy_title${i}`];
          const description = data[`package_policy_description${i}`];

          if (title && description) {
            policies.push({ title, description });
          }
        }
        setPolicies(policies);
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    fetchPackageData();
  }, [packageName]);


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
      adultAge: packageData.person_type_description1,
      childAge1: packageData.person_type_description2,
      childAge2: packageData.person_type_description3,
      childAge3: packageData.person_type_description4,
      infantAge1: packageData.person_type_description5,
      infantAge2: packageData.person_type_description6,
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
      discountAmount: discountAmount,
      discountedPrice: discountedPrice

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







  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    const payload = {
      user_id: 7, // Pass actual user_id dynamically
      blog_id: 12, // Pass actual blog_id dynamically
      model_name: 'review',
      ratings: rating,
      name,
      email,
      description: review,
      status: 1,
    };

    try {
      const response = await axios.post(
        'https://yrpitsolutions.com/tourism_api/api/admin/save_review',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Review submitted successfully!');
      setName('');
      setEmail('');
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit the review.');
    }
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
        setFormData({ name: "", phone: "", email: "", message: "", service_type: "" });
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
                      <h2 className="h2 m-0">{packageData.package_title}</h2>
                    </div>

                    <ul className="columns-1 md:columns-2 lg:columns-2 pt-4 border-t border-dashed gap-md-0">
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

                    <ul className="columns-1 md:columns-2 lg:columns-2">
                      <li className="py-2">
                        <p className="mb-0">
                          Duration:
                          <span className="text-primary"> {packageData.duration}</span>
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
                        amenitiesArray.slice(0, 4).map((amenity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
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
                                  <div className="border border-dashed my-6"></div>
                                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5">
                                    <Link href="tour-listing-details" className="block shrink-0 w-full lg:w-auto">
                                      <Image
                                        width={241}
                                        height={200}
                                        src={image}
                                        alt="image"
                                        className="rounded-2xl w-[241px] h-[200px] object-cover"
                                      />
                                    </Link>
                                    <div className="flex-grow">
                                      <Link
                                        href="tour-listing-details"
                                        className="block text-lg text-[var(--neutral-700)] hover:text-primary mb-2"
                                      >
                                        {title}
                                      </Link>
                                      <p className="mb-0 text-sm text-neutral-500">{description}</p>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                        inclusions.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
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
                        exclusions.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
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
                      <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3 mb-6">
                        <SubHeadingBtn text="Policies" classes="bg-[var(--primary-light)]" />

                      </div>

                      {/* Dynamically Rendered Policies */}
                      <div className="max-w-[856px] flex flex-col gap-4 lg:gap-6 mx-auto px-3 xl:px-0">
                        {policies.length > 0 ? (
                          policies.map((policy, index) => (
                            <div
                              key={index}
                              onClick={() => setOpenedPolicy((prev) => (prev === index ? null : index))}
                              className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
                            >
                              <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
                                {policy.title}
                                <span
                                  className={`p-1 bg-[#22814B] duration-300 text-white rounded-full ${openedPolicy === index ? "rotate-180" : ""
                                    }`}
                                >
                                  {openedPolicy === index ? (
                                    <MinusIcon className="w-6 h-6" />
                                  ) : (
                                    <PlusIcon className="w-6 h-6" />
                                  )}
                                </span>
                              </button>

                              <AnimateHeight duration={300} height={openedPolicy === index ? "auto" : 0}>
                                <p className="border-t border-dash-long pt-4 mt-4">
                                  {policy.description}
                                </p>
                              </AnimateHeight>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-neutral-600">No Policies available.</p>
                        )}
                      </div>
                    </div>
                  </section>


                  <section className="relative bg-white py-[60px] lg:py-[120px]">
                    <Image src={faq1} className="hidden lg:block absolute top-10 right-10" alt="faq el" />
                    <Image src={faq2} className="hidden lg:block absolute bottom-0 left-0" alt="faq el" />
                    <div className="container">
                      <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3 mb-6">
                        <SubHeadingBtn text="FAQs" classes="bg-[var(--primary-light)]" />

                      </div>
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
                                <p className="border-t border-dash-long pt-4 mt-4">{faq.answer}</p>
                              </AnimateHeight>
                            </div>
                          ))
                        ) : (
                          <p>No FAQs available</p>
                        )}

                      </div>
                    </div>
                  </section>


                </div>
              </div>

              {/* <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5 mb-10 lg:mb-14">
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
              </div> */}

              {/* <div className="mb-10 lg:mb-14">
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
                  <h4 className="mb-0 text-2xl font-semibold">Write a review</h4>
                  <div className="border border-dashed my-6"></div>

                  <p className="text-xl font-medium mb-2">Rating *</p>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarIcon
                        key={value}
                        className={`w-5 h-5 cursor-pointer ${(hoverRating || rating) >= value
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                          }`}
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => handleRatingHover(value)}
                        onMouseLeave={handleRatingLeave}
                      />
                    ))}
                  </div>

                  <form onSubmit={handleReviewSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <label
                          htmlFor="review-name"
                          className="text-xl font-medium block mb-3"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                          placeholder="Enter Name.."
                          id="review-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="col-span-12">
                        <label
                          htmlFor="review-email"
                          className="text-xl font-medium block mb-3"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                          placeholder="Enter Email.."
                          id="review-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="col-span-12">
                        <label
                          htmlFor="review-review"
                          className="text-xl font-medium block mb-3"
                        >
                          Review *
                        </label>
                        <textarea
                          id="review-review"
                          rows={5}
                          className="bg-[var(--bg-1)] border rounded-2xl py-3 px-5 w-full focus:outline-none"
                          placeholder="Write your review here..."
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="col-span-12">
                        <button type="submit" className="btn-primary">
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}

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
                                onChange={(date) => {
                                  if (date) {
                                    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                    setSelectedDate(utcDate);
                                  }
                                }}

                                minDate={new Date()}
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
                              {[
                                { age: packageData.person_type_description1, type: "Adult", price: packageData.person_type_price1, min: min1, max: max1, selected: selectedAdults, setSelected: setSelectedAdults },
                                { age: packageData.person_type_description2, type: "Child", price: packageData.person_type_price2, min: min2, max: max2, selected: selectedChildren1, setSelected: setSelectedChildren1 },
                                { age: packageData.person_type_description3, type: "Child", price: packageData.person_type_price3, min: min3, max: max3, selected: selectedChildren2, setSelected: setSelectedChildren2 },
                                { age: packageData.person_type_description4, type: "Child", price: packageData.person_type_price4, min: min4, max: max4, selected: selectedChildren3, setSelected: setSelectedChildren3 },
                                { age: packageData.person_type_description5, type: "Infant", price: packageData.person_type_price5, min: min5, max: max5, selected: selectedInfants1, setSelected: setSelectedInfants1 },
                                { age: packageData.person_type_description6, type: "Infant", price: packageData.person_type_price6, min: min6, max: max6, selected: selectedInfants2, setSelected: setSelectedInfants2 },
                              ]
                                .filter((item) => item.age && item.price && item.type && item.min !== undefined && item.max !== undefined)
                                .map((item, index) => (
                                  <div key={index}>
                                    <p className="text-gray-500 text-sm">Age: {item.age}</p>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-gray-600 font-medium">{item.type}</p>
                                        <p className="text-sm text-gray-400">{item.price} per person</p>
                                      </div>
                                      <div className="relative">
                                        <select
                                          className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                          value={item.selected}
                                          onChange={(e) => item.setSelected(Number(e.target.value))}
                                        >
                                          {Array.from({ length: item.max - item.min + 1 }, (_, index) => index + item.min).map((value) => (
                                            <option key={value} value={value}>
                                              {value}
                                            </option>
                                          ))}
                                        </select>
                                        <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>





                          {/* Total Price */}
                          {/* <div className="flex items-center justify-between">
                            <p className="mb-0 clr-neutral-500"> Total </p>
                            <p className="mb-0 font-medium">₹{calculateTotalPrice()}</p>
                          </div> */}


                          <div className="p-4 bg-white rounded-xl shadow-md">
                            {/* Original Price (Always Visible) */}
                            <div className="flex items-center justify-between mb-2">
                              <p className="clr-neutral-500">Total Price</p>
                              <p className={`font-medium ${(discountedPrice !== null && discountAmount > 0) ? 'line-through text-gray-500' : ''}`}>
                                ₹{calculateTotalPrice()}
                              </p>

                            </div>

                            {/* Discount and Discounted Price (Visible Only When Coupon is Applied) */}
                            {discountedPrice !== null && discountAmount > 0 && (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="clr-neutral-500">Discount</p>
                                  <p className="font-medium text-green-500">- ₹{Math.round(discountAmount)}</p>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                  <p className="clr-neutral-500 font-semibold">Discounted Price</p>
                                  <p className="font-bold text-blue-500">₹{Math.round(discountedPrice)}</p>
                                </div>
                              </>
                            )}

                            {/* Coupon Message */}
                            {couponMessage && (
                              <p className={`mt-2 ${couponMessage === "Coupon Applied" ? "text-green-500" : "text-red-500"}`}>
                                {couponMessage}
                              </p>
                            )}

                            {/* Coupon Input and Apply Button */}
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
