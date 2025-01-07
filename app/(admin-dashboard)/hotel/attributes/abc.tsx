"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define the type for amenity data
interface Amenity {
  id: number;
  amenity_name: string;
  amenity_logo: string;
}

const Page = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // New states for the form
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [filteredAmenities, setFilteredAmenities] = useState<Amenity[]>([]); // State for filtered amenities

  // Fetch data from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_amenities"
        );
        const data = await response.json();
        setAmenities(data.data || []);
        setFilteredAmenities(data.data || []); // Initialize filtered amenities
        setLoading(false);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        alert("Failed to fetch amenities. Please try again later.");
      }
    };
    fetchAmenities();
  }, []);

  // Filter amenities based on the search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredAmenities(amenities);
    } else {
      const filtered = amenities.filter((amenity) =>
        amenity.amenity_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAmenities(filtered);
    }
  }, [searchQuery, amenities]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAmenities.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  function handleDelete(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Hotel Attributes</h2>
        <Link href="/hotel/all-hotels" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Hotel
        </Link>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Attributes</h3>
          {/* Form for adding attributes */}
        </div>

        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                />
                <SearchIcon />
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">ID</th>
                  <th className="py-3 lg:py-4 px-2">Attribute Name</th>
                  <th className="py-3 lg:py-4 px-2">Icon</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((amenity, index) => (
                    <tr key={amenity.id} className="border-b border-dashed">
                      <td className="py-3 lg:py-4 px-2">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 lg:py-4 px-2">{amenity.amenity_name}</td>
                      <td className="py-3 lg:py-4 px-2">
                        <Image
                          src={amenity.amenity_logo}
                          alt={amenity.amenity_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </td>
                      <td className="py-3 lg:py-4 px-2 flex items-center space-x-2">
                        <Link href={`/hotel/edit-hotel-attributes?amenityId=${amenity.id}`}>
                          <PencilSquareIcon className="w-5 h-5 text-primary" />
                        </Link>
                        <button
                          className="text-[var(--secondary-500)]"
                          onClick={() => handleDelete(amenity.id)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No matching attributes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={filteredAmenities.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
