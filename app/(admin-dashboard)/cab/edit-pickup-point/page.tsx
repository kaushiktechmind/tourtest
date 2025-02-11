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


const EditCabPickupPoint = () => {
  const [pickuppointTitle, setpickuppointTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pickupId = searchParams.get("pickupId");

  // Fetch pickuppoint by ID on component mount or when pickupId changes
  useEffect(() => {
    if (pickupId) {
      fetchPickupPointById(pickupId);
    }
  }, [pickupId]);

  const fetchPickupPointById = async (id: string | null) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/get_cab_pickup_point_name_by_id/${pickupId}`);
    if (!response.ok) throw new Error("Failed to fetch pickuppoint");

    const data = await response.json();
    setpickuppointTitle(data.cab_pickup_point_name); // Set pickuppoint name for editing
    // router.push('/pickuppoint/all-pickuppoint');

    setLoading(false);
  };

  const handleUpdatePickupPoint = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmitError(null);
  
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      alert("Failed to update pickup point.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://yrpitsolutions.com/tourism_api/api/admin/update_cab_pickup_point_name_by_id/${pickupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cab_pickup_point_name: pickuppointTitle }),
        }
      );
  
      if (response.ok) {
        setpickuppointTitle("");
        alert("Pickup point updated successfully!");
        router.push("/cab/pickup-point");
        await fetchPickupPointById(pickupId); // Refresh pickup point data
      } else {
        alert("Failed to update pickup point.");
      }
    } catch (error) {
      alert("Failed to update pickup point.");
    }
  };
  


  return (
    
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Pickup Point</h2>
        <Link href="/cab/pickup-point" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All Pickup Point
        </Link>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
      <div className="col-span-12 flex justify-center">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Pickup Point</h3>
            <form onSubmit={handleUpdatePickupPoint}>
              <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                Pickup Point:
              </label>
              <input
                type="text"
                id="name"
                placeholder=""
                value={pickuppointTitle}
                onChange={(e) => setpickuppointTitle(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update Pickup Point
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
    <EditCabPickupPoint />
  </Suspense>
);

export default Page;
