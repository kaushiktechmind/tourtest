"use client";

import { useEffect, useState } from "react";
import CardPagination from "@/components/CardPagination";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface Activity {
  id: number;
  banner_image_multiple: string[];
  location: string;
  cab_name: string;
  start_time: string;
  price: string;
  sale_price: number;
  seo_title: string;
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

  // Logic for slicing the activities array for pagination
  const indexOfLastActivity = currentPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  // Calculate total number of pages
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentActivities.map(
        ({ id, banner_image_multiple, location, cab_name, start_time, price, sale_price, seo_title }) => (
          <div key={id} className="col-span-12">
            <div className="p-2 md:p-3 rounded-2xl flex flex-col md:flex-row bg-white">

              {/* Image Section */}
              <div className="relative md:w-1/2 w-full">
                <Image
                  width={386}
                  height={224}
                  src={banner_image_multiple[0] || "/placeholder.png"}
                  alt="Activity Image"
                  className="rounded-2xl h-[350px] md:h-full object-cover w-full"
                />
              </div>

              {/* Details Section */}
              <div className="flex-grow h-full p-3 sm:p-4 md:w-1/2">
                <div className="property-card__body">
                  <div className="flex justify-between mb-2">
                    <Link
                      href={`/cab/${seo_title}`}
                      className="link block text-xl font-medium h-[3.1rem] line-clamp-2 overflow-hidden break-words"
                    >
                      {cab_name}
                    </Link>
                  </div>
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                      <span className="inline-block">{location}</span>
                    </div>
                  </div>
                </div>

                <div className="my-4">
                  <div className="border border-dashed"></div>
                </div>

                <div className="py-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="block font-medium line-through text-gray-500">
                      ₹{price}
                      <span className="inline-block font-medium text-xl text-primary pl-2">
                        ₹{sale_price}
                      </span>
                    </span>
                    <Link
                      href={`/cab/${seo_title}`}
                      className="btn-outline py-2 text-primary font-semibold"
                    >
                      Book Now
                    </Link>
                  </div>
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
