"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Children, Suspense } from "react";

import { useEffect, useState } from "react";
import RazorpayPkgBtn from "@/components/RazorpayPkgBtn";
RazorpayPkgBtn;


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

interface ItineraryItem {
  day: string;
  title: string;
  description: string;
  image: string;
}



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

const reservationDate = packageData?.date; // "2025-02-19"
const [year, month, day] = reservationDate.split('-');
const formattedDate2 = `${day}-${month}-${year}`;


const PackageReciept = () => {



  return (
    
    <div className="bg-[var(--bg-2)]">
      
      <div className="">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="pb-lg-0">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="ml-6 h3">Andman Mangroves Holidays</h3>
                  <div className="text-right">
                    <img
                      src="https://www.andamanmangroves.com/static/media/logo.00922eff5313640b23f9.png"
                      alt="Andman Mangroves Holidays Logo"
                      className="h-20"
                    />
                  </div>
                </div>



                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-1 my-6">
                  <div className="col-span-12 md:col-span-12">
                    <div className="px-6 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="clr-neutral-400 inline-block text-sm">
                        Shop 05, First Floor, Panchayat Market, Sippighat, next to Gram Panchayat Bhavan, Sri Vijaya Puram, Andaman and Nicobar Islands 744105
                        </span>
                      </div>
                      {/* <p className="mb-0 text-lg font-medium">31 Brandy Way, Sutton, SM2 6SE</p> */}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-12">
                    <div className="px-6 w-full">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          GSTIN : GSAB12
                        </span>
                      </div>
                      {/* <p className="mb-0 text-lg font-medium">31 Brandy Way, Sutton, SM2 6SE</p> */}
                    </div>
                  </div>
                </div>
                <h4 className="mb-3 m-auto text-center text-2xl font-semibold">Invoice</h4>
                

               



                <div className="border border-dashed"></div>

                <div className="bg-white p-4">
                  <h4 className="mb-3 text-2xl font-semibold">Billing Address</h4>
                  <div className="grid grid-cols-12 gap-4 md:gap-3 ">
                    <div className="col-span-6 md:col-span-6 border-r border-neutral-40 pr-4">
                      <div className="py-4">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Name: Tej Pratap</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Email: tejas@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Mobile: 9876789543</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Country: India</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Passport: P123456789</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 pl-4">
                      <div className="py-4">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Booking ID: BKNG123</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Booking Date: 01/01/2025</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Reservation Date: 15/01/2025</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="clr-neutral-400 inline-block text-sm font-medium">Transaction ID: TXN123456</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed"></div>

                <div className="bg-white p-4">
                  <h4 className="mb-3 text-2xl font-semibold">Billing Information</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-semibold">Description</th>
                          <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                          <th className="px-4 py-2 text-left font-semibold">Unique Price</th>
                          <th className="px-4 py-2 text-left font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">Adult (12+)</td>
                          <td className="px-4 py-2">2</td>
                          <td className="px-4 py-2">₹2000</td>
                          <td className="px-4 py-2">₹4000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Child (6-8)</td>
                          <td className="px-4 py-2">3</td>
                          <td className="px-4 py-2">₹1000</td>
                          <td className="px-4 py-2">₹3000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Child (5-6)</td>
                          <td className="px-4 py-2">1</td>
                          <td className="px-4 py-2">₹1000</td>
                          <td className="px-4 py-2">₹1000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Child (3-5)</td>
                          <td className="px-4 py-2">0</td>
                          <td className="px-4 py-2">₹1000</td>
                          <td className="px-4 py-2">₹0</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Infant (1-3)</td>
                          <td className="px-4 py-2">1</td>
                          <td className="px-4 py-2">₹500</td>
                          <td className="px-4 py-2">₹500</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Infant (0-1)</td>
                          <td className="px-4 py-2">0</td>
                          <td className="px-4 py-2">₹500</td>
                          <td className="px-4 py-2">₹0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>


                </div>


                <div className="mt-4 flex justify-between pl-4">
                  <div className="text-lg font-semibold">Subtotal</div>
                  <div className="text-lg">₹8500</div>
                </div>
                <div className="flex justify-between mt-2 pl-4 mb-6 pb-12">
                  <div className="text-lg font-semibold">Amount Paid</div>
                  <div className="text-lg">₹8500</div>
                </div>

              </div>


              <div className="p-6 bg-[var(--bg-1)] rounded-lg border border-neutral-40 shadow-lg mb-6 lg:mb-10">
                <h4 className="mb-6 text-2xl font-semibold text-neutral-900">Itinerary</h4>
                <ul className="space-y-6">
                  {/* Static Itinerary Item 1 */}
                  <li className="grid grid-cols-1 sm:grid-cols-12 gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
                    {/* Day (Column 2) */}
                    <div className="col-span-2 flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
                      <span className="text-sm font-medium">Day</span>
                      <span className="text-lg font-bold ml-1">1</span>
                    </div>

                    {/* Content (Columns 4 and 6) */}
                    <div className="col-span-10">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Image (Column 4) */}
                        <div className="col-span-4 w-32 h-28 shrink-0">
                          <Image
                            width={128}
                            height={128}
                            src="https://picsum.photos/128/128?random=1" // Dummy image from Lorem Picsum
                            alt="Image"
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>

                        {/* Description (Column 6) */}
                        <div className="col-span-6">
                          <h5 className="text-xl font-semibold text-neutral-800 mb-3">Itinerary 1</h5>

                          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
                            Arrive at the destination and begin your introductory tour. Explore the local area and relax at the hotel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Static Itinerary Item 2 */}
                  <li className="grid grid-cols-1 sm:grid-cols-12 gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
                    {/* Day (Column 2) */}
                    <div className="col-span-2 flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
                      <span className="text-sm font-medium">Day</span>
                      <span className="text-lg font-bold ml-1">2</span>
                    </div>

                    {/* Content (Columns 4 and 6) */}
                    <div className="col-span-10">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Image (Column 4) */}
                        <div className="col-span-4 w-32 h-28 shrink-0">
                          <Image
                            width={128}
                            height={128}
                            src="https://picsum.photos/128/128?random=2" // Dummy image from Lorem Picsum
                            alt="Image"
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>

                        {/* Description (Column 6) */}
                        <div className="col-span-6">
                          <h5 className="text-xl font-semibold text-neutral-800 mb-3">Itinerary 2</h5>

                          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
                            Explore the city&apos;s landmarks, including the famous historical monuments, parks, and museums.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Static Itinerary Item 3 */}
                  <li className="grid grid-cols-1 sm:grid-cols-12 gap-6 hover:bg-neutral-50 p-4 rounded-lg transition-all ease-in-out">
                    {/* Day (Column 2) */}
                    <div className="col-span-2 flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shrink-0 mb-4 lg:mb-0">
                      <span className="text-sm font-medium">Day</span>
                      <span className="text-lg font-bold ml-1">3</span>
                    </div>

                    {/* Content (Columns 4 and 6) */}
                    <div className="col-span-10">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Image (Column 4) */}
                        <div className="col-span-4 w-32 h-28 shrink-0">
                          <Image
                            width={128}
                            height={128}
                            src="https://picsum.photos/128/128?random=3" // Dummy image from Lorem Picsum
                            alt="Image"
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>

                        {/* Description (Column 6) */}
                        <div className="col-span-6">
                          <h5 className="text-xl font-semibold text-neutral-800">Itinerary 3</h5>

                          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-5">
                            Spend the day relaxing on the beach. Enjoy the sun, sand, and clear blue waters, with a variety of water sports available.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>








              <div className="p-3 sm:p-4 lg:p-6 bg-[var(--bg-1)] rounded-2xl border border-neutral-40 mb-6 lg:mb-10">
                <h4 className="mb-0 text-2xl font-semibold">Inclusions & Exclusions</h4>
                <div className="border border-dashed my-5"></div>

                {/* Inclusions Section */}
                <h6 className="mb-4 font-semibold">Inclusions</h6>
                <ul className="flex flex-col gap-4 mb-10">
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 1</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 2</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 3</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                        <i className="las la-check text-lg text-primary"></i>
                      </div>
                      <span className="inline-block">Inclusion Item 4</span>
                    </div>
                  </li>
                </ul>

                {/* Exclusions Section */}
                <h6 className="mb-4 font-semibold pt-6">Exclusions</h6>
                <ul className="flex flex-col gap-4 mb-10">
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 1</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 2</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 3</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[#FFF9ED]">
                        <i className="las la-times text-xl text-[#9C742B]"></i>
                      </div>
                      <span className="inline-block">Exclusion Item 4</span>
                    </div>
                  </li>
                </ul>
              </div>


            </div>
            
          </div>


        </div>
      </div>

      <div className="text-center mt-auto">
        <h1 className="text-xl">This is a system generated invoice</h1>
      </div>
    </div>
    
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PackageReciept />
  </Suspense>
);


export default Page;
