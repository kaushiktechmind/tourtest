"use client";
import Image from "next/image";
import Link from "next/link";
import featured1 from "@/public/img/featured-img-1.jpg";
import { useRouter, useSearchParams } from "next/navigation";
import { Children } from "react";

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

const adults = localStorage.getItem("grandTotalAdultCount");
const children = localStorage.getItem("grandTotalChildrenCount");
const infants = localStorage.getItem("grandTotalInfantCount");

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const grandTotal = searchParams.get("grandTotal");
  const totalAdultPrice = searchParams.get("totalAdultPrice");
  const totalChildPrice = searchParams.get("totalChildPrice");
  const totalExtraBedPrice = searchParams.get("totalExtraBedPrice");
  const roomId = searchParams.get("roomId");

  const roomIdsParam = searchParams.get("roomIds");

  // Convert the roomIds parameter to an array if it exists
  const selectedRoomIds = roomIdsParam
    ? roomIdsParam.split(",").map((id) => Number(id))
    : [];

  const [roomsData, setRoomsData] = useState<any[]>([]);
  useEffect(() => {
    const fetchRoomData = async () => {
      const roomPromises = selectedRoomIds.map(async (roomId) => {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/hotel_rooms/${roomId}`
        );
        const data = await response.json();
        return data.room; // Access the room data from the response
      });

      const rooms = await Promise.all(roomPromises);
      setRoomsData(rooms);
    };

    if (selectedRoomIds.length > 0) {
      fetchRoomData();
    }
  }, [selectedRoomIds]);

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6  mt-[40px]">
          <div className="col-span-12 lg:col-span-8">
            <div className="pb-lg-0">
              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                <h3 className="mb-0 h3"> Your Booking Info </h3>
                <div className="border border-dashed my-6"></div>
                <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-4 px-xxl-8">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Booking date
                        </span>
                        <i className="text-2xl las la-edit"></i>
                      </div>
                      <p className="mb-0 text-lg font-medium">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Adults
                        </span>
                        <i className="text-2xl las la-edit"></i>
                      </div>
                      <p className="mb-0 text-lg font-medium"> {adults} </p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Children
                        </span>
                        <i className="text-2xl las la-edit"></i>
                      </div>
                      <p className="mb-0 text-lg font-medium"> {children} </p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-4 px-8">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="clr-neutral-400 inline-block text-sm">
                          Infants
                        </span>
                        <i className="text-2xl las la-edit"></i>
                      </div>
                      <p className="mb-0 text-lg font-medium"> {infants} </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 w-full">
                  {roomsData.map((roomData, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap border items-center rounded-2xl"
                    >
                      <div className="rounded-2xl p-2">
                        <Image
                          src={roomData.featured_images[0]} // Use the first featured image
                          alt={roomData.room_name} // Use room name as alt text
                          width={100}
                          height={100}
                          className="h-[200px] w-full md:w-[350px] rounded-2xl"
                        />
                      </div>

                      <div className="p-4">
                        <div className="property-card__body">
                          <Link
                            href="hotel-listing-details"
                            className="link block text-[var(--neutral-700)] hover:text-primary text-xl font-medium mb-5"
                          >
                            {roomData.room_name}
                          </Link>
                          <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-1">
                              <i className="las la-map-marker-alt text-xl text-[#22804A]"></i>
                              <span className="inline-block">
                                {" "}
                                {roomData.hotel_name}
                              </span>
                            </div>
                          </div>
                          <div className="border border-dashed my-6"></div>
                          <ul className="flex flex-wrap gap-6"></ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                <h4 className="mb-3 text-2xl font-semibold">
                  {" "}
                  Billing address{" "}
                </h4>
                <div className="border border-dashed my-6"></div>
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="email"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Phone Number"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="rounded-full border bg-[var(--bg-1)] pr-4">
                      <select
                        className="w-full bg-transparent px-5 py-3 focus:outline-none"
                        aria-label="Default select example"
                      >
                        <option>India</option>
                        <option value="1">USA</option>
                        <option value="1">New York</option>
                        <option value="2">Chicago</option>
                        <option value="3">Atlanta</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12">
                    <input
                      type="text"
                      className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-full py-3 px-5"
                      placeholder="Enter Passport Number (if outside india)"
                    />
                  </div>
                  <div className="col-span-12">
                    <textarea
                      rows={5}
                      className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-3xl focus:outline-none py-3 px-6"
                      placeholder="Enter Address"
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
                <li className="flex items-center justify-between flex-wrap">
                  <p className="mb-0">Adult Price</p>
                  <p className="mb-0 font-medium">₹{totalAdultPrice}</p>
                </li>
                <li className="flex items-center justify-between flex-wrap">
                  <p className="mb-0">Child Price</p>
                  <p className="mb-0 font-medium">₹{totalChildPrice}</p>
                </li>
                <li className="flex items-center justify-between flex-wrap">
                  <p className="mb-0">Extra Bed Price</p>
                  <p className="mb-0 font-medium">₹{totalExtraBedPrice}</p>
                </li>
              </ul>
              <div className="border border-dashed my-8"></div>
              <div className="flex items-center justify-between flex-wrap mb-6">
                <p className="mb-0">Grand Total</p>
                <p className="mb-0 font-medium">₹{grandTotal}</p>
              </div>
              <RazorpayButton
                grandTotal={Number(grandTotal) * 100}
                currency="INR"
                adults={Number(adults)}
                infants={Number(infants)}
              >
                {Number(children)}
              </RazorpayButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
