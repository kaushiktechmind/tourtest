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

interface Package {
  id: number;
  banner_image: string[];
  location_name: string;
  seo_title: string;
  package_title: string;
  duration: string;
  sale_price: number;
}

const Page = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [itemsPerPage] = useState(6);  // Set items per page

  const loc = localStorage.getItem("storedLocation");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_package",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();

        let normalizedData = data;

        // Apply location filter if location is available
        if (loc && loc.trim() !== "") {
          normalizedData = data.filter(
            (pkg: Package) => pkg.location_name === loc
          );
        }

        setPackages(normalizedData);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Logic for slicing the packages array for pagination
  const indexOfLastPackage = currentPage * itemsPerPage;
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage;
  const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);

  // Calculate total number of pages
  const totalPages = Math.ceil(packages.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
    {currentPackages.map(
      ({ id, banner_image, location_name, package_title, duration, seo_title, sale_price }) => (
        <div key={id} className="col-span-12 md:col-span-6 group">
          <div className="bg-white rounded-2xl p-3">
            <div className="relative">
              <div className="rounded-2xl">
                <Image
                  width={386}
                  height={224}
                  src={banner_image[0]}
                  alt="Package Image"
                  className="rounded-2xl h-[330px] object-cover w-full"
                />
              </div>
            </div>
            <div className="p-4 xl:p-5">
              <div className="flex justify-between mb-4">
                <Link
                  href={`/package/${seo_title}`}
                  className="link block flex-grow text-xl font-medium h-[3.1rem] line-clamp-2 overflow-hidden"
                >
                  {package_title}
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
                    <span className="block">{duration}</span>
                  </div>
                </li>
              </ul>
            </div>
  
            <div className="border-b border-dash-long my-3 mx-4"></div>
  
            <div className="p-4">
              <div className="flex flex-wrap justify-between items-center">
                <span className="block text-xl font-medium text-primary">
                  ₹{sale_price}
                  <span className="inline-block font-normal text-base">
                    /Pax
                  </span>
                </span>
                <Link
                  href={`/package/${seo_title}`}
                  className="btn-outline font-semibold"
                >
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
