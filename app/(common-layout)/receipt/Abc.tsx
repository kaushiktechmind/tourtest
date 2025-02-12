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


interface PaymentData {
  country: string;
  id: number;
  booking_id: string;
  invoice_id: string;
  service_type: string;
  adults: string;
  childs: string;
  infants: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  address: string;
  passport_no: string;
}


const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const totalCounts = JSON.parse(localStorage.getItem("totalCounts") ?? "0");


// Access the properties from the parsed object
const adults = Number(totalCounts?.adults || 0); // Default to 0 if undefined
const children = Number(totalCounts?.children || 0);
const infants = Number(totalCounts?.infants || 0);
const totalRooms = Number(totalCounts?.totalRooms || 0);

const formatDate = (dateString: string) => dateString === "0" ? "" : new Date(dateString).toLocaleDateString("en-GB").replace(/\//g, "-");

const startdate = formatDate(localStorage.getItem("startDate") ?? "0");
const enddate = formatDate(localStorage.getItem("endDate") ?? "0");





const Reciept = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalAdultPrice = localStorage.getItem("storedAdultPrice");
  const totalChildPrice = localStorage.getItem("storedChildPrice");
  const totalExtraBedPrice = localStorage.getItem("storedExtraBedPrice");
  const roomId = searchParams.get("roomId");
  const hotelId = searchParams.get("hotelId");
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const addedRooms = localStorage.getItem('addedRooms');
    if (addedRooms) {
      setRooms(JSON.parse(addedRooms));
    }
  }, []);


  useEffect(() => {
    const fetchPaymentData = async () => {
      const customerId = localStorage.getItem("id");
      if (!customerId) {
        console.error("Customer ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debugging the response
        if (data?.data) {
          setPaymentData(data.data); // Extract and set the data array
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, []);


  
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);

  useEffect(() => {
    // Fetch discount values from localStorage when component mounts
    const storedDiscountAmount = Number(localStorage.getItem("discountAmount")) || 0;
    const storedDiscountedPrice = Number(localStorage.getItem("discountedPrice")) || 0;

    setDiscountAmount(storedDiscountAmount);
    setDiscountedPrice(storedDiscountedPrice);

    // Optional: Clear discounts if they are not valid
    if (!storedDiscountAmount && !storedDiscountedPrice) {
      localStorage.removeItem("discountAmount");
      localStorage.removeItem("discountedPrice");
    }
  }, []);




  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

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
        console.log("ccccccccccccccccccccccccc", data);
        setRoomsData([data.room]); // Store the single room data in an array
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId]);


  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const mobile_number = localStorage.getItem("mobile_number");
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
                  <p className="mb-0 h3 text-right">{paymentData[0]?.booking_id || ""}</p>
                </div>
                <div className="border border-dashed my-6">
                </div>
                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Booking date
                        </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Adults</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{adults}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{children}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
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
                    <div key={index} className="flex flex-wrap border items-center rounded-2xl w-full">
                      <div className="rounded-2xl p-2 w-full md:w-1/3">
                        <Image
                          src={roomData.featured_images[0]} // Use the first featured image
                          alt={roomData.room_name} // Use room name as alt text
                          width={100}
                          height={100}
                          className="h-[200px] w-full rounded-2xl"
                        />
                      </div>

                      <div className="p-4 w-full md:w-2/3">
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
                  ))}
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
                  <p className="mb-0 font-medium text-right">
                    ₹{totalAdultPrice}
                  </p>
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
                    ₹
                    {totalChildPrice !== null
                      ? Number(totalChildPrice) * noOfNights
                      : 0}
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
                  <p className="mb-0 font-medium text-right">
                    ₹{Number(totalExtraBedPrice) * noOfNights}
                  </p>
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
                  <p className="mb-0 font-medium text-right">
                    ₹{storedTotalPrice}
                  </p>
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


              {discountAmount > 0 && (
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-3">Discount</p>
                  <p className="mb-0 font-medium text-right text-green-500">₹{discountAmount}</p>
                </li>
              )}

              {discountedPrice > 0 && (
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-4">Discounted Price</p>
                  <p className="mb-0 font-medium text-right text-blue-500">₹{discountedPrice}</p>
                </li>
              )}
          
            </div>
          </div>

        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Billing Address */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 flex-1">
            <h4 className="mb-3 text-2xl font-semibold">Billing Address</h4>
            <div className="border border-dashed my-6"></div>
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 md:col-span-6">
                <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5">
                  {paymentData[0]?.customer_name || ""}
                </p>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5">{paymentData[0]?.customer_email || ""}</p>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5">  {paymentData[0]?.customer_mobile_number || ""}</p>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="rounded-full border bg-[var(--bg-1)] pr-4">
                  <p className="w-full bg-transparent px-5 py-3">{paymentData[0]?.country || ""}</p>
                </div>
              </div>
              <div className="col-span-12">
                {paymentData[0]?.passport_no !== "N/A" ? (
                  <input
                    type="text"
                    value={paymentData[0]?.passport_no || ""}
                    readOnly
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl py-3 px-6"
                  />
                ) : null}
              </div>

              <div className="col-span-12">
                <p className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl py-3 px-6"> {paymentData[0]?.address || ""}</p>
              </div>
            </div>
          </div>

          {/* New Separate Div */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 flex-1">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Check In Date</th>
                  <th className="px-4 py-2 border-b">Check Out Date</th>
                </tr>
              </thead>
              <tbody>

                <tr className="text-center">
                  <td className="px-4 py-2 border-b">{startdate}</td>
                  <td className="px-4 py-2 border-b">{enddate}</td>
                </tr>

              </tbody>
            </table>

            <table className="min-w-full border-collapse table-auto mt-[40px]">
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
      </div>
    </div>


  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Reciept />
  </Suspense>
);
 
export default Page;
function setSelectedCountry(value: string) {
  throw new Error("Function not implemented.");
}

