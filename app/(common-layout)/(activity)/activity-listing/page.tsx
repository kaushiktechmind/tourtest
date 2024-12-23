"use client";

import { useEffect, useState } from "react";
import CardPagination from "@/components/CardPagination";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import 'font-awesome/css/font-awesome.min.css';
import Image from "next/image";
import Link from "next/link";

interface Activity {
  id: number;
  banner_image_multiple: string[];
  location_name: string;
  activity_title: string;
  start_time: string;
  duration: string;
  price: string;
  sale_price: number;
}

const Page = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          // "https://yrpitsolutions.com/tourism_api/api/admin/get_activity",
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
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {activities.map(
        ({ id, banner_image_multiple, location_name, activity_title, start_time, duration, price, sale_price }) => (
          <div key={id} className="col-span-12 ">
            <div className="p-2 md:p-3 rounded-2xl flex flex-col items-center md:flex-row bg-white ">
              <div className="relative">
                <div className="rounded-2xl">
                  <Image
                    width={386}
                    height={224}
                    src={banner_image_multiple[0]}
                    alt="Activity Image"
                    className="rounded-2xl h-[300px] object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow h-full p-3 sm:p-4">
                <div className="property-card__body ">
                  <div className="flex justify-between mb-2">
                    <Link
                      href={`/activity-listing-details?activityId=${id}`}
                      className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium">
                      {activity_title}
                    </Link>
                  </div>
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-5 h-5 text-[#9C742B]" />
                      <span className="inline-block">{location_name}</span>
                    </div>
                  </div>
                  <ul className="flex gap-3">
                    <li className="col-6">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-[var(--secondary-500)]" />
                        <span className="block text-sm">{start_time}</span>
                      </div>
                    </li>
                    <li className="col-6">
                      <div className="flex items-center gap-2">
                      <i className="fa fa-hourglass-half text-xl text-[#22804A]"></i>
                        <span className="block text-sm">{duration}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="my-4">
                  <div className="border border-dashed"></div>
                </div>
                <div className="py-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="block  font-medium line-through">
                      ₹ {price}
                      <span className="inline-block font-medium text-xl text-primary pl-2"> ₹{sale_price}</span>
                    </span>
                    <Link
                      href={`/activity-listing-details?activityId=${id}`}
                      className="btn-outline py-2 text-primary font-semibold">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <CardPagination />
    </>
  );
};

export default Page;
