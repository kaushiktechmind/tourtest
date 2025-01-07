"use client"
import CheckboxCustom from "@/components/Checkbox";
import CustomRangeSlider from "@/components/RangeSlider";
import { flightList } from "@/public/data/flightlist";
import { flightTypes } from "@/public/data/flighttypes";
import { SearchIcon } from "@/public/data/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripType = searchParams.get("tripType");

  const travelData = JSON.parse(localStorage.getItem('travelData') || 'null');

  const locationIds = {
    "Port Blair": 1,
    "Swaraj Dweep  (Havelock) ": 2,
    "Shaheed Dweep (Neil)": 3,
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
  const travel_date2 = travelData?.travel_date2;


  // Fetching IDs for `from` and `to` based on the mapping
  const fromId = locationIds[from2] || null;
  const toId = locationIds[to2] || null;


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
        travel_date: travelData?.travel_date2,
        return_travel_date: travelData?.travel_date2,
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

      if (response.ok) {
        // Check for response structure
        const schedule =
          tripType === "single_trip"
            ? data.data // Direct access for single trips
            : data.data.schedule; // Nested access for multiple trips

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 or 12-hour to 12-hour clock
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleSelectFerry = (shipClassId: string) => {
    // Find the selected object from scheduleData
    const selectedFerry = scheduleData?.find(
      (item: any) => item.ship_class_id === shipClassId
    );
  
    if (selectedFerry) {
      localStorage.setItem('selectedFerry2', JSON.stringify(selectedFerry));
      console.log('Selected ferry object:', selectedFerry);
    } else {
      console.error('Ferry object not found for ship_class_id:', shipClassId);
    }
  };
  



  return (
    <div className="py-[30px] lg:py-[60px]">

      <div className="container">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 mt-6">
          <div className="flex items-center space-x-6 flex-wrap">
            {/* Always show the first pair */}
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">{from1} -&gt; </p>
              <p className="text-gray-600">{to1}</p>
            </div>

            {/* Show the second pair only if from2 is available */}
            {from2 && (
              <div className="flex items-center space-x-2">
                <p className="text-green-600">{from2} -&gt; </p>
                <p className="text-green-600">{to2}</p>
              </div>
            )}

            {/* Show the third pair only if from2 is available */}
            {from2 && (
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">{from3} -&gt; </p>
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
            <div className="grid grid-cols-1 gap-4 lg:gap-6">

              {scheduleData.map((schedule, index) => (

                <div key={schedule.id || index} className="col-span-1">
                  <div className="md:flex bg-white border rounded-2xl mx-3 xl:mx-0">
                    <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
                      <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                        <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                          <div className="grid place-content-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto ms-md-0">
                            <Image
                              width={52}
                              height={27}
                              src={'/img/makruzz.jpg'}
                              alt="image"
                              className=" object-fit-contain"
                            />
                          </div>
                          <p className="mb-0 font-medium">{schedule.ship_title}</p>
                        </div>
                        <div className="flex md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow w-full md:w-auto">
                          <span className="block text-primary">From</span>
                          <h4 className="mb-0 text-2xl font-semibold">
                          {formatTime(schedule.departure_time)}
                          </h4>
                          <span className="block text-[var(--neutral-700)]">
                            {schedule.source_name}
                          </span>
                        </div>
                        <div className="flex w-full md:w-auto justify-center flex-col gap-2 text-center flex-grow">
                        <div className="grid place-content-center w-12 h-12 shadow-lg rounded-full mx-auto">
                            <div className="grid place-content-center w-10 h-10 bg-[var(--primary-light)] text-primary rounded-full">
                              {/* Replace the flight icon with a boat icon */}
                              <i className="las la-ship text-2xl"></i>
                            </div>
                          </div>
                         
                          <span className="block clr-neutral-500">
                            {calculateTimeDifference(schedule.departure_time, schedule.arrival_time)}
                          </span>
                        </div>
                        <div className="flex w-full md:w-auto md:flex-col justify-between gap-2 my-6 md:my-0 flex-grow">
                          <span className="block text-primary">To</span>
                          <h4 className="mb-0 text-2xl font-semibold">
                          {formatTime(schedule.arrival_time)}
                          </h4>
                          <span className="block text-[var(--neutral-700)]">
                            {schedule.destination_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center text-center gap-3 rounded-xl bg-[#F7F7FE] p-3">
                        <p className="mb-0">
                          Seats:
                          <span className="text-amber-700"> {schedule.seat}</span>
                        </p>
                        <p className="text-primary">•</p>
                        <p className="mb-0">
                          Travel Class:
                          <span className="text-primary"> {schedule.ship_class_title}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 lg:p-6 xl:pt-10 xxl:pt-14 bg-[var(--bg-2)] text-center md:text-start rounded-e-2xl">
                      <div className="flex items-center justify-center justify-content-md-start gap-2 mb-6">
                        <h2 className="mb-0 h2 text-[var(--neutral-700)]">
                          {" "}
                          ₹{schedule.ship_class_price}
                        </h2>
                      </div>
                      <Link
                        href={from3 ? `/ferry-list3?tripType=${tripType}` : "/ferry-details-page"} onClick={() => handleSelectFerry(schedule.ship_class_id)}
                        className="btn-outline  flex justify-center text-primary">
                        Select Ferry
                      </Link>
                    </div>
                  </div>
                </div>
              ))}




              <div className="col-span-1">
                <nav>
                  <ul className="flex gap-3 justify-center">
                    <li className="page-item">
                      <Link
                        className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
                        href="#">
                        <ChevronLeftIcon className="w-5 h-5" />
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link
                        className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] bg-primary text-white"
                        href="#">
                        1
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link
                        className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
                        href="#">
                        2
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link
                        className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
                        href="#">
                        3
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link
                        className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
                        href="#">
                        <ChevronRightIcon className="w-5 h-5" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
