"use client";
import Image from "next/image";
import Link from "next/link";
import featured1 from "@/public/img/featured-img-1.jpg";
import { useRouter, useSearchParams } from "next/navigation";
import { Children, Suspense } from "react";

import { useEffect, useState } from "react";
import RazorpayButton from "@/components/RazorpayButton";
RazorpayButton;
interface RoomData {
  id: number;
  hotel_id: number;
  hotel_name: string;
  room_name: string;
  room_price: string;
  extra_bed_price: string;
  child_price: string;
  no_of_beds: string;
  featured_images: string[];
  room_size: string;
  max_adults: string;
  max_childs: string;
  max_infants: string;
  amenities: string[];
  status: string;
  created_at: string;
  updated_at: string;
}
const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const totalCounts = JSON.parse(localStorage.getItem("totalCounts") ?? "0");

const formatDate = (dateString: string) => dateString === "0" ? "" : new Date(dateString).toLocaleDateString("en-GB").replace(/\//g, "-");

const endDate = formatDate(localStorage.getItem("endDate") ?? "0");
const startDate = formatDate(localStorage.getItem("startDate") ?? "0");


// Access the properties from the parsed object
const adults = Number(totalCounts?.adults || 0); // Default to 0 if undefined
const children = Number(totalCounts?.children || 0);
const infants = Number(totalCounts?.infants || 0);
const totalRooms = Number(totalCounts?.totalRooms || 0);

const generateBookingID = () => {
  // Generate a random number with a fixed length
  const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
};

const PaymentMethod = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalAdultPrice = localStorage.getItem("storedAdultPrice");
  const totalChildPrice = localStorage.getItem("storedChildPrice");
  const totalExtraBedPrice = localStorage.getItem("storedExtraBedPrice");
  const roomId = localStorage.getItem("roomId");
  const hotelId = searchParams.get("hotelId");

  const [bookingID, setBookingID] = useState('');

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);

  const storedAddress = localStorage.getItem("address");
  const [address, setAddress] = useState(storedAddress || "");

  const [selectedCountry, setSelectedCountry] = useState("India");
  const [passportNumber, setPassportNumber] = useState("");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [mobile_number, setMobileNumber] = useState(localStorage.getItem("mobile_number") || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value);
  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassportNumber(e.target.value);
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };


  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const addedRooms = localStorage.getItem('addedRooms');
    if (addedRooms) {
      setRooms(JSON.parse(addedRooms));
    }
  }, []);



  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    if (selectedCountry !== "India") {
      setPassportNumber(""); // Clear passport number field if the country is India
    }
  }, [selectedCountry]);

  const passport = selectedCountry !== "India" ? passportNumber : "N/A";

  // Convert the roomIds parameter to an array if it exists

  const [roomsData, setRoomsData] = useState<any[]>([]);
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return; // Ensure roomId exists
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${roomId}`
        );
        const data = await response.json();
        setRoomsData([data.room]); // Store the single room data in an array
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId]);


  const noOfNights = Number(localStorage.getItem("noOfNights"));

  const storedTotalPrice = Math.round(
    parseFloat(localStorage.getItem("storedTotalPrice") || "0")
  );
  const grandTotal = noOfNights * Number(storedTotalPrice);



  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6  mt-[40px]">
          <div className="col-span-12 lg:col-span-8">
            <div className="pb-lg-0">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="mb-0 h3">Your Booking Info</h3>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Booking date
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Checkin Date</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{startDate}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Checkout Date</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{endDate}</p>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Adults</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{adults}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{children}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Infants</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{infants}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 w-full">
                  {roomsData.map((roomData, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap border items-center rounded-2xl w-full relative"
                    >
                      <div className="rounded-2xl p-2 w-full md:w-1/3">
                        <Image
                          src={roomData.featured_images[0]} // Use the first featured image
                          alt={roomData.room_name} // Use room name as alt text
                          width={100}
                          height={100}
                          className="h-[200px] w-full rounded-2xl"
                        />
                      </div>
                      <div className="relative w-full md:w-2/3">
                        <div className="absolute top-2 right-2 z-10 group">
                          <i className="las la-info-circle text-2xl text-gray-600 hover:text-primary cursor-pointer"></i>
                          <div className="absolute top-full right-0 mt-2 bg-white opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible p-4 overflow-x-auto rounded-b-2xl shadow-lg">
                            <table className="min-w-full border-collapse table-auto">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 border-b">Room</th>
                                  <th className="px-4 py-2 border-b">Adults</th>
                                  <th className="px-4 py-2 border-b">Children</th>
                                  <th className="px-4 py-2 border-b">Infants</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rooms.map((room, index) => (
                                  <tr key={index} className="text-center">
                                    <td className="px-4 py-2 border-b">{`${index + 1}`}</td>
                                    <td className="px-4 py-2 border-b">{room.adults}</td>
                                    <td className="px-4 py-2 border-b">{room.children}</td>
                                    <td className="px-4 py-2 border-b">{room.infants}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="property-card__body">
                            <Link
                              href="hotel"
                              className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                            >
                              {roomData.room_name}
                            </Link>
                            <div className="flex justify-between gap-3">
                              <div className="flex items-center gap-1">
                                <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                                <span className="inline-block">{roomData.location_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="inline-block clr-neutral-500">
                                  {/* Ratings placeholder */}
                                </span>
                              </div>
                            </div>
                            <div className="border border-dashed my-6"></div>
                            <ul className="flex flex-wrap gap-6">
                              <li className="flex gap-2 items-center">
                                <i className="las text-lg la-home"></i>
                                <span className="block text-sm">{totalRooms} Rooms</span>
                              </li>
                              <li className="flex gap-2 items-center">
                                <i className="las text-lg la-bed"></i>
                                <span className="block text-sm">{roomData.no_of_beds} Bed</span>
                              </li>
                                <li className="flex gap-2 items-center">
                                <i className="las text-lg la-arrows-alt"></i>
                                <span className="block text-sm">{roomData.room_size}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                <h4 className="mb-3 text-2xl font-semibold">Billing address</h4>
                <div className="border border-dashed my-6"></div>
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="email"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Phone Number"
                      value={mobile_number}
                      onChange={handleMobileChange}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="rounded-full border bg-[var(--bg-1)] pr-4">
                      <select
                        className="w-full bg-transparent px-5 py-3 focus:outline-none"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="New York">New York</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Atlanta">Atlanta</option>
                      </select>
                    </div>
                  </div>
                  {selectedCountry !== "India" && (
                    <div className="col-span-12">
                      <input
                        type="text"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                        placeholder="Enter Passport Number"
                        value={passportNumber}
                        onChange={handlePassportChange}
                      />
                    </div>
                  )}
                  <div className="col-span-12">
                    <textarea
                      rows={5}
                      className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl focus:outline-none py-3 px-6"
                      placeholder="Enter Address"
                      value={address} // Set value from state
                      onChange={handleAddressChange} // Update state on change
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 border">
              <h4 className="mb-0 text-2xl font-semibold">Order Summary</h4>
              <div className="border border-dashed my-8"></div>
              <ul className="flex flex-col gap-4">
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-0 pl-8">Room Price</p>
                  <p className="mb-0 font-medium text-right">₹{totalAdultPrice}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <i className="las la-info-circle text-2xl clr-neutral-500"></i>
                      <span className="absolute left-0 -top-6 text-xs bg-blue-500 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-[200px]">
                        Child Without Mattress
                      </span>
                    </div>
                    <p className="mb-0">Child Price</p>
                  </div>
                  {/* <p className="mb-0 font-medium text-right">₹{totalChildPrice*noOfNights}</p> */}
                  <p className="mb-0 font-medium text-right">
                    ₹{totalChildPrice !== null ? Number(totalChildPrice) * noOfNights : 0}
                  </p>

                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <i className="las la-info-circle text-2xl clr-neutral-500"></i>
                      <span className="absolute left-0 -top-6 text-xs bg-blue-500 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-[200px]">
                        Extra Mattress for Adult / Child
                      </span>
                    </div>
                    <p className="mb-0">Extra Bed Price</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{Number(totalExtraBedPrice) * noOfNights}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <i className="las la-info-circle text-2xl clr-neutral-500"></i>
                      <span className="absolute left-0 -top-6 text-xs bg-blue-500 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-[110px]">
                        Inclusive of GST
                      </span>
                    </div>
                    <p className="mb-0">Sub Total</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{storedTotalPrice}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-0 pl-8">Number of Nights</p>
                  <p className="mb-0 font-medium text-right">{noOfNights}</p>
                </li>
              </ul>

              <div className="border border-dashed my-8"></div>
              <div className="grid grid-cols-2 items-center mb-6">
                <p className="mb-0 font-extrabold">Grand Total</p>
                <p className="mb-0 font-medium text-right">₹{grandTotal}</p>
              </div>
              <RazorpayButton
                grandTotal={Number(grandTotal) * 100}
                currency="INR"
                name={name}
                email={email}
                mobile_number={mobile_number}
                hotelId={Number(hotelId)}
                roomId={Number(roomId)}
                address={address}
                bookingID={bookingID}
                passport={passport}
                country={selectedCountry} adults={0} infants={0}              >
                {Number(children)}
              </RazorpayButton>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentMethod />
  </Suspense>
);


export default Page;
