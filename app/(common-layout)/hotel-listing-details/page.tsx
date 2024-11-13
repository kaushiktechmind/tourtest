"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Tooltip } from "react-tooltip";
// Import Swiper styles
import "swiper/css";
import { Navigation } from "swiper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";

import "react-datepicker/dist/react-datepicker.css";
import LocationEntry from "@/components/home-3/LocationEntry";
import AddRoom from "@/components/home-2/AddRoom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CheckIcon, StarIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  HandThumbUpIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import HotelDetailsFeaturedRoom from "@/components/HotelDetailsFeaturedRoom";

import CheckboxCustom from "@/components/Checkbox";

interface RoomPrice {
  room_price: number;
  extra_bed_price: number;
  child_price: number;
  id: number;
}

interface Room {
  id: number;
  img: string;
  title: string;
  price: number;
  extra_bed_price: number;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Page = () => {
  const defaultAdults = 2; // Set your default number of adults
  const defaultChildren = 1; // Set your default number of children
  const defaultInfants = 0; // Set your default number of infants
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<RoomPrice | null>(
    null
  );

  const [grandTotalAdultCount, setGrandTotalAdultCount] = useState(0);
  const [grandTotalChildrenCount, setGrandTotalChildrenCount] = useState(0);
  const [grandTotalInfantCount, setGrandTotalInfantCount] = useState(0);

  const [grandAdultTotalPrice, setGrandAdultTotalPrice] = useState(0);
  const [grandChildTotalPrice, setGrandChildTotalPrice] = useState(0);
  const [grandExtraBedTotalPrice, setGrandExtraBedTotalPrice] = useState(0);

  const handleSelectionChange = (
    id,
    adultTotal,
    childTotal,
    extraBedTotal,
    prevAdultTotal = 0,
    prevChildTotal = 0,
    prevExtraBedTotal = 0,
    totalAdultCount = 0,
    totalChildrenCount = 0,
    totalInfantCount = 0,
    prevAdultCount = 0,
    prevChildCount = 0,
    prevInfantCount = 0
  ) => {
    setGrandAdultTotalPrice((prev) => prev - prevAdultTotal + adultTotal);
    setGrandChildTotalPrice((prev) => prev - prevChildTotal + childTotal);
    setGrandExtraBedTotalPrice(
      (prev) => prev - prevExtraBedTotal + extraBedTotal
    );

    // Corrected lines: use the prev*Total parameters instead of prevTotals
    setGrandTotalAdultCount((prev) => prev - prevAdultCount + totalAdultCount);
    setGrandTotalChildrenCount(
      (prev) => prev - prevChildCount + totalChildrenCount
    );
    setGrandTotalInfantCount(
      (prev) => prev - prevInfantCount + totalInfantCount
    );
  };

  localStorage.setItem(
    "grandTotalAdultCount",
    JSON.stringify(grandTotalAdultCount)
  );
  localStorage.setItem(
    "grandTotalChildrenCount",
    JSON.stringify(grandTotalChildrenCount)
  );
  localStorage.setItem(
    "grandTotalInfantCount",
    JSON.stringify(grandTotalInfantCount)
  );

  const handleBookNowClick = (roomId: string) => {
    // Check if the room ID is already in the selected list
    if (!selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds((prevSelected) => [...prevSelected, roomId]); // Add the room ID if not already present
    }
  };

  const [totalSelected, setTotalSelected] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalChildPrice, setTotalChildPrice] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelDetailsId = searchParams.get("hotelDetailsId");
  const type = searchParams.get("type");

  const adults = Number(localStorage.getItem("adults"));
  const children = searchParams.get("children");
  const infants = searchParams.get("infants");

  const loc = searchParams.get("loc");
  const startdate = localStorage.getItem("startDate");
  const enddate = localStorage.getItem("endDate");
  const noOfRooms = Number(localStorage.getItem("noOfRooms"));

  const date1 = new Date(String(startdate));
  const date2 = new Date(String(enddate));
  const diffTime: number = Math.abs(date1.getTime() - date2.getTime());
  const noOfNights: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  localStorage.setItem("noOfNights", String(noOfNights));

  const [isOpen, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [locationName, setLocationName] = useState(""); // State to hold the location name

  const grandTotal =
    (grandAdultTotalPrice + grandChildTotalPrice + grandExtraBedTotalPrice) *
    noOfNights;

  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");
    const date1 = new Date(String(storedStartDate));
    const date2 = new Date(String(storedEndDate));
    const diffTime: number = Math.abs(date1.getTime() - date2.getTime());
    const noOfNights: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
  }, []);

  const [startDate, endDate] = dateRange;

  // Assume total is defined here based on AddRoom's state
  const [total, setTotal] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    noOfRooms: 0,
  });


  const handleSearch = () => {
    const locationName = loc;
    if (!startDate || !endDate) {
      alert("Please fill all fields before searching.");
      return;
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    localStorage.setItem("startDate", formattedStartDate);
    localStorage.setItem("endDate", formattedEndDate);

    const searchUrl = `/hotel-listing-details?hotelDetailsId=${hotelDetailsId}&loc=${encodeURIComponent(
      locationName
    )}&startdate=${encodeURIComponent(
      formattedStartDate
    )}&enddate=${encodeURIComponent(formattedEndDate)}&adults=${total.adults
      }&children=${total.children}&infants=${total.infants}&type=${type}&noOfRooms=${total.noOfRooms
      }`;

    window.location.href = searchUrl;
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const [hotelDetails, setHotelDetails] = useState({
    id: 0,
    property_id: "",
    hotel_or_home_stay: "",
    location_name: "",
    hotel_name: "",
    description: "",
    starting_price: "",
    highest_price: "",
    ratings: "",
    created_at: "",
    max_adult: "",
    max_children: "",
    max_infant: "",
    no_of_bedrooms: "",
    no_of_bathrooms: "",
    no_of_beds: "",
    room_size: "",
    parking: "",
    banner_images: [],
    amenity_name1: "",
    amenity_name2: "",
    amenity_name3: "",
    amenity_name4: "",
    amenity_name5: "",
    amenity_name6: "",
    amenity_name7: "",
    amenity_name8: "",
    amenity_name9: "",
    amenity_name10: "",
    amenity_name11: "",
    amenity_name12: "",
    amenity_name13: "",
    amenity_name14: "",
    amenity_name15: "",
    amenity_name16: "",
    amenity_name17: "",
    amenity_name18: "",
    amenity_name19: "",
    amenity_name20: "",
    amenity_name21: "",
    amenity_name22: "",
    amenity_name23: "",
    amenity_name24: "",
    amenity_name25: "",
    amenity_name26: "",
    amenity_name27: "",
    amenity_name28: "",
    amenity_name29: "",
    amenity_name30: "",

    amenity_logo1: "",
    amenity_logo2: "",
    amenity_logo3: "",
    amenity_logo4: "",
    amenity_logo5: "",
    amenity_logo6: "",
    amenity_logo7: "",
    amenity_logo8: "",
    amenity_logo9: "",
    amenity_logo10: "",
    amenity_logo11: "",
    amenity_logo12: "",
    amenity_logo13: "",
    amenity_logo14: "",
    amenity_logo15: "",
    amenity_logo16: "",
    amenity_logo17: "",
    amenity_logo18: "",
    amenity_logo19: "",
    amenity_logo20: "",
    amenity_logo21: "",
    amenity_logo22: "",
    amenity_logo23: "",
    amenity_logo24: "",
    amenity_logo25: "",
    amenity_logo26: "",
    amenity_logo27: "",
    amenity_logo28: "",
    amenity_logo29: "",
    amenity_logo30: "",

    faq_title1: "",
    faq_description1: "",
    faq_title2: "",
    faq_description2: "",
    faq_title3: "",
    faq_description3: "",
    faq_title4: "",
    faq_description4: "",
    faq_title5: "",
    faq_description5: "",
    faq_title6: "",
    faq_description6: "",
    faq_title7: "",
    faq_description7: "",
    faq_title8: "",
    faq_description8: "",
    faq_title9: "",
    faq_description9: "",
    faq_title10: "",
    faq_description10: "",
    faq_title11: "",
    faq_description11: "",
    faq_title12: "",
    faq_description12: "",
    faq_title13: "",
    faq_description13: "",
    faq_title14: "",
    faq_description14: "",
    faq_title15: "",
    faq_description15: "",
    faq_title16: "",
    faq_description16: "",
    faq_title17: "",
    faq_description17: "",
    faq_title18: "",
    faq_description18: "",
    faq_title19: "",
    faq_description19: "",
    faq_title20: "",
    faq_description20: "",
    faq_title21: "",
    faq_description21: "",
    faq_title22: "",
    faq_description22: "",
    faq_title23: "",
    faq_description23: "",
    faq_title24: "",
    faq_description24: "",
    faq_title25: "",
    faq_description25: "",
    faq_title26: "",
    faq_description26: "",
    faq_title27: "",
    faq_description27: "",
    faq_title28: "",
    faq_description28: "",
    faq_title29: "",
    faq_description29: "",
    faq_title30: "",
    faq_description30: "",
    policy_title1: "",
    policy_description1: "",
    policy_title2: "",
    policy_description2: "",
    policy_title3: "",
    policy_description3: "",
    policy_title4: "",
    policy_description4: "",
    policy_title5: "",
    policy_description5: "",
  });

  const tooltipStyle = {
    backgroundColor: "#3539E9",
    color: "#fff",
    borderRadius: "10px",
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      if (hotelDetailsId) {
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/hotels/${hotelDetailsId}`
          );
          const result = await response.json();

          if (result.data) {
            setHotelDetails({
              id: result.data.id,
              property_id: result.data.property_id,
              hotel_or_home_stay: result.data.hotel_or_home_stay,
              location_name: result.data.location_name,
              hotel_name: result.data.hotel_name,
              description: result.data.description,
              starting_price: result.data.starting_price,
              highest_price: result.data.highest_price,
              ratings: result.data.ratings,
              created_at: result.data.created_at,
              max_adult: result.data.max_adult,
              max_children: result.data.max_children,
              max_infant: result.data.max_infant,
              no_of_bedrooms: result.data.no_of_bedrooms,
              no_of_bathrooms: result.data.no_of_bathrooms,
              no_of_beds: result.data.no_of_beds,
              room_size: result.data.room_size,
              parking: result.data.parking,
              banner_images: result.data.banner_images,
              amenity_name1: result.data.amenity_name1,
              amenity_name2: result.data.amenity_name2,
              amenity_name3: result.data.amenity_name3,
              amenity_name4: result.data.amenity_name4,
              amenity_name5: result.data.amenity_name5,
              amenity_name6: result.data.amenity_name6,
              amenity_name7: result.data.amenity_name7,
              amenity_name8: result.data.amenity_name8,
              amenity_name9: result.data.amenity_name9,
              amenity_name10: result.data.amenity_name10,
              amenity_name11: result.data.amenity_name11,
              amenity_name12: result.data.amenity_name12,
              amenity_name13: result.data.amenity_name13,
              amenity_name14: result.data.amenity_name14,
              amenity_name15: result.data.amenity_name15,
              amenity_name16: result.data.amenity_name16,
              amenity_name17: result.data.amenity_name17,
              amenity_name18: result.data.amenity_name18,
              amenity_name19: result.data.amenity_name19,
              amenity_name20: result.data.amenity_name20,
              amenity_name21: result.data.amenity_name21,
              amenity_name22: result.data.amenity_name22,
              amenity_name23: result.data.amenity_name23,
              amenity_name24: result.data.amenity_name24,
              amenity_name25: result.data.amenity_name25,
              amenity_name26: result.data.amenity_name26,
              amenity_name27: result.data.amenity_name27,
              amenity_name28: result.data.amenity_name28,
              amenity_name29: result.data.amenity_name29,
              amenity_name30: result.data.amenity_name30,


              amenity_logo1: result.data.amenity_logo1,
              amenity_logo2: result.data.amenity_logo2,
              amenity_logo3: result.data.amenity_logo3,
              amenity_logo4: result.data.amenity_logo4,
              amenity_logo5: result.data.amenity_logo5,
              amenity_logo6: result.data.amenity_logo6,
              amenity_logo7: result.data.amenity_logo7,
              amenity_logo8: result.data.amenity_logo8,
              amenity_logo9: result.data.amenity_logo9,
              amenity_logo10: result.data.amenity_logo10,
              amenity_logo11: result.data.amenity_logo11,
              amenity_logo12: result.data.amenity_logo12,
              amenity_logo13: result.data.amenity_logo13,
              amenity_logo14: result.data.amenity_logo14,
              amenity_logo15: result.data.amenity_logo15,
              amenity_logo16: result.data.amenity_logo16,
              amenity_logo17: result.data.amenity_logo17,
              amenity_logo18: result.data.amenity_logo18,
              amenity_logo19: result.data.amenity_logo19,
              amenity_logo20: result.data.amenity_logo20,
              amenity_logo21: result.data.amenity_logo21,
              amenity_logo22: result.data.amenity_logo22,
              amenity_logo23: result.data.amenity_logo23,
              amenity_logo24: result.data.amenity_logo24,
              amenity_logo25: result.data.amenity_logo25,
              amenity_logo26: result.data.amenity_logo26,
              amenity_logo27: result.data.amenity_logo27,
              amenity_logo28: result.data.amenity_logo28,
              amenity_logo29: result.data.amenity_logo29,
              amenity_logo30: result.data.amenity_logo30,

              faq_title1: result.data.faq_title1,
              faq_description1: result.data.faq_description1,
              faq_title2: result.data.faq_title2,
              faq_description2: result.data.faq_description2,
              faq_title3: result.data.faq_title3,
              faq_description3: result.data.faq_description3,
              faq_title4: result.data.faq_title4,
              faq_description4: result.data.faq_description4,
              faq_title5: result.data.faq_title5,
              faq_description5: result.data.faq_description5,
              faq_title6: result.data.faq_title6,
              faq_description6: result.data.faq_description6,
              faq_title7: result.data.faq_title7,
              faq_description7: result.data.faq_description7,
              faq_title8: result.data.faq_title8,
              faq_description8: result.data.faq_description8,
              faq_title9: result.data.faq_title9,
              faq_description9: result.data.faq_description9,
              faq_title10: result.data.faq_title10,
              faq_description10: result.data.faq_description10,
              faq_title11: result.data.faq_title11,
              faq_description11: result.data.faq_description11,
              faq_title12: result.data.faq_title12,
              faq_description12: result.data.faq_description12,
              faq_title13: result.data.faq_title13,
              faq_description13: result.data.faq_description13,
              faq_title14: result.data.faq_title14,
              faq_description14: result.data.faq_description14,
              faq_title15: result.data.faq_title15,
              faq_description15: result.data.faq_description15,
              faq_title16: result.data.faq_title16,
              faq_description16: result.data.faq_description16,
              faq_title17: result.data.faq_title17,
              faq_description17: result.data.faq_description17,
              faq_title18: result.data.faq_title18,
              faq_description18: result.data.faq_description18,
              faq_title19: result.data.faq_title19,
              faq_description19: result.data.faq_description19,
              faq_title20: result.data.faq_title20,
              faq_description20: result.data.faq_description20,

              faq_title21: result.data.faq_title21,
              faq_description21: result.data.faq_description21,
              faq_title22: result.data.faq_title22,
              faq_description22: result.data.faq_description22,

              faq_title23: result.data.faq_title23,
              faq_description23: result.data.faq_description23,

              faq_title24: result.data.faq_title24,
              faq_description24: result.data.faq_description24,

              faq_title25: result.data.faq_title25,
              faq_description25: result.data.faq_description25,
              faq_title26: result.data.faq_title26,
              faq_description26: result.data.faq_description26,

              faq_title27: result.data.faq_title27,
              faq_description27: result.data.faq_description27,
              faq_title28: result.data.faq_title28,
              faq_description28: result.data.faq_description28,

              faq_title29: result.data.faq_title29,
              faq_description29: result.data.faq_description29,
              faq_title30: result.data.faq_title30,
              faq_description30: result.data.faq_description30,

              policy_title1: result.data.policy_title1,
              policy_description1: result.data.policy_description1,
              policy_title2: result.data.policy_title2,
              policy_description2: result.data.policy_description2,
              policy_title3: result.data.policy_title3,
              policy_description3: result.data.policy_description3,
              policy_title4: result.data.policy_title4,
              policy_description4: result.data.policy_description4,
              policy_title5: result.data.policy_title5,
              policy_description5: result.data.policy_description5,
            });
          } else {
            console.error("No hotel data found in response.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchHotelData();
  }, [hotelDetailsId]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let response;
        if (type == "null") {
          console.log("Fetching data with loc and date");
          response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/room-management/filter/${loc}/${startdate}/${enddate}`
          );
        } else {
          console.log("Fetching data with hotel id");
          response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/hotels/${hotelDetailsId}/rooms`
          );
        }

        const result = await response.json();
        console.log("API result:", result); // Log the API result

        // Adjust the success message condition here
        if (
          result.message === "Data retrieved successfully" ||
          result.message === "Rooms retrieved successfully"
        ) {
          let formattedRooms: Room[] = [];

          if (type == "null") {
            formattedRooms = result.data.map((data: any) => ({
              id: data.room_management.room_id,
              img: data.room_management.featured_images[0] || "/img/default-room.jpg",
              title: data.room_management.room_name,
              amenity_name1: amenities[0]?.amenity_name || '',
              amenity_logo1: amenities[0]?.amenity_logo || '',
              amenity_name2: amenities[1]?.amenity_name || '',
              amenity_logo2: amenities[1]?.amenity_logo || '',
              amenity_name3: amenities[2]?.amenity_name || '',
              amenity_logo3: amenities[2]?.amenity_logo || '',
              amenity_name4: amenities[3]?.amenity_name || '',
              amenity_logo4: amenities[3]?.amenity_logo || '',
              
              price: parseFloat(data.room_management.room_price),
              child_price: parseFloat(data.room_management.child_price),
              extra_bed_price: parseFloat(data.room_management.extra_bed_price),
            }));
            console.log("Formatted rooms with loc:", formattedRooms); // Log formatted rooms
          } else {
            formattedRooms = result.data.map((room: any) => ({
              id: room.id,
              img: room.featured_images[0] || "/img/default-room.jpg",
              title: room.room_name,
              amenity_name1: room.amenity_name1,
              amenity_name2: room.amenity_name2,
              amenity_name3: room.amenity_name3,
              amenity_name4: room.amenity_name4,
              amenity_logo1: room.amenity_logo1,
              amenity_logo2: room.amenity_logo2,
              amenity_logo3: room.amenity_logo3,
              amenity_logo4: room.amenity_logo4,
              
              price: parseFloat(room.room_price),
              child_price: parseFloat(room.child_price),
              extra_bed_price: parseFloat(room.extra_bed_price),
            }));
            console.log("Formatted rooms without HotelID:", formattedRooms); // Log formatted rooms
          }

          setRoomData(formattedRooms);
        } else {
          console.log(
            "No rooms found or message not matching:",
            result.message
          );
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, [loc, startdate, enddate, hotelDetailsId]);

  const handleRestrict = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.log("i am inside booking process function");
      router.push("/sign-in");
    } else {
      const roomIdsQuery = selectedRoomIds.join(",");
      router.push(
        `/payment-method?totalAdultPrice=${grandAdultTotalPrice}&totalChildPrice=${grandChildTotalPrice}&totalExtraBedPrice=${grandExtraBedTotalPrice}&grandTotal=${grandTotal}&roomIds=${roomIdsQuery}`
      );
    }
  };

  const amenities = [];
  for (let i = 1; i <= 30; i++) {
    const amenityName = hotelDetails[`amenity_name${i}`];
    const amenityLogo = hotelDetails[`amenity_logo${i}`];

    if (amenityName && amenityLogo) {
      amenities.push({ name: amenityName, logo: amenityLogo });
    }
  }

  return (
    <main>
      <div className="bg-[var(--bg-2)] ">
        <div className="container-fluid p-0">
          <div>
            <div className="col-span-12">
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
                className="swiper property-gallery-slider "
              >
                {hotelDetails?.banner_images?.map((image, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <Link
                      href={image}
                      className="link block property-gallery mt-[90px]"
                    >
                      <Image
                        width={618}
                        height={618}
                        src={image}
                        alt={`banner image ${index + 1}`}
                        className="rounded-2xl object-cover h-[500px] w-[618px]"
                      />
                    </Link>
                  </SwiperSlide>
                ))}

                <button className="btn-prev absolute top-[45%] left-4 z-[1] bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white duration-300">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button className="btn-next absolute top-[45%] right-4 z-[1] bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white duration-300">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </Swiper>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-[var(--bg-2)] py-[30px] lg:py-[60px] px-3">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 xl:col-span-8">
              <div className="p-4 rounded-2xl bg-white mb-6 lg:mb-10">
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border  rounded-2xl mb-10">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                    <h2 className="mt-4 h2 mb-0">{hotelDetails.hotel_name}</h2>
                    {/* <ul className="flex gap-3 items-center">
                      <li>
                        <Link
                          href="#"
                          className="link w-8 h-8 grid place-content-center bg-[var(--primary-light)] text-primary rounded-full hover:bg-primary hover:text-white"
                        >
                          <HeartIcon className="h-5 w-5" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="link w-8 h-8 grid place-content-center bg-[var(--primary-light)] text-primary rounded-full hover:bg-primary hover:text-white"
                        >
                          <ArrowsRightLeftIcon className="w-5 h-5" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="link w-8 h-8 grid place-content-center bg-[var(--primary-light)] text-primary rounded-full hover:bg-primary hover:text-white"
                        >
                          <ShareIcon className="w-5 h-5" />
                        </Link>
                      </li>
                    </ul> */}
                  </div>
                  <ul className="flex flex-wrap items-center justify-between gap-4 gap-md-0">
                    <li>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-[var(--secondary-500)]" />
                        <p className="mb-0"> {hotelDetails.location_name}</p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <p className="mb-0">
                        ID:{" "}
                        <span className="text-primary">
                          {hotelDetails.property_id}
                        </span>
                      </p>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                        <p className="mb-0"> {hotelDetails.ratings} </p>
                      </div>
                    </li>
                    <li className="text-primary text-lg">•</li>
                    <li>
                      <p className="mb-0">
                        <span className="clr-neutral-500">Published : </span>
                        {new Date(hotelDetails.created_at).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </li>

                  </ul>
                  <div className="border border-dashed my-8"></div>
                  <ul className="flex items-center flex-wrap gap-3">
                    {amenities.map((amenity, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        {/* Tooltip trigger container */}
                        <div
                          data-tooltip-id={amenity.name}
                          className="grid place-content-center w-10 h-10 rounded-full bg-[var(--bg-2)] text-primary"
                        >
                          <img
                            src={amenity.logo}
                            alt={amenity.name}
                            style={{ width: '30px', height: '30px', marginRight: '10px' }}
                          />
                        </div>

                        {/* Tooltip content */}
                        <Tooltip
                          id={amenity.name}
                          style={tooltipStyle}
                          offset={7}
                          content={amenity.name}
                        />
                      </li>
                    ))}
                  </ul>



                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border  rounded-2xl mb-10">
                  <h4 className="mb-5 text-2xl font-semibold"> Description </h4>
                  <p className="mb-5 clr-neutral-500">
                    {hotelDetails.description}
                  </p>

                </div>

                <div className="flex flex-wrap gap-5 mt-6 bg-white p-5 rounded-xl shadow-lg justify-center items-center mt-[30px] mb-[30px]">


                  <div className="relative w-full md:w-[70%] xl:w-[40%] flex items-center bg-gray-100 rounded-full p-3 border ">
                    <DatePicker
                      placeholderText="2024-10-30 - 2024-11-01"
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      className="w-full text-center bg-transparent outline-none"
                      dateFormat="MM/dd/yyyy"
                    />
                    <button
                      type="button"
                      className="absolute right-3"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      {/* <CalendarDaysIcon className="w-6 h-6 text-gray-600" /> */}
                    </button>
                  </div>


                  <button
                    onClick={handleSearch} // Call the search function on click
                    className="py-3 px-6 w-full md:w-auto flex justify-center items-center bg-primary text-white rounded-full"
                  >
                    <span className="ml-2">Search Room</span>
                  </button>
                </div>


                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border  rounded-2xl mb-10">
                  <h4 className="mb-5 text-2xl font-semibold">
                    {" "}
                    Featured Room{" "}
                  </h4>
                  <ul className="flex flex-col gap-4">
                    {roomData.map((item) => (
                      <HotelDetailsFeaturedRoom
                        key={item.id}
                        item={item}
                        noOfRooms={noOfRooms}
                        noOfNights={noOfNights}
                        adults={adults}
                        onSelectionChange={handleSelectionChange}
                        onBookNowClick={handleBookNowClick}
                      />
                    ))}
                    {totalSelected > noOfRooms && (
                      <p style={{ color: "red" }}>
                        Combined selection exceeds allowed limit!
                      </p>
                    )}
                  </ul>
                  {selectedRoomIds.length > 0 && (
                    <p>Selected Room IDs: {selectedRoomIds.join(", ")}</p>
                  )}
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border rounded-2xl mb-5">
                  <h4 className="mb-5 text-2xl font-semibold">
                    {" "}
                    Hotel Policies{" "}
                  </h4>
                  <ul className="flex flex-col gap-4 mb-5">
                    {hotelDetails.policy_title1 &&
                      hotelDetails.policy_description1 && (
                        <li>
                          <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">
                              <div className="font-bold">
                                {hotelDetails.policy_title1}
                              </div>
                              <span>{hotelDetails.policy_description1}</span>
                            </span>
                          </div>
                        </li>
                      )}

                    {hotelDetails.policy_title2 &&
                      hotelDetails.policy_description2 && (
                        <li>
                          <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">
                              <div className="font-bold">
                                {hotelDetails.policy_title2}
                              </div>
                              <span>{hotelDetails.policy_description2}</span>
                            </span>
                          </div>
                        </li>
                      )}

                    {hotelDetails.policy_title3 &&
                      hotelDetails.policy_description3 && (
                        <li>
                          <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">
                              <div className="font-bold">
                                {hotelDetails.policy_title3}
                              </div>
                              <span>{hotelDetails.policy_description3}</span>
                            </span>
                          </div>
                        </li>
                      )}

                    {hotelDetails.policy_title4 &&
                      hotelDetails.policy_description4 && (
                        <li>
                          <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">
                              <div className="font-bold">
                                {hotelDetails.policy_title4}
                              </div>
                              <span>{hotelDetails.policy_description4}</span>
                            </span>
                          </div>
                        </li>
                      )}

                    {hotelDetails.policy_title5 &&
                      hotelDetails.policy_description5 && (
                        <li>
                          <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                              <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">
                              <div className="font-bold">
                                {hotelDetails.policy_title5}
                              </div>
                              <span>{hotelDetails.policy_description5}</span>
                            </span>
                          </div>
                        </li>
                      )}
                  </ul>

                  {/* <Link
                    href="#"
                    className="link flex items-center gap-2 text-primary">
                    <span className="font-semibold inline-block">
                      Read More
                    </span>
                    <ArrowLongRightIcon className="w-5 h-5" />
                  </Link> */}
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] border  rounded-2xl mb-10">
                  <h4 className="mb-5 text-2xl font-semibold"> FAQ </h4>
                  <ul className="flex flex-col gap-4 mb-5">
                    <li>
                      <div className="flex gap-4">
                        <div className="faq-list">
                          {hotelDetails.faq_title1 &&
                            hotelDetails.faq_description1 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title1}
                                  </div>
                                  <span>{hotelDetails.faq_description1}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title2 &&
                            hotelDetails.faq_description2 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title2}
                                  </div>
                                  <span>{hotelDetails.faq_description2}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title3 &&
                            hotelDetails.faq_description3 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title3}
                                  </div>
                                  <span>{hotelDetails.faq_description3}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title4 &&
                            hotelDetails.faq_description4 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title4}
                                  </div>
                                  <span>{hotelDetails.faq_description4}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title5 &&
                            hotelDetails.faq_description5 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title5}
                                  </div>
                                  <span>{hotelDetails.faq_description5}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title6 &&
                            hotelDetails.faq_description6 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title6}
                                  </div>
                                  <span>{hotelDetails.faq_description6}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title7 &&
                            hotelDetails.faq_description7 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title7}
                                  </div>
                                  <span>{hotelDetails.faq_description7}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title8 &&
                            hotelDetails.faq_description8 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title8}
                                  </div>
                                  <span>{hotelDetails.faq_description8}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title9 &&
                            hotelDetails.faq_description9 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title9}
                                  </div>
                                  <span>{hotelDetails.faq_description9}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title10 &&
                            hotelDetails.faq_description10 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title10}
                                  </div>
                                  <span>{hotelDetails.faq_description10}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title11 &&
                            hotelDetails.faq_description11 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title12}
                                  </div>
                                  <span>{hotelDetails.faq_description12}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title12 &&
                            hotelDetails.faq_description12 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title12}
                                  </div>
                                  <span>{hotelDetails.faq_description12}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title13 &&
                            hotelDetails.faq_description13 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title13}
                                  </div>
                                  <span>{hotelDetails.faq_description13}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title14 &&
                            hotelDetails.faq_description14 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title14}
                                  </div>
                                  <span>{hotelDetails.faq_description14}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title15 &&
                            hotelDetails.faq_description15 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title15}
                                  </div>
                                  <span>{hotelDetails.faq_description15}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title16 &&
                            hotelDetails.faq_description16 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title16}
                                  </div>
                                  <span>{hotelDetails.faq_description16}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title17 &&
                            hotelDetails.faq_description17 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title17}
                                  </div>
                                  <span>{hotelDetails.faq_description17}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title18 &&
                            hotelDetails.faq_description18 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title18}
                                  </div>
                                  <span>{hotelDetails.faq_description18}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title19 &&
                            hotelDetails.faq_description19 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title19}
                                  </div>
                                  <span>{hotelDetails.faq_description19}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title20 &&
                            hotelDetails.faq_description20 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title20}
                                  </div>
                                  <span>{hotelDetails.faq_description20}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title21 &&
                            hotelDetails.faq_description21 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title21}
                                  </div>
                                  <span>{hotelDetails.faq_description21}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title22 &&
                            hotelDetails.faq_description22 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title22}
                                  </div>
                                  <span>{hotelDetails.faq_description22}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title23 &&
                            hotelDetails.faq_description23 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title23}
                                  </div>
                                  <span>{hotelDetails.faq_description23}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title24 &&
                            hotelDetails.faq_description24 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title24}
                                  </div>
                                  <span>{hotelDetails.faq_description24}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title25 &&
                            hotelDetails.faq_description25 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title25}
                                  </div>
                                  <span>{hotelDetails.faq_description25}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title26 &&
                            hotelDetails.faq_description26 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title26}
                                  </div>
                                  <span>{hotelDetails.faq_description26}</span>
                                </span>
                              </div>
                            )}

                          {hotelDetails.faq_title27 &&
                            hotelDetails.faq_description27 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title27}
                                  </div>
                                  <span>{hotelDetails.faq_description27}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title28 &&
                            hotelDetails.faq_description28 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title28}
                                  </div>
                                  <span>{hotelDetails.faq_description28}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title29 &&
                            hotelDetails.faq_description29 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title29}
                                  </div>
                                  <span>{hotelDetails.faq_description29}</span>
                                </span>
                              </div>
                            )}
                          {hotelDetails.faq_title30 &&
                            hotelDetails.faq_description30 && (
                              <div className="flex gap-4">
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                  <i className="las la-check text-lg text-primary"></i>
                                </div>
                                <span className="inline-block">
                                  <div className="font-bold">
                                    {hotelDetails.faq_title30}
                                  </div>
                                  <span>{hotelDetails.faq_description30}</span>
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-white rounded-2xl">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Link
                      href="#"
                      className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-1"
                    >
                      <ArrowLongLeftIcon className="w-5 h-5" />
                      <span className="inline-block font-semibold">
                        Prev Hotel
                      </span>
                    </Link>

                    <Link
                      href="#"
                      className="link flex items-center clr-neutral-500 hover:text-primary gap-1 order-2"
                    >
                      <span className="inline-block font-semibold">
                        Next Hotel
                      </span>
                      <ArrowLongRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4">
              <div className="pb-0 mb-6 relative">
                <div className="bg-white rounded-2xl py-8 px-6">
                  <p className="mb-3 text-lg font-medium"> Price </p>
                  <div className="flex items-start gap-2 mb-6">
                    <div className="flex gap-3 items-center">
                      <i className="las la-tag text-2xl"></i>
                      <p className="mb-0"> From </p>
                      <h3 className="h3 mb-0">
                        {" "}
                        ₹{hotelDetails.starting_price}-
                        {hotelDetails.highest_price}{" "}
                      </h3>
                    </div>
                    <i className="las la-info-circle text-2xl"></i>
                  </div>

                  <Tab.Group>
                    <Tab.List className="flex gap-3 about-tab mb-7">
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "focus:outline-none",
                            selected ? "text-primary font-medium" : ""
                          )
                        }
                      >
                        Booking Form
                      </Tab>{" "}
                      <span>|</span>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "focus:outline-none",
                            selected ? "text-primary font-medium" : ""
                          )
                        }
                      >
                        Equiry Form
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="tab-content mb-6 lg:mb-8">
                      <Tab.Panel>
                        <div className="grid grid-cols-1 gap-3">
                          {/* <div className="col-span-1">
                            <div className="w-full flex">
                              <input
                                type="text"
                                className="w-[80%] md:w-[90%] focus:outline-none bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5"
                                placeholder="Checkin"
                              />
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-calendar-alt"></i>
                              </span>
                            </div>
                          </div> */}
                          {/* <div className="col-span-1">
                            <div className="w-full flex">
                              <input
                                type="text"
                                className="w-[80%] md:w-[90%] focus:outline-none bg-[var(--bg-2)] border border-r-0 border-neutral-40 rounded-s-full rounded-end-0 py-3 px-5"
                                placeholder="Checkout"
                              />
                              <span className="input-group-text bg-[var(--bg-2)] border border-l-0 border-neutral-40 rounded-e-full py-[14px] text-gray-500 pe-4 ps-0">
                                <i className="las text-2xl la-clock"></i>
                              </span>
                            </div>
                          </div> */}
                        </div>

                        {/* <div className="flex items-center justify-between mb-4 mt-6">
                          <p className="mb-0 clr-neutral-500">Adult Price</p>
                          <p className="mb-0 font-medium">
                            ${selectedRoomPrice?.room_price || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">
                            Extra Bed Price
                          </p>
                          <p className="mb-0 font-medium">
                            ${selectedRoomPrice?.extra_bed_price || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">Child Price</p>$
                          {selectedRoomPrice
                            ? selectedRoomPrice.child_price * 2
                            : 0}
                        </div> */}

                        <div className="flex items-center justify-between mb-4 mt-6">
                          <p className="mb-0 clr-neutral-500">
                            Total Adult Price:{" "}
                          </p>
                          <p className="mb-0 font-medium">
                            {" "}
                            ₹ {grandAdultTotalPrice}{" "}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">
                            Total Extra Bed Price:{" "}
                          </p>
                          <p className="mb-0 font-medium">
                            ₹
                            {grandExtraBedTotalPrice}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">
                            Total Child Price:{" "}
                          </p>
                          <p className="mb-0 font-medium">
                            ₹
                            {grandChildTotalPrice}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">
                            <p>Total Price/Night </p>
                          </p>
                          <p className="mb-0 font-medium">
                            ₹
                            {grandAdultTotalPrice +
                              grandChildTotalPrice +
                              grandExtraBedTotalPrice}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="mb-0 clr-neutral-500">
                            <p>Total Price/{noOfNights} Nights </p>
                          </p>
                          <p className="mb-0 font-medium">₹{grandTotal}</p>
                        </div>

                        <div className="hr-dashed my-4"></div>
                        <div className="flex items-center justify-between"></div>
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
                            className="w-full rounded-3xl bg-[var(--bg-1)] border focus:outline-none py-2 px-3 md:py-3 md:px-4"
                          ></textarea>
                          <CheckboxCustom label="I agree with Terms of Service and Privacy Statement" />
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>

                  <p></p>

                  <Link
                    href={`/payment-method?totalAdultPrice=${grandAdultTotalPrice}&totalChildPrice=${grandChildTotalPrice}&totalExtraBedPrice=${grandExtraBedTotalPrice}&grandTotal=${grandTotal}&roomIds=${selectedRoomIds.join(
                      ","
                    )}`}
                    onClick={handleRestrict}
                    className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:bg-primary-400 hover:text-white font-medium w-full justify-center mb-6"
                  >
                    <span className="inline-block">Proceed Booking</span>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
