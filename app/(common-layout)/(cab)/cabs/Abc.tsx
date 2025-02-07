"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import CardPagination from "@/components/CardPagination";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Activity {
  id: number;
  banner_image_multiple: string[];
  location: string;
  seo_title: string;
  cab_name: string;
  start_time: string;
  price: string;
  sale_price: number;
}

const Page = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [itemsPerPage] = useState(6);  // Set items per page

  const loc = localStorage.getItem("storedLocation");
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/cab-main-forms",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();

        let normalizedData = data;

        // Apply location filter if location is available
        if (loc && loc.trim() !== "") {
          normalizedData = data.filter(
            (activity: Activity) => activity.location === loc
          );
        }

        setActivities(normalizedData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [loc]); // Re-run effect if loc changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {activities.map(
        ({ id, banner_image_multiple, location, cab_name, price, sale_price, seo_title }) => (
          <div key={id} className="col-span-12 md:col-span-6 group">
            <div className="bg-white rounded-2xl p-3">
              <div className="relative">
                <div className="rounded-2xl">
                  <Image
                    width={0}  // Use 0 for width to allow the image to scale fluidly
                    height={0} // Use 0 for height to allow the image to scale fluidly
                    src={banner_image_multiple[0]}
                    alt="Package Image"
                    className="rounded-2xl w-full h-[330px] object-cover" // Fixed height, fluid width, and cover aspect ratio
                  />

                </div>
              </div>
              <div className="p-4 xl:p-5">
                <div className="flex justify-between mb-4">
                  <Link
                    href={`/cab/${seo_title}`}
                    className="link block text-xl font-medium h-[3.1rem] line-clamp-2 overflow-hidden break-words"
                  >
                    {cab_name}
                  </Link>

                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                    <span className="inline-block">{location}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-dash-long my-3 mx-4"></div>

              <div className="p-4">
                <div className="flex flex-wrap justify-between items-center">
                  <span className="block  font-medium line-through">
                    ₹ {price}
                    <span className="inline-block font-medium text-xl text-primary pl-2"> ₹{sale_price}</span>
                  </span>
                  <Link
                    href={`/cab/${seo_title}`}
                    className="btn-outline font-semibold">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <CardPagination currentPage={0} totalPages={0} onPageChange={function (page: number): void {
        throw new Error("Function not implemented.");
      }} />
    </>
  );
};

export default Page;
