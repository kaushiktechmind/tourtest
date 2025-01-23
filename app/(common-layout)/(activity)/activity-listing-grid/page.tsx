"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import CardPagination from "@/components/CardPagination";
import 'font-awesome/css/font-awesome.min.css';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Package {
  id: number;
  banner_image_multiple: string[];
  location_name: string;
  activity_title: string;
  start_time: string;
  duration: string;
  price: number;
  sale_price: number;
}

const Page = () => {
  const [activities, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Set the number of items per page

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_all_activity",
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
        setPackages(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Pagination logic to slice the data for the current page
  const indexOfLastActivity = currentPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  // Calculate total pages
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentActivities.map(
        ({ id, banner_image_multiple, location_name, activity_title, start_time, duration, price, sale_price }) => (
          <div key={id} className="col-span-12 md:col-span-6 group">
            <div className="bg-white rounded-2xl p-3">
              <div className="relative">
                <div className="rounded-2xl">
                  <Image
                    width={386}
                    height={224}
                    src={banner_image_multiple[0]}
                    alt="Package Image"
                    className="rounded-2xl h-[224px] xl:w-[386px] w-full"
                  />
                </div>
              </div>
              <div className="p-4 xl:p-5">
                <div className="flex justify-between mb-4">
                  <Link
                    href={`/activity-listing-details?activityId=${id}`}
                    className="link block flex-grow text-xl font-medium">
                    {activity_title}
                  </Link>
                </div>
                <div className="flex justify-between mb-6">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                    <span className="inline-block">{location_name}</span>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="col-span-1">
                    <div className="flex items-center gap-2">
                      <i className="las la-clock text-xl text-[#22804A]"></i>
                      <span className="block">{start_time} </span>
                    </div>
                  </li>
                  <li className="col-span-1">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-hourglass-half text-xl text-[#22804A]"></i>
                      <span className="block">{duration} </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-b border-dash-long my-3 mx-4"></div>

              <div className="p-4">
                <div className="flex flex-wrap justify-between items-center">
                  <span className="block font-medium line-through">
                    ₹ {price}
                    <span className="inline-block font-medium text-xl text-primary pl-2">
                      ₹{sale_price}
                    </span>
                  </span>
                  <Link
                    href={`/activity-listing-details?activityId=${id}`}
                    className="btn-outline font-semibold">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <CardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Page;
