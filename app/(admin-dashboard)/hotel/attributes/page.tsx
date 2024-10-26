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

  // New states for the form
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_amenities"
        );
        const data = await response.json();
        setAmenities(data.data || []); // Ensure amenities is set to an empty array if data is undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        alert("Failed to fetch amenities. Please try again later.");
      }
    };
    fetchAmenities();
  }, []);

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !file) {
      alert("Please enter an amenity name and upload an icon.");
      return;
    }

    const formData = new FormData();
    formData.append("amenity_name", name);
    formData.append("amenity_logo", file);

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "https://yrpitsolutions.com/tourism_api/api/admin/save_amenities",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Safeguard: Ensure prev is an array
        setAmenities((prev) => [
          ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
          {
            id: result.data.id,
            amenity_name: name,
            amenity_logo: result.data.amenity_logo,
          },
        ]);
        // Reset the form
        setName("");
        setFile(null);
      } else {
        console.error(result.message);
        alert("Failed to add amenity. Please try again.");
      }
    } catch (error) {
      console.error("Error saving amenity:", error);
      alert("An error occurred while saving the amenity.");
    }
  };

  // Function to handle amenity deletion
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this amenity?"
    );
    if (!confirmDelete) return;

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/delete_amenities_by_id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setAmenities((prev) =>
          Array.isArray(prev) ? prev.filter((amenity) => amenity.id !== id) : []
        );
        alert("Amenity deleted successfully.");
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete amenity.");
      }
    } catch (error) {
      console.error("Error deleting amenity:", error);
      alert("An error occurred while deleting the amenity.");
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Hotel Attributes</h2>
        <Link href="/hotel/all-hotels" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Hotel
        </Link>
      </div>

      {/* Statistics */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <h3 className="border-b h3 pb-6">Add Attributes</h3>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Name :
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Attribute name"
              className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
            />
            <label
              htmlFor="icon"
              className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
            >
              Upload Icon :
            </label>
            <div className="pt-6">
              <div className="flex items-center justify-center border-dashed rounded-2xl w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full cursor-pointer bg-[var(--bg-2)] rounded-2xl border border-dashed"
                >
                  <span className="flex flex-col items-center justify-center py-12">
                    <CloudArrowUpIcon className="w-[60px] h-[60px]" />
                    <span className="h3 clr-neutral-500 text-center mt-4 mb-3">
                      Drag & Drop
                    </span>
                    <span className="block text-center mb-6 clr-neutral-500">
                      OR
                    </span>
                    <span className="inline-block py-3 px-6 rounded-full bg-[#354764] text-white mb-10">
                      Select Files
                    </span>
                  </span>
                  <input
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="mt-[20px]">
              <button type="submit" className="btn-primary font-semibold">
                <span className="inline-block"> Add New </span>
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-6 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
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
                  <th className="py-3 lg:py-4 px-2">Amenity Name</th>
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
                ) : (
                  (amenities || []).map(
                    (
                      amenity // Use empty array if amenities is undefined
                    ) => (
                      <tr key={amenity.id} className="border-b border-dashed">
                        <td className="py-3 lg:py-4 px-2">{amenity.id}</td>
                        <td className="py-3 lg:py-4 px-2">
                          {amenity.amenity_name}
                        </td>
                        <td className="py-3 lg:py-4 px-2">
                          <Image
                            src={`${amenity.amenity_logo}`}
                            alt={amenity.amenity_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </td>
                        <td className="py-3 lg:py-4 px-2 flex items-center space-x-2">
                          <Link
                            href={`/hotel/edit-hotel-attributes?amenityId=${amenity.id}`}
                          >
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
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
