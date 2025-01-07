"use client";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";


const Page = () => {
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const locId = searchParams.get("locId");

  // Fetch location by ID on component mount or when locId changes
  useEffect(() => {
    if (locId) {
      fetchLocationById(locId);
    }
  }, [locId]);

  const fetchLocationById = async (id: string | null) => {
    setLoading(true);
  
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_location_by_id/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      setLocationName(data.location_name); // Set location name for editing
      // router.push('/location/all-location');
    }
  
    setLoading(false);
  };
  

  const handleUpdateLocation = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);
  
    const token = localStorage.getItem("access_token");
  
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_location_by_id/${locId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ location_name: locationName }),
    });
  
    if (response.ok) {
      setLocationName("");
      alert("Location updated successfully!");
      router.push('/location/all-location');
      await fetchLocationById(locId); // Refresh location data
    }
  };
  
  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Location</h2>
        <Link href="/location/all-location" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All Location
        </Link>
      </div>
      
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Location</h3>
            <form onSubmit={handleUpdateLocation}>
              <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                Location Name:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Location name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update Location
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
