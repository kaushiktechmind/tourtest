"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import RazorpayActBtn from "@/components/RazorpayCabBtn";

interface PaymentData {
  customer_name: string;
  customer_email: string;
  customer_mobile_number: string;
  country: string;
  passport_no: string;
  address: string;
}

const generateBookingID = () => {
  const randomNumber = Math.floor(Math.random() * 100000);
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`;
};

const CabReciept = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cabId = searchParams.get("cabId");

  const [cabItem, setCabItem] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [bookingID, setBookingID] = useState('');
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [passportNumber, setPassportNumber] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [hotelName, setHotelName] = useState("None");
  const [selectedPax, setSelectedPax] = useState("None");

  const formattedDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

  // UseEffect to handle localStorage on client-side
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const storedCabDetails = JSON.parse(localStorage.getItem("storedCabDetails") || "[]");
      const cabData = storedCabDetails[0];
      setTotalPrice(cabData?.totalPrice || 0);
      setHotelName(cabData?.hotelName || "None");
      setSelectedPax(cabData?.selectedPax || "None");

      setAddress(localStorage.getItem("address") || "");
      setName(localStorage.getItem("name") || "");
      setEmail(localStorage.getItem("email") || "");
      setMobileNumber(localStorage.getItem("mobile_number") || "");
    }
  }, []);

  useEffect(() => {
    setBookingID(generateBookingID());
  }, []);

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    if (e.target.value !== "India") {
      setPassportNumber(""); // Clear passport number field if the country is India
    }
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      const customerId = localStorage.getItem("id");
      if (!customerId) {
        console.error("Customer ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/user/get_payment_by_customer_id/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.data) {
          setPaymentData(data.data);
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
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-[40px]">
          <div className="col-span-12 lg:col-span-8">
            <div className="pb-lg-0">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="mb-0 h3">Your Booking Info</h3>
                </div>
                <div className="col-span-12 md:col-span-2 mt-[20px]">
                  <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8 w-full">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">Booking date</span>
                    </div>
                    <p className="mb-0 text-lg font-medium">{formattedDate}</p>
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
                              <span className="inline-block">{cabItem?.location || "Location"}</span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 border">
              <h4 className="mb-0 text-lg font-medium">Payment Details</h4>
              <div className="border border-dashed my-4"></div>

              <div className="mb-3">
                <span className="clr-neutral-400 inline-block text-sm">Total Price</span>
                <p className="mb-0 text-lg font-medium">{totalPrice} USD</p>
              </div>

              {/* <RazorpayActBtn
                // paymentData={paymentData}
                totalPrice={totalPrice}
                bookingID={bookingID}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabReciept;
