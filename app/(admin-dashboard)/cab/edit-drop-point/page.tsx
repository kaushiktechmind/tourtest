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


const EditCabDropPoint = () => {
  const [droppointTitle, setdroppointTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const droppointId = searchParams.get("droppointId");

  // Fetch droppoint by ID on component mount or when droppointId changes
  useEffect(() => {
    if (droppointId) {
      fetchDropPointById(droppointId);
    }
  }, [droppointId]);

  const fetchDropPointById = async (id: string | null) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/get_cab_drop_point_name_by_id/${id}`);
    if (!response.ok) throw new Error("Failed to fetch droppoint");

    const data = await response.json();
    setdroppointTitle(data.cab_drop_point_name); // Set droppoint name for editing
    // router.push('/droppoint/all-droppoint');

    setLoading(false);
  };


  const handleUpdateDropPoint = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);

    const token = localStorage.getItem("access_token");

    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_cab_drop_point_name_by_id/${droppointId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ cab_drop_point_name: droppointTitle }),
    });

    if (!response.ok) throw new Error("Failed to save droppoint");

    setdroppointTitle("");
    alert("DropPoint updated successfully!");
    router.push('/cab/drop-point');
    await fetchDropPointById(droppointId); // Refresh droppoint data
  };


  return (
    
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Cab DropPoint</h2>
        <Link href="/droppoint/all-droppoint" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All DropPoint
        </Link>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
      <div className="col-span-12 flex justify-center">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit DropPoint</h3>
            <form onSubmit={handleUpdateDropPoint}>
              <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                DropPoint:
              </label>
              <input
                type="text"
                id="name"
                placeholder="DropPoint Title"
                value={droppointTitle}
                onChange={(e) => setdroppointTitle(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update DropPoint
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
    <EditCabDropPoint />
  </Suspense>
);

export default Page;
