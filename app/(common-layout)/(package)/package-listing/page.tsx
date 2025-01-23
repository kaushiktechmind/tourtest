"use client";

import { useEffect, useState } from "react";
import CardPagination from "@/components/CardPagination";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface Package {
  id: number;
  banner_image: string[];
  location_name: string;
  package_title: string;
  duration: string;
  sale_price: number;
}

const Page = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of items per page

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
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Calculate the paginated packages
  const paginatedPackages = packages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total number of pages
  const totalPages = Math.ceil(packages.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {paginatedPackages.map(
        ({ id, banner_image, location_name, package_title, duration, sale_price }) => (
          <div key={id} className="col-span-12">
            <div className="p-2 md:p-3 rounded-2xl flex flex-col items-center md:flex-row bg-white ">
              <div className="relative">
                <div className="rounded-2xl">
                  <Image
                    width={386}
                    height={224}
                    src={banner_image[0]}
                    alt="Package Image"
                    className="rounded-2xl h-[300px] object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow h-full p-3 sm:p-4">
                <div className="property-card__body ">
                  <div className="flex justify-between mb-2">
                    <Link
                      href={`/package-listing-details?packageId=${id}`}
                      className="link block flex-grow text-[var(--neutral-700)] hover:text-primary text-xl font-medium">
                      {package_title}
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
                    <span className="block text-xl font-medium text-primary">
                      ₹{sale_price}
                      <span className="inline-block text-gray-500 text-base font-normal">
                        /Pax
                      </span>
                    </span>
                    <Link
                      href={`/package-listing-details?packageId=${id}`}
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
      <CardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Page;
