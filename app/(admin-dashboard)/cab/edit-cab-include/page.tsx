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


const EditCabInclude = () => {
  const [includeTitle, setincludeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const includeId = searchParams.get("includeId");

  // Fetch include by ID on component mount or when includeId changes
  useEffect(() => {
    if (includeId) {
      fetchIncludeById(includeId);
    }
  }, [includeId]);

  const fetchIncludeById = async (id: string | null) => {
    setLoading(true);
    setError(null);
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_cab_inclusion_by_id/${id}`);
    if (!response.ok) return; // No error handling, just return if the response is not OK
    const data = await response.json();
    setincludeTitle(data.cab_inclusion_title); // Set include name for editing
    setLoading(false);
  };
  

  const handleUpdateInclude = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    const token = localStorage.getItem("access_token");
    
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_cab_inclusion_by_id/${includeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ cab_inclusion_title: includeTitle }),
    });
    
    if (!response.ok) {
      alert("Failed to update include");
      return;
    }
  
    setincludeTitle("");
    alert("Include updated successfully!");
    router.push('/cab/cab-include');
    await fetchIncludeById(includeId); // Refresh include data
  };
  
  return (
    
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Cab Include</h2>
        <Link href="/cab/cab-include" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All Include
        </Link>
      </div>
      
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Include</h3>
            <form onSubmit={handleUpdateInclude}>
              <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                Include:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Include Title"
                value={includeTitle}
                onChange={(e) => setincludeTitle(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update Include
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
    <EditCabInclude />
  </Suspense>
);

export default Page;
