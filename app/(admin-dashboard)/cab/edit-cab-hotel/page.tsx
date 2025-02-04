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
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";


const EditCabPickup = () => {
  const [pickupTitle, setpickupTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pickupId = searchParams.get("pickupId");

  // Fetch pickup by ID on component mount or when pickupId changes
  useEffect(() => {
    if (pickupId) {
      fetchPickupById(pickupId);
    }
  }, [pickupId]);

  const fetchPickupById = async (id: string | null) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/get_cab_pickup_point_name_by_id/${id}`);
    if (!response.ok) throw new Error("Failed to fetch pickup");

    const data = await response.json();
    setpickupTitle(data.cab_pickup_point_name); // Set pickup name for editing
    // router.push('/pickup/all-pickup');

    setLoading(false);
  };


  const handleUpdatePickup = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);

    const token = localStorage.getItem("access_token");

    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_cab_pickup_point_name_by_id/${pickupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ cab_pickup_point_name: pickupTitle }),
    });

    if (!response.ok) throw new Error("Failed to save pickup");

    setpickupTitle("");
    alert("Pickup updated successfully!");
    router.push('/cab/cab-hotel');
    await fetchPickupById(pickupId); // Refresh pickup data
  };


  return (
    
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Hotel</h2>
        <Link href="/pickup/all-pickup" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All Hotels
        </Link>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
      <div className="col-span-12 flex justify-center">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Hotel</h3>
            <form onSubmit={handleUpdatePickup}>
              {/* <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                Pickup:
              </label> */}
              <input
                type="text"
                id="name"
                placeholder="Pickup Title"
                value={pickupTitle}
                onChange={(e) => setpickupTitle(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update Pickup
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditCabPickup />
  </Suspense>
);

export default Page;
