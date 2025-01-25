"use client";

import { useEffect, useState } from "react";
import CardPagination from "@/components/CardPagination";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface Activity {
  id: number;
  location_name: string;
  activity_title: string;
  activity_content: string;
  youtube_video_image: string;
  start_time: string;
  duration: string;
  price: string;
  sale_price: string;
  banner_image_multiple: string[];
}

const Page = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const loc = localStorage.getItem("storedLocation");

  useEffect(() => {
    const fetchActivities = async () => {
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

        const data: Activity[] = await response.json();

        // Apply location filter if location exists
        const filteredActivities = loc
          ? data.filter((activity) => activity.location_name === loc)
          : data;

        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [loc]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Pagination logic
  const indexOfLastActivity = currentPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentActivities.map(
        ({
          id,
          banner_image_multiple,
          location_name,
          activity_title,
          start_time,
          price,
          sale_price,
        }) => (
          <div key={id} className="col-span-12">
            <div className="p-2 md:p-3 rounded-2xl flex flex-col items-center md:flex-row bg-white">
              <div className="relative">
                <div className="rounded-2xl">
                  <Image
                    width={386}
                    height={224}
                    src={banner_image_multiple[0] || "/placeholder.png"}
                    alt={`${activity_title} Image`}
                    className="rounded-2xl h-[300px] object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow h-full p-3 sm:p-4">
                <div className="property-card__body">
                  <div className="flex justify-between mb-2">
                    <Link
                      href={`/activity-details?activityId=${id}`}
                      className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium"
                    >
                      {activity_title}
                    </Link>
                  </div>
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                      <span className="inline-block">{location_name}</span>
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <div className="border border-dashed"></div>
                </div>
                <div className="py-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="block font-medium line-through">
                      ₹{price}
                      <span className="inline-block font-medium text-xl text-primary pl-2">
                        ₹{sale_price}
                      </span>
                    </span>
                    <Link
                      href={`/activity-details?activityId=${id}`}
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
