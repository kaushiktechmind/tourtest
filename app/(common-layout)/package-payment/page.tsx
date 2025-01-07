"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Children } from "react";

import { useEffect, useState } from "react";
import RazorpayPkgBtn from "@/components/RazorpayPkgBtn";

const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Output: "DD-MM-YYYY"

const storedPackageData = JSON.parse(localStorage.getItem("packageData") || "[]");
const packageData = storedPackageData[0];

// Access the properties from the parsed object
const adult = Number(packageData?.adult); // Default to 0 if undefined
const child = Number(packageData?.child || 0);
const infant = Number(packageData?.infant || 0);

const adultPrice = Number(packageData?.adultPrice || 0);
const childPrice = Number(packageData?.childPrice || 0);
const infantPrice = Number(packageData?.infantPrice || 0);
const totalPrice = Number(packageData?.totalPrice);
const extraPrice = Number(packageData?.extraPrice);
const serviceFee = Number(packageData?.serviceFee);

const generateBookingID = () => {
  // Generate a random number with a fixed length
  const randomNumber = Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  return `BKNG-${randomNumber.toString().padStart(5, '0')}`; // Format it to have leading zeros if necessary
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const [packageItem, setPackageItem] = useState<any>(null);
  const [bookingID, setBookingID] = useState('');

   // Check if package data exists in localStorage
   const storedPackageData = JSON.parse(localStorage.getItem("packageData") || "[]");

  useEffect(() => {
    // Generate a unique booking ID when the component mounts
    setBookingID(generateBookingID());
  }, []);



  // const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [passportNumber, setPassportNumber] = useState("");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [mobile_number, setMobileNumber] = useState(localStorage.getItem("mobile_number") || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value);
  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassportNumber(e.target.value);
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };




  // Access the first object in the array
  const {
    adult, adultPrice,
    child1, child2, child3, childPrice1, childPrice2, childPrice3,
    infant1, infant2, infantPrice1, infantPrice2, date
  } = storedPackageData[0];





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
    const fetchPackageItem = async () => {
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/get_package_by_id/${packageId}`
        );

        if (response.ok) {
          const data = await response.json();
          setPackageItem(data);
        } else {
          alert("Failed to fetch package details.");
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageItem();
  }, [packageId]);


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
                  <div className="col-span-12 md:col-span-6">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">
                        Booking Date
                      </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  
                 
                  <div className="col-span-12 md:col-span-6">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="clr-neutral-400 inline-block text-sm">
                        Total Pax
                      </span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{Number(adult) + Number(child1) + Number(child2) + Number(child3) + Number(infant1) + Number(infant2)}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed my-6"></div>

                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Adults (12+)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{adult}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (9-11)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{child1}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (6-8)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{child2}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Children (3-5)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{child3}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Infants (1+)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{infant1}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">Infants (0)</span>
                      </div>
                      <p className="mb-0 text-lg font-medium">{infant2}</p>
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex flex-wrap border items-center rounded-2xl w-full relative">
                    <div className="rounded-2xl p-2 w-full md:w-1/3">
                      <Image
                        src={packageItem?.banner_image?.[0] || "/default-image.jpg"}
                        alt={packageItem?.banner_title || "Default Banner Title"}
                        width={100}
                        height={100}
                        className="h-[200px] w-full rounded-2xl"
                      />
                    </div>
                    <div className="relative w-full md:w-2/3">
                      <div className="p-4">
                        <div className="property-card__body">
                          <Link
                            href={`/package-details/${packageItem?.id}`}
                            className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                          >
                            {packageItem?.package_title || "Package Title"}
                          </Link>
                          <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-1">
                              <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                              <span className="inline-block">
                                {packageItem?.location_name || "Location"}
                              </span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                          <ul className="flex flex-wrap gap-6">
                            <li className="flex gap-2 items-center">
                              <i className="las text-lg la-globe text-[#22804A]"></i>
                              <span className="block text-sm">
                                {packageItem?.pickup_point || "Pickup Point"}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                            <i className="las la-clock text-xl text-[#22804A]"></i>
                              <span className="block text-sm">
                                {packageItem?.duration || "Duration"}
                              </span>
                            </li>
                            

                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                <h4 className="mb-3 text-2xl font-semibold">Billing address <span className="astrick">*</span></h4>
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
                  <p className="mb-0">Adult Price(12+)</p>
                  <p className="mb-0 font-medium text-right">₹{adultPrice}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (9-11)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{childPrice1}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (6-8)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{childPrice2}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Child Price (3-5)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{childPrice3}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Infant Price (1+)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{infantPrice1}</p>
                </li>
                <li className="grid grid-cols-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="mb-0">Infant Price(0)</p>
                  </div>
                  <p className="mb-0 font-medium text-right">₹{infantPrice2}</p>
                </li>
              </ul>

              <div className="border border-dashed my-8"></div>
              <div className="grid grid-cols-2 items-center mb-6">
                <p className="mb-0 font-bold">Total Price</p>

                <p className="mb-0 font-medium text-right">₹{totalPrice}</p>
              </div>
              <RazorpayPkgBtn
                grandTotal={Number(totalPrice) * 100}
                currency="INR"
                name={name}
                email={email}
                mobile_number={mobile_number}
                address={address}
                bookingID={bookingID}
                packageId={Number(packageId)}
                passport={passport}
                country={selectedCountry} adults={0} infants={0}              >
              </RazorpayPkgBtn>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Page;
