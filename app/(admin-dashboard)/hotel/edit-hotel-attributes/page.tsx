"use client";
import {
  CloudArrowUpIcon,
  InformationCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Page = () => {
  const [amenityData, setAmenityData] = useState({
    amenity_name: "",
    amenity_logo: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null); // Allow File or null

  const router = useRouter();
  const searchParams = useSearchParams(); // Using useSearchParams for query params

  // Getting the query parameter `amenityId` from searchParams
  const amenityId = searchParams.get("amenityId");

  // Fetch the amenity data by ID
  useEffect(() => {
    if (amenityId) {
      const fetchData = async () => {
        const token = localStorage.getItem("access_token");
        try {
          const response = await fetch(
            `https://yrpitsolutions.com/tourism_api/api/admin/get_amenities_by_id/${amenityId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data && data.data) {
            setAmenityData({
              amenity_name: data.data.amenity_name,
              amenity_logo: data.data.amenity_logo, // Assuming this is the URL of the current logo
            });
          }
        } catch (error) {
          console.error("Error fetching amenity data:", error);
        }
      };
      fetchData();
    }
  }, [amenityId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAmenityData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIconFile(e.target.files[0]);
    }
  };

  // Handle form submission to update the amenity
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("amenity_name", amenityData.amenity_name);
    if (iconFile) {
      formData.append("amenity_logo", iconFile); // Append the new logo file only if updated
    }

    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_amenities_by_id/${amenityId}`,
        {
          method: "PUT", // Try PUT or PATCH here
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Amenity updated successfully!");
      } else {
        console.error("Error updating amenity:", result);
        alert("Error updating amenity.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Hotel Attributes</h2>
        <Link href="/hotel/attributes" className="btn-primary">
          <EyeIcon className="w-5 h-5" /> View All Attributes
        </Link>
      </div>

      {/* Edit form */}
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative pb-10 xxl:pb-0">
        <div className="col-span-12 flex justify-center">
          <div className="lg:w-6/12 p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Attributes</h3>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="amenity_name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium"
              >
                Name :
              </label>
              <input
                type="text"
                id="amenity_name"
                value={amenityData.amenity_name}
                onChange={handleInputChange}
                placeholder="Attribute name"
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />

              {/* Show the current logo if available */}
              {amenityData.amenity_logo && (
                <div className="mt-4">
                  <img
                    src={amenityData.amenity_logo}
                    alt="Current Amenity Logo"
                    className="h-20 w-20 object-contain"
                  />
                </div>
              )}

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
                      <span className="flex items-center justify-center flex-wrap gap-5">
                        <span className="flex items-center gap-2">
                          <InformationCircleIcon className="w-5 h-5" />
                          <span className="block mb-0 clr-neutral-500">
                            Maximum allowed file size is 9.00 MB
                          </span>
                        </span>
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

              <div className="mt-[20px] text-center">
                <button type="submit" className="btn-primary font-semibold">
                  <span className="inline-block"> Update </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
