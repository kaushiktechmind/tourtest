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

interface Location {
  id: string;  // Or number, depending on the type of 'id'
  location_name: string;
  // Add other fields as needed
}

const Page = () => {
   const [locations, setLocations] = useState<Location[]>([]); 
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_location");
    const data = await response.json();
    setLocations(data);
    setLoading(false);
  };
  
  const handleAddLocation = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
  
    const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ location_name: locationName }),
    });
  
    if (response.ok) {
      setLocationName("");
      await fetchLocations();
      alert("Location Added Successfully");
    }
  };
  

  const handleDeleteLocation = async (id: any) => {
    const token = localStorage.getItem("access_token");
  
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/delete_location_by_id/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      // Refresh location list after deletion
      await fetchLocations();
      alert("Deleted Successfully");
    }
  };
  

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Location</h2>
        {/* <Link href="#" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> Edit Location
        </Link> */}
      </div>
      
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Add Location</h3>
            <form onSubmit={handleAddLocation}>
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
                Add New
              </button>
            </form>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            {/* <div className="flex flex-wrap gap-3 justify-between mb-7">
              <form className="flex items-center gap-3">
                <div className="border rounded-full flex items-center p-1 pr-2 bg-[var(--bg-1)]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="rounded-full bg-transparent focus:outline-none p-2"
                  />
                  <SearchIcon />
                </div>
              </form>
            </div> */}
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                    <th className="py-3 font-medium lg:py-4 px-2 lg:px-4">
                      Location Name
                    </th>
                    <th className="py-3 font-medium lg:py-4 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3 text-red-500">{error}</td>
                    </tr>
                  ) : (
                    locations.map((location) => (
                      <tr
                        key={location.id}
                        className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                        <td className="py-3 lg:py-4 px-2">{location.location_name}</td>
                        <td className="py-3 lg:py-4 px-2 flex gap-2 items-center">
                          <Link className="text-primary" href={`/location/edit-location?locId=${location.id}`}>
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-[var(--secondary-500)]">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
