"use client";
import { Tab } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";


import faq1 from "@/public/img/faq-el-1.png";
import faq2 from "@/public/img/faq-el-2.png";
import SubHeadingBtn from "@/components/SubHeadingBtn";
import AnimateHeight from "react-animate-height";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

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

interface Coupon {
  status: string;
  model_name: string;
  coupon_code: string;
  type: string;
  discount_price: string;
}


export default function Page({
  params,
}: {
  params: { activityName?: string };
}) {
  const { activityName } = params;

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

  const [policies, setPolicies] = useState<{ title: string; description: string }[]>([]);
  const [openedPolicy, setOpenedPolicy] = useState<number | null>(null);



  const [opened, setOpened] = useState<number | null>(null);



  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = selectedDate !== null;
  const router = useRouter();


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
        coupon.model_name === 'Activity' &&
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




  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityName) return;

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/get_activity_by_seo_title/${activityName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activity data");
        }

        const data = await response.json();
        setActivityData(data);

        // Handle FAQs
        if (data?.faqs) {
          const parsedFaqs = data.faqs.map((faq: string) => JSON.parse(faq));
          setFaqs(parsedFaqs);
        }

        // Handle Amenities
        if (data?.activity_attribute) {
          setAmenitiesArray(data.activity_attribute);
          console.log("Amenities Array:", data.activity_attribute);
        } else {
          console.log("No amenities data available");
        }

        const policies = [];
        for (let i = 1; i <= 5; i++) {
          const title = data[`policy_title${i}`];
          const description = data[`policy_description${i}`];

          if (title && description) {
            policies.push({ title, description });
          }
        }
        setPolicies(policies); 

      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivityData();
  }, [activityName]);


  // Conditional rendering to ensure activityData is not null before accessing its properties
  if (!activityData) {
    return <p>Loading...</p>;
  }


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
      alert("Please Select Date");
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
      discountAmount,
      discountedPrice,
      grandTotal: totalPrice, // Total calculated price
    };

    localStorage.setItem("storedActivityData", JSON.stringify(newActivityData));

    if (totalPrice == 0) {
      alert("Choose Ticket");
      return;
    }

    router.push(`/activity-payment?activityName=${activityName}`);
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
                          <span className="text-primary"> {activityData.location_name}</span>
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
                        amenitiesArray.map((amenity, index) => (  // Show all items
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



                  <section className="relative bg-white py-[60px] lg:py-[120px]">
                    <div className="container">
                      <div className="max-w-[570px] mx-auto flex flex-col items-center text-center px-3">
                        <SubHeadingBtn text="Policies" classes="bg-[var(--primary-light)]" />
                        <h2 className="h2 mt-3 leading-snug">Activity Policies</h2>
                        <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
                          Here are the policies related to this activity.
                        </p>
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
                    <Image
                      src={faq1}
                      className="hidden lg:block absolute top-10 right-10"
                      alt="faq el"
                    />
                    <Image
                      src={faq2}
                      className="hidden lg:block absolute bottom-0 left-0"
                      alt="faq el"
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
                          faqs.map((faq, index) => (
                            <div
                              key={index}
                              onClick={() => setOpened((prev) => (prev === index ? null : index))}
                              className="bg-[var(--secondary-light)] rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
                            >
                              <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-left justify-between">
                                {faq.title}
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
                                  {faq.description}
                                </p>
                              </AnimateHeight>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-neutral-600">No FAQs available.</p>
                        )}

                      </div>
                    </div>
                  </section>


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
                                onChange={(date) => {
                                  if (date) {
                                    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                    setSelectedDate(utcDate);
                                  }
                                }}

                                ref={datePickerRef}
                                minDate={new Date()}
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
                                  <p className="font-medium text-green-500">- ₹{discountAmount}</p>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                  <p className="clr-neutral-500 font-semibold">Discounted Price</p>
                                  <p className="font-bold text-blue-500">₹{discountedPrice}</p>
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
                      href={`activity-payment?activityName=${activityName}`}
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

