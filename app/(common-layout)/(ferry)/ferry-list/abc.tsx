"use client"
import CheckboxCustom from "@/components/Checkbox";
import CustomRangeSlider from "@/components/RangeSlider";
import { flightList } from "@/public/data/flightlist";
import { flightTypes } from "@/public/data/flighttypes";
import { SearchIcon } from "@/public/data/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Register modules
// Swiper.use([Navigation, Pagination]);

import {
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tripType = searchParams.get("tripType");

    const travelData = JSON.parse(localStorage.getItem('travelData'));

    const locationIds = {
        "Port Blair": 1,
        "Swaraj Dweep  (Havelock) ": 2,
        "Shaheed Dweep (Neil)": 3,
    };
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const openDialog = (schedule) => {
        setSelectedSchedule(schedule);  // Set the selected schedule
        setIsDialogOpen(true);  // Open the dialog
    };

    const closeDialog = () => {
        setIsDialogOpen(false);  // Close the dialog
    };
    // Extracting data from travelData
    const from1 = travelData?.from1;
    const to1 = travelData?.to1;
    const from2 = travelData?.from2;
    const to2 = travelData?.to2;
    const from3 = travelData?.from3;
    const to3 = travelData?.to3;
    const adults = travelData?.adults;
    const infants = travelData?.infants;
    const no_of_passengers = travelData?.no_of_passengers;
    const travel_date1 = travelData?.travel_date1;

    console.log("zzzzzzzzzzzz", travel_date1, from1, to1, adults, infants, no_of_passengers, tripType);

    // Fetching IDs for `from` and `to` based on the mapping
    const fromId = locationIds[from1] || null;
    const toId = locationIds[to1] || null;


    const [scheduleData, setScheduleData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    const fetchScheduleData = async () => {
        const token = localStorage.getItem("Mak_Authorization");
        const headers = {
            "Content-Type": "application/json",
            "Mak_Authorization": token,
        };

        const requestPayload = {
            data: {
                trip_type: tripType === "single_trip" ? "single_trip" : "return_trip",
                from_location: fromId,
                to_location: toId,
                travel_date: travelData?.travel_date1,
                return_travel_date: travelData?.travel_date1,
                no_of_passenger: travelData?.no_of_passengers,
            },
        };

        const apiUrl =
            tripType === "single_trip"
                ? "https://staging.makruzz.com/booking_api/schedule_search"
                : "https://staging.makruzz.com/booking_api/return_schedule_search";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers,
                body: JSON.stringify(requestPayload),
            });
            const data = await response.json();
            console.log("fetched data", data);

            if (response.ok) {
                // Check for response structure
                const schedule =
                    tripType === "single_trip"
                        ? data.data // Direct access for single trips
                        : data.data.schedule; // Nested access for multiple trips
                console.log("schedule data", schedule);

                setScheduleData(schedule);
            } else {
                throw new Error(data.message || "Failed to fetch schedule");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripType) {
            fetchScheduleData();
        }
    }, [tripType]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const calculateTimeDifference = (departureTime: string, arrivalTime: string) => {
        const formatTime = (time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, seconds, 0);
            return date;
        };

        const departureDate = formatTime(departureTime);
        const arrivalDate = formatTime(arrivalTime);

        const timeDifference = arrivalDate.getTime() - departureDate.getTime();

        // Convert time difference from milliseconds to hours and minutes
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };



    return (
        <div className="py-[30px] lg:py-[60px]">

            <div className="container">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 mt-6">
                    <div className="flex items-center space-x-6 flex-wrap">
                        {/* Always show the first pair */}
                        <div className="flex items-center space-x-2">
                            <p className="text-green-600">{from1} -> </p>
                            <p className="text-green-600">{to1}</p>
                        </div>

                        {/* Show the second pair only if from2 is available */}
                        {from2 && (
                            <div className="flex items-center space-x-2">
                                <p className="text-gray-600">{from2} -> </p>
                                <p className="text-gray-600">{to2}</p>
                            </div>
                        )}

                        {/* Show the third pair only if from2 is available */}
                        {from2 && (
                            <div className="flex items-center space-x-2">
                                <p className="text-gray-600">{from3} -> </p>
                                <p className="text-gray-600">{to3}</p>
                            </div>
                        )}
                    </div>
                </div>





                <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[10px]">

                    <div className="col-span-12 lg:col-span-4 order-2 lg:order-1 ">
                        <div className="py-6 px-8 bg-white rounded-2xl shadow-lg">
                            <h4 className="mb-0 text-2xl font-semibold"> Filter </h4>
                            <div className="border-t border-dashed my-6"></div>
                            <div className="flex items-center justify-between rounded-full border bg-[var(--bg-2)] px-5 py-3">
                                <input
                                    type="text"
                                    className="bg-transparent border-0 w-[180px] focus:outline-none"
                                    placeholder="Search by flight name"
                                />
                                <button
                                    type="button"
                                    className="border-0 bg-transparent p-0 shrink-0 lh-1">
                                    <SearchIcon />
                                </button>
                            </div>
                            <div className="border-t border-dashed my-6"></div>
                            <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                                Category
                            </p>
                            <ul className="flex flex-wrap items-center gap-3">
                                <li>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="accent-[var(--primary)] scale-125"
                                            type="radio"
                                            name="property-type"
                                            id="rent-category"
                                        />
                                        <label
                                            className="inline-block text-lg font-medium cursor-pointer"
                                            htmlFor="rent-category">
                                            One Way
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="accent-[var(--primary)] scale-125"
                                            type="radio"
                                            name="property-type"
                                            id="buy-category"
                                        />
                                        <label
                                            className="inline-block text-lg font-medium cursor-pointer"
                                            htmlFor="buy-category">
                                            Round Trip
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="accent-[var(--primary)] scale-125"
                                            type="radio"
                                            name="property-type"
                                            id="sell-category"
                                        />
                                        <label
                                            className="inline-block text-lg font-medium cursor-pointer"
                                            htmlFor="sell-category">
                                            Multi City
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            <div className="border-t border-dashed my-6"></div>
                            <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                                No. of Stops
                            </p>
                            <ul className="flex flex-col gap-2">
                                {/* <li>
                  <CheckboxCustom label="Non Stop" />
                </li> */}
                                <li>
                                    <CheckboxCustom label="1 Stop" />
                                </li>
                                <li>
                                    <CheckboxCustom label="2+ Stop" />
                                </li>
                                <li>
                                    <CheckboxCustom label="3+ Stop" />
                                </li>
                                <li>
                                    <CheckboxCustom label="4+ Stop" />
                                </li>
                            </ul>
                            <div className="border-t border-dashed my-6"></div>
                            <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                                Departure Time
                            </p>
                            <ul className="flex flex-col gap-3">
                                <li className="flex justify-between items-center">
                                    <CheckboxCustom label="Early Morning" />
                                    <span>12am - 8am</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <CheckboxCustom label="Morning" />
                                    <span>8am - 12pm</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <CheckboxCustom label="Mid Day" />
                                    <span>12pm - 4pm</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <CheckboxCustom label="Evening Night" />
                                    <span>4pm - 8pm</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <CheckboxCustom label="Night" />
                                    <span>8pm - 12am</span>
                                </li>
                            </ul>
                            <div className="border-t border-dashed my-6"></div>
                            <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                                Pricing scale
                            </p>
                            <CustomRangeSlider />
                            <div className="border-t border-dashed my-6"></div>
                            <p className="mb-4 text-[var(--neutral-700)] text-xl font-medium">
                                Types of Airlines
                            </p>
                            <ul className="flex flex-col gap-3">
                                {flightTypes.map(({ id, number, title }) => (
                                    <li key={id} className="flex justify-between items-center">
                                        <CheckboxCustom label={title} />
                                        <span>{number}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-dashed my-6"></div>
                            <Link
                                href="#"
                                className="btn-outline  flex justify-center gap-2 text-primary">
                                <ArrowPathIcon className="w-5 h-5" />
                                Read More
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-8 order-1 lg:order-2">
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity">
                            <div className="bg-white p-6 rounded-lg w-1/2">
                                <div className="mt-4">
                                    <Swiper
                                        modules={[Navigation, Pagination]} // Include required modules
                                        spaceBetween={20}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                    >
                                        <SwiperSlide>
                                            <img src="/img/ferry1.jpg" alt="Ferry Image 1" className="rounded-lg w-full" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/img/ferry1.jpg" alt="Ferry Image 2" className="rounded-lg w-full" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/img/ferry1.jpg" alt="Ferry Image 3" className="rounded-lg w-full" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/img/ferry1.jpg" alt="Ferry Image 4" className="rounded-lg w-full" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/img/ferry1.jpg" alt="Ferry Image 5" className="rounded-lg w-full" />
                                        </SwiperSlide>
                                    </Swiper>
                                </div>

                                <h2 className="text-2xl font-semibold">Ferry Details</h2>
                                <p><strong>Ship Title:</strong> {selectedSchedule?.ship_title}</p>
                                <p><strong>Departure Time:</strong> {selectedSchedule?.departure_time}</p>
                                <p><strong>Arrival Time:</strong> {selectedSchedule?.arrival_time}</p>
                                <p><strong>From:</strong> {selectedSchedule?.source_name}</p>
                                <p><strong>To:</strong> {selectedSchedule?.destination_name}</p>

                                <button onClick={closeDialog} className="mt-4 bg-primary text-white p-2 rounded-lg">
                                    Close
                                </button>
                                <Link
                                    href={from2 ? `/ferry-list2?tripType=${tripType}` : "/ferry-details-page"}
                                    className="mt-4 ml-2 bg-primary text-white p-2 rounded-lg"
                                >
                                    Proceed
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
