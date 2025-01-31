"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Children, Suspense } from "react";

import { useEffect, useState } from "react";
import RazorpayActBtn from "@/components/RazorpayCabBtn";
RazorpayActBtn;

interface PaymentData{
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  country: string;
  passport_no: string;
  address: string;
  starting_date: string;

}

const today = new Date();
const todayDate = today.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const storedCabDetails = JSON.parse(localStorage.getItem("storedCabDetails") || "[]");
const cabData = storedCabDetails[0];



const generateBookingID = () => {
  const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
};

const CabReciept = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId");

  const [cabItem, setCabItem] = useState<any>(null);
  
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [bookingID, setBookingID] = useState('');

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);





  const [selectedCountry, setSelectedCountry] = useState("India");
  const [passportNumber, setPassportNumber] = useState("");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
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



  // const storedCabDetails = JSON.parse(localStorage.getItem("storedCabDetails") || "{}");
  const totalPrice = storedCabDetails.totalPrice || 0;
  const hotelName = storedCabDetails.hotelName || "None";
  const selectedPax = storedCabDetails.selectedPax || "None";







  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    if (selectedCountry !== "India") {
      setPassportNumber(""); // Clear passport number field if the country is India
    }
  }, [selectedCountry]);

  const passport = selectedCountry !== "India" ? passportNumber : "N/A";


  // Fetch cab item details based on cabId
  useEffect(() => {
    if (cabId) {
      const fetchCabItem = async () => {
        try {
          const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/cab-main-forms/${cabId}`);
          if (response.ok) {
            const data = await response.json();
            setCabItem(data);
          } else {
            alert("Failed to fetch cab details.");
          }
        } catch (error) {
          console.error("Error fetching cab details:", error);
        }
      };
      fetchCabItem();
    }
  }, [cabId]);


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
                </div>
                <div className="col-span-12 md:col-span-4 mt-[20px] flex gap-4">
                  <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">Booking date</span>
                    </div>
                    <p className="mb-0 text-lg font-medium">{todayDate}</p>
                  </div>

                  <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">Reservation date</span>
                    </div>
                    <p className="mb-0 text-lg font-medium">{paymentData[0]?.starting_date}</p>
                  </div>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                
                    <div className="col-span-12 md:col-span-6 flex">
                      <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full flex-1">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="clr-neutral-400 inline-block text-sm">Hotel Name</span>
                        </div>
                        <p className="mb-0 text-lg font-medium">{hotelName}</p>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 flex">
                      <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full flex-1">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="clr-neutral-400 inline-block text-sm">Total Pax</span>
                        </div>
                        <p className="mb-0 text-lg font-medium">{selectedPax}</p>
                      </div>
                    </div>
                  
                </div>



                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex flex-wrap border items-center rounded-2xl w-full relative">
                    <div className="rounded-2xl p-2 w-full md:w-1/3">
                      <Image
                        src={cabItem?.banner_image_multiple?.[0] || "/default-image.jpg"}
                        alt={cabItem?.banner_title || "Default Banner Title"}
                        width={100}
                        height={100}
                        className="h-[200px] w-full rounded-2xl"
                      />
                    </div>
                    <div className="relative w-full md:w-2/3">
                      <div className="p-4">
                        <div className="property-card__body">
                          <Link
                            href={`/cab-details/${cabItem?.id}`}
                            className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                          >
                            {cabItem?.cab_name || "Cab Title"}
                          </Link>
                          <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-1">
                              <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                              <span className="inline-block">
                                {cabItem?.location || "Location"}
                              </span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                         
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
                <li className="grid grid-cols-2 items-center">
                  <p className="mb-0">Total Pax</p>
                  <p className="mb-0 font-medium text-right">{selectedPax}</p>
                </li>

                <li className="grid grid-cols-2 items-center">

                </li>
              </ul>
              {/* <div className="border border-dashed my-8"></div> */}
              <div className="grid grid-cols-2 items-center mb-6">
                <p className="mb-0 font-bold">Total Price</p>
                <p className="mb-0 font-medium text-right">₹{totalPrice}</p>
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
    <CabReciept />
  </Suspense>
);


export default Page;