"use client"
import CheckboxCustom from "@/components/Checkbox";
import CustomRangeSlider from "@/components/RangeSlider";
import { flightTypes } from "@/public/data/flighttypes";
import { SearchIcon } from "@/public/data/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal, Suspense } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import SelectPeople from "@/components/home-6/SelectPeople";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";


interface Trip {
  id: number;
  from: string;
  to: string;
  date: Date | null; // Assuming `date` can be a Date object or null
}


const FerryList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storedTripType = searchParams.get("tripType");


  const [tripData, setTripData] = useState<any>(null);

  const storedTravelData = JSON.parse(localStorage.getItem('travelData') || 'null');


  const locationIds: { [key: string]: number } = {
    "Port Blair": 1,
    "Swaraj Dweep  (Havelock) ": 2,
    "Shaheed Dweep (Neil)": 3,
  };

  type Location = keyof typeof locationIds;



  // Extracting data from storedTravelData
  const storedFrom1 = storedTravelData?.from1;
  const storedTo1 = storedTravelData?.to1;
  const storedFrom2 = storedTravelData?.from2;
  const storedTo2 = storedTravelData?.to2;
  const storedFrom3 = storedTravelData?.from3;
  const storedTo3 = storedTravelData?.to3;
  // const storedAdults = storedTravelData?.adults;
  // const storedInfants = storedTravelData?.infants;
  // const stored_no_of_passengers = storedTravelData?.no_of_passengers;
  // const travel_date1 = storedTravelData?.travel_date1;

  // Fetching IDs for `from` and `to` based on the mapping
  const fromId = locationIds[storedFrom1] || null;
  const toId = locationIds[storedTo1] || null;
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [trips, setTrips] = useState<Trip[]>([{ id: 1, from: "", to: "", date: null }]);
  const [tripType, setTripType] = useState(storedTripType); // State for the selected trip type (single_trip or return_trip)
  // const router = useRouter();

  const [adult, setAdult] = useState(storedTravelData?.adults);
  const [infants, setInfants] = useState(storedTravelData?.infants);



  const fetchScheduleData = async () => {
    const token = localStorage.getItem("Mak_Authorization") || '';
    const headers = {
      "Content-Type": "application/json",
      "Mak_Authorization": token,
    };

    const requestPayload = {
      data: {
        trip_type: storedTripType === "single_trip" ? "single_trip" : "return_trip",
        from_location: fromId,
        to_location: toId,
        travel_date: storedTravelData?.travel_date1,
        return_travel_date: storedTravelData?.travel_date1,
        no_of_passenger: storedTravelData?.no_of_passengers,
      },
    };

    const apiUrl =
      storedTripType === "single_trip"
        ? "https://staging.makruzz.com/booking_api/schedule_search"
        : "https://staging.makruzz.com/booking_api/return_schedule_search";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestPayload),
      });
      const data = await response.json();
      // console.log("fetched data", data);

      if (response.ok) {
        // Check for response structure
        const schedule =
          storedTripType === "single_trip"
            ? data.data // Direct access for single trips
            : data.data.schedule; // Nested access for multiple trips
        // console.log("schedule data", schedule);

        setScheduleData(schedule);
      } else {
        throw new Error(data.message || "Failed to fetch schedule");
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    const fetchTripData = async () => {
      const requestBody = {
        date: "20-11-2022",
        from: "Port Blair",
        to: "Swaraj Dweep",
        userName: "agent",
        token: "U2FsdGVkX18wFH8L127Sgd0wBwCSQMhE3y2kxDFXgc5zItPTXXqvjfTLuSAeD1ySsGVF5lj9i5LUoR/JhwJvSQ=="
      };

      console.log("Fetching data...");

      try {
        const response = await fetch('http://api.dev.gonautika.com:8012/getTripData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        // Log the response status for debugging
        console.log("Response Status:", response.status);

        // Check if the response is OK (status 200)
        if (!response.ok) {
          console.error('Error in response:', response.statusText);
          return;
        }

        // Parse the JSON response
        const data = await response.json();
        console.log("Fetched Data:", data);

        // Handle the response data
        if (data && data.err === null) {
          setTripData(data.data); // Store the trip data
        } else {
          console.error("Error in data:", data.err);
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    // Call the fetchTripData function
    fetchTripData();
  }, []);


  useEffect(() => {
    const initialTrips = [{ id: 1, from: storedTravelData?.from1, to: storedTravelData?.to1, date: storedTravelData?.travel_date1 ? new Date(storedTravelData?.travel_date1) : null }];

    if (storedTravelData?.travel_date2 && !storedTravelData?.travel_date3) {
      initialTrips.push({ id: 2, from: storedTravelData?.from2, to: storedTravelData?.to2, date: storedTravelData?.travel_date2 ? new Date(storedTravelData?.travel_date2) : null });
    } else if (storedTravelData?.travel_date3) {
      initialTrips.push({ id: 2, from: storedTravelData?.from2, to: storedTravelData?.to2, date: storedTravelData?.travel_date2 ? new Date(storedTravelData?.travel_date2) : null });
      initialTrips.push({ id: 3, from: storedTravelData?.from3, to: storedTravelData?.to3, date: storedTravelData?.travel_date3 ? new Date(storedTravelData?.travel_date3) : null });
    }

    setTrips(initialTrips);
  }, [storedTravelData?.travel_date2, storedTravelData?.travel_date3]);


  useEffect(() => {
    if (storedTripType) {
      fetchScheduleData();
    }
  }, [storedTripType]);

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


  // const handleSelectFerry = (shipClassId: string) => {
  //   localStorage.setItem('selectedShipClassId', shipClassId);
  //   console.log(`Selected ferry ship_class_id: ${shipClassId}`);
  // };


  const handleSelectFerry = (shipClassId: string) => {
    // Find the selected object from scheduleData
    const selectedFerry = scheduleData?.find(
      (item: any) => item.ship_class_id === shipClassId
    );

    if (selectedFerry) {
      localStorage.setItem('selectedFerry', JSON.stringify(selectedFerry));
      console.log('Selected ferry object:', selectedFerry);
      router.push(storedFrom2 ? `/ferry-list2?tripType=${storedTripType}` : "/ferry-details-page");
      // href={storedFrom2 ? `/ferry-list2?tripType=${storedTripType}` : "/ferry-details-page"} 
    } else {
      console.error('Ferry object not found for ship_class_id:', shipClassId);
    }
  };


















  // List of locations to choose from
  const locations = ["Port Blair", "Swaraj Dweep  (Havelock) ", "Shaheed Dweep (Neil)"];

  const addTrip = () => {
    if (trips.length < 3) { // Check if there are less than 3 trips
      setTrips((prevTrips) => {
        const lastTrip = prevTrips[prevTrips.length - 1]; // Get the last trip
        const newTrip = { id: prevTrips.length + 1, from: lastTrip.to || "", to: "", date: null }; // Prefill the 'from' field with the last 'to' field
        return [...prevTrips, newTrip];
      });
      setTripType("return_trip"); // Set tripType to "return_trip" when adding a trip
    }
  };

  const removeTrip = (id: number) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  const updateLocalStorage = () => {
    if (trips.length > 0) {
      const travelData: { [key: string]: string | number } = {}; // Allow dynamic keys with string or number values
  
      trips.forEach((trip, index) => {
        const tripIndex = index + 1; // Start index from 1 (e.g., from1, to1, etc.)
  
        const formatDate = (date: Date | null) => {
          if (!date) return ""; // Return an empty string if date is null
          const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          return offsetDate.toISOString().split("T")[0]; // Extract only the date part
        };
  
        // Store trip details dynamically as from1, to1, travel_date1, from2, to2, travel_date2, etc.
        travelData[`from${tripIndex}`] = trip.from || "";
        travelData[`to${tripIndex}`] = trip.to || "";
        travelData[`travel_date${tripIndex}`] = formatDate(trip.date); // Format date
      });
  
      travelData["adults"] = adult;
      travelData["infants"] = infants;
      travelData["no_of_passengers"] = adult + infants;
  
      // Store the entire travelData object in localStorage
      localStorage.setItem("travelData", JSON.stringify(travelData));
    }
  };
  
  const handleTripTypeChange = (type: string) => {
    setTripType(type);
    // Reset trips based on the trip type selected
    if (type === "single_trip") {
      setTrips([{
        id: 1, from: "", to: "",
        date: null
      }]); // single_trip: reset to single_trip
    } else {
      setTrips([{
        id: 1, from: "", to: "",
        date: null
      }, {
        id: 2, from: "", to: "",
        date: null
      }]); // return_trip: set two trips by default
    }
  };



  const handleSearch = () => {
    const allFieldsFilled = trips.every((trip) => trip.from && trip.to && trip.date);

    if (!allFieldsFilled) {
      alert("Please fill all fields before searching.");
      return; // Stop further execution
    }

    // Proceed with your login or search logic
    updateLocalStorage();
    // router.push(`/ferry-list?tripType=${tripType}`); 
    window.location.href = `/ferry-list?tripType=${tripType}`;



  };






  return (
    <div className="py-[30px] lg:py-[60px]">

      <div className="container">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 mt-6">
          <div className="flex items-center space-x-6 flex-wrap">
            {/* Always show the first pair */}
            <div className="flex items-center space-x-2">
              <p className="text-green-600">{storedFrom1} -&gt; </p>
              <p className="text-green-600">{storedTo1}</p>
            </div>

            {/* Show the second pair only if from2 is available */}
            {storedFrom2 && (
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">{storedFrom2} -&gt; </p>
                <p className="text-gray-600">{storedTo2}</p>
              </div>
            )}

            {/* Show the third pair only if from2 is available */}
            {storedFrom3 && (
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">{storedFrom3} -&gt; </p>
                <p className="text-gray-600">{storedTo3}</p>
              </div>
            )}
          </div>
        </div>



        <div className="bg-white rounded-xl p-3 md:p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-lg">
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="single_trip"
                checked={tripType === "single_trip"}
                onChange={() => handleTripTypeChange("single_trip")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="single_trip">Single Trip</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="way"
                id="return_trip"
                checked={tripType === "return_trip"}
                onChange={() => handleTripTypeChange("return_trip")}
                className="scale-125 accent-[var(--primary)]"
              />
              <label htmlFor="return_trip">Multiple Trip</label>
            </div>
          </div>


          {trips.map((trip, index) => {
            const availableLocations = locations.filter(
              (location) => location !== trip.from
            );

            return (
              <div key={trip.id} className="flex flex-wrap gap-5 mt-6 items-center">
                {trips.length > 1 && (
                  <div className="w-full text-xl text-gray-600 font-semibold">
                    Trip {index + 1}
                  </div>
                )}

                <div className="flex w-full md:w-[35%] gap-3 mr-10">
                  <div className="relative w-full">
                    <select
                      value={trip.from || ""}
                      onChange={(e) => {
                        const updatedTrips = [...trips];
                        updatedTrips[index].from = e.target.value;
                        setTrips(updatedTrips);
                      }}
                      className="w-full bg-[var(--bg-1)] rounded-full border py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>From</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <MapPinIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="relative w-full">
                    <select
                      value={trip.to || ""}
                      onChange={(e) => {
                        const updatedTrips = [...trips];
                        updatedTrips[index].to = e.target.value;
                        setTrips(updatedTrips);
                        if (index < trips.length - 1) {
                          const nextTrip = [...trips];
                          nextTrip[index + 1].from = e.target.value;
                          setTrips(nextTrip);
                        }
                      }}
                      className="w-full bg-[var(--bg-1)] rounded-full border py-3 pl-3 md:pl-4 text-sm leading-5 text-gray-900 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>To</option>
                      {availableLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <MapPinIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[30%] xxl:w-[20%] flex pl-2 pt-1 pb-1 pr-3 items-center justify-between rounded-full sm:text-sm bg-[var(--bg-1)] border">
                  <DatePicker
                    selected={trip.date}
                    onChange={(date: Date) => {
                      const updatedTrips = [...trips];
                      updatedTrips[index].date = date;
                      setTrips(updatedTrips);
                    }}
                    placeholderText="Depart Date"
                    className="w-full bg-[var(--bg-1)] p-2 rounded-full focus:outline-none"
                  />
                  <CalendarDaysIcon className="w-5 h-5 text-gray-600 shrink-0" />
                </div>

                {index === 0 && (
                  <SelectPeople
                    adult={adult}
                    setAdult={setAdult}
                    infants={infants}
                    setInfants={setInfants}
                  />
                )}

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTrip(trip.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Trip
                  </button>
                )}
              </div>
            );
          })}



          {/* Add Trip and Search buttons in the same row */}
          <div className="flex justify-between items-center mt-6">
            {/* Add Trip Button */}
            <button
              onClick={addTrip}
              type="button"
              className="py-[10px] px-5 w-auto text-black rounded-full sm:text-sm bg-[var(--bg-1)] border"
              disabled={trips.length >= 3}
            >
              + Add Trip
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="py-[14px] px-6 flex justify-center text-white bg-primary rounded-full"
            >
              <SearchIcon />
            </button>
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
  {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
    scheduleData.map((schedule: {
      id: any;
      ship_title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      departure_time: string;
      source_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      arrival_time: string;
      destination_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      seat: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_id: string;
    }, index: any) => (
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
                    className="object-fit-contain"
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
                ₹{schedule.ship_class_price}
              </h2>
            </div>
            <Link
              href={storedFrom2 ? `/ferry-list2?tripType=${storedTripType}` : "/ferry-details-page"}
              onClick={() => handleSelectFerry(schedule.ship_class_id)}
              className="btn-outline flex justify-center text-primary"
            >
              Select Ferry
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No schedule data available</p>
  )}
</div>



















            {/* nautikaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}




            <div className="grid grid-cols-1 gap-4 lg:gap-6">
  {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
    scheduleData.map((schedule: {
      id: any;
      departure_time: string;
      source_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      arrival_time: string;
      destination_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      seat: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined;
      ship_class_id: string;
    }, index: any) => (
      <div key={schedule.id || index} className="col-span-1">
        <div className="md:flex bg-white border rounded-2xl mx-3 xl:mx-0">
          <div className="flex flex-col gap-6 p-4 lg:p-6 flex-grow">
            <div className="flex flex-col md:flex-row justify-center items-start gap-6">
              <div className="flex w-full justify-center md:w-auto flex-col gap-3 md:gap-7 text-center md:text-start flex-grow">
                <div className="grid place-content-center w-16 h-16 bg-white shadow-lg mx-auto ms-md-0">
                  <Image
                    width={52}
                    height={27}
                    src={'/img/nautika-logo.jpg'}
                    alt="image"
                    className="object-fit-contain"
                  />
                </div>
                <p className="mb-0 font-medium">Nautika</p>
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
                ₹{schedule.ship_class_price}
              </h2>
            </div>
            <Link
              href={storedFrom2 ? `/ferry-list2?tripType=${storedTripType}` : "/ferry-details-page"}
              onClick={() => handleSelectFerry(schedule.ship_class_id)}
              className="btn-outline flex justify-center text-primary"
            >
              Select Ferry
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No schedule data available</p>
  )}

  <div className="col-span-1">
    <nav>
      <ul className="flex gap-3 justify-center">
        <li className="page-item">
          <Link
            className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
            href="#"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
        </li>
        <li className="page-item">
          <Link
            className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] bg-primary text-white"
            href="#"
          >
            1
          </Link>
        </li>
        <li className="page-item">
          <Link
            className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
            href="#"
          >
            2
          </Link>
        </li>
        <li className="page-item">
          <Link
            className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
            href="#"
          >
            3
          </Link>
        </li>
        <li className="page-item">
          <Link
            className="page-link p-0 w-10 h-10 grid place-content-center lh-1 rounded-full border border-[var(--primary)] text-primary"
            href="#"
          >
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

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FerryList />
  </Suspense>
);
export default Page;
