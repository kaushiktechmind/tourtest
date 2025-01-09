"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Children, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal, Suspense } from "react";

import { useEffect, useState } from "react";
import RazorpayActBtn from "@/components/RazorpayCabBtn";
RazorpayActBtn;

interface PaymentData{
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  country: string;
  passport_no: string;
  address: string;
}

const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const storedActivityData = JSON.parse(localStorage.getItem("storedactivityData") || "[]");
const activityData = storedActivityData[0];



const generateBookingID = () => {
  // Generate a random number with a fixed length
  const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
};

const ActivityReciept = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId");

  const [activityItem, setActivityItem] = useState<any>(null);

  const [bookingID, setBookingID] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);





  const [address, setAddress] = useState("");
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



  const storedActivityData = JSON.parse(localStorage.getItem("storedActivityData") || "{}");
  const tickets = storedActivityData.tickets || []; // Fallback to an empty array
  const grandTotal = storedActivityData.grandTotal || 0;





  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    if (selectedCountry !== "India") {
      setPassportNumber(""); // Clear passport number field if the country is India
    }
  }, [selectedCountry]);

  const passport = selectedCountry !== "India" ? passportNumber : "N/A";


  useEffect(() => {
    const fetchActivityItem = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/get_activity_by_id/${activityId}`
        );

        if (response.ok) {
          const data = await response.json();
          setActivityItem(data);
        } else {
          alert("Failed to fetch activity details.");
        }
      } catch (error) {
        console.error("Error fetching activity details:", error);
      }
    };

    fetchActivityItem();
  }, [activityId]);

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
                <div className="col-span-12 md:col-span-2 mt-[20px]">
                  <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">
                        Booking date
                      </span>
                    </div>
                    <p className="mb-0 text-lg font-medium">{formattedDate}</p>
                  </div>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  {tickets.map((ticket: any, index: number) => (
                    <div key={index} className="col-span-12 md:col-span-2 flex">
                      <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full flex-1">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="clr-neutral-400 inline-block text-sm">{ticket.ticketName}</span>
                        </div>
                        <p className="mb-0 text-lg font-medium">{ticket.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>



                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex flex-wrap border items-center rounded-2xl w-full relative">
                    <div className="rounded-2xl p-2 w-full md:w-1/3">
                      <Image
                        src={activityItem?.banner_image_multiple?.[0] || "/default-image.jpg"}
                        alt={activityItem?.banner_title || "Default Banner Title"}
                        width={100}
                        height={100}
                        className="h-[200px] w-full rounded-2xl"
                      />
                    </div>
                    <div className="relative w-full md:w-2/3">
                      <div className="p-4">
                        <div className="property-card__body">
                          <Link
                            href={`/activity-details/${activityItem?.id}`}
                            className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                          >
                            {activityItem?.activity_title || "Activity Title"}
                          </Link>
                          <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-1">
                              <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                              <span className="inline-block">
                                {activityItem?.location_name || "Location"}
                              </span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                          <ul className="flex flex-wrap gap-6">
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-home"></i>
                              <span className="block text-sm">
                                {activityItem?.start_time || "Pickup Point"}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-bed"></i>
                              <span className="block text-sm">
                                {activityItem?.duration || "Duration"}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-bath"></i>
                              <span className="block text-sm">
                                {activityItem?.bath || "Bath"}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-arrows-alt"></i>
                              <span className="block text-sm">
                                {activityItem?.size || "Size"}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


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
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 border">
              <h4 className="mb-0 text-2xl font-semibold">Order Summary</h4>
              <div className="border border-dashed my-8"></div>
              <ul className="flex flex-col gap-4">
                {tickets.map((ticket: { ticketName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; quantity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; totalPrice: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
                  <li key={index} className="grid grid-cols-2 items-center">
                    <p className="mb-0">{ticket.ticketName} X {ticket.quantity}</p>
                    <p className="mb-0 font-medium text-right">₹{ticket.totalPrice}</p>
                  </li>
                ))}
                {/* <li className="grid grid-cols-2 items-center">
        <div className="flex items-center gap-2">
          <p className="mb-0">Sub Total</p>
        </div>
        <p className="mb-0 font-medium text-right">₹{tickets.reduce((total, ticket) => total + ticket.totalPrice, 0)}</p>
      </li> */}
              </ul>

              <div className="border border-dashed my-8"></div>
              <div className="grid grid-cols-2 items-center mb-6">
                <p className="mb-0 font-bold">Grand Total</p>
                <p className="mb-0 font-medium text-right">₹{grandTotal}</p>
              </div>

              {/* <RazorpayActBtn
                grandTotal={Number(grandTotal) * 100}
                currency="INR"
                name={name}
                email={email}
                mobile_number={mobile_number}
                address={address}
                bookingID={bookingID}
                activityId={activityId}
                passport={passport}
                country={selectedCountry}
              >
              </RazorpayActBtn> */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ActivityReciept />
  </Suspense>
);

export default Page;
