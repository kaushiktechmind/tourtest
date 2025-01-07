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
  const [excludeTitle, setexcludeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const excludeId = searchParams.get("excludeId");

  // Fetch exclude by ID on component mount or when excludeId changes
  useEffect(() => {
    if (excludeId) {
      fetchExcludeById(excludeId);
    }
  }, [excludeId]);

  const fetchExcludeById = async (id: string | null) => {
    setLoading(true);
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/get_package_exclude_by_id/${id}`);
    const data = await response.json();
    setexcludeTitle(data.exclude_title); // Set exclude name for editing
    setLoading(false);
  };
  

  const handleUpdateExclude = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);
  
    const token = localStorage.getItem("access_token");
  
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/update_package_exclude_by_id/${excludeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ exclude_title: excludeTitle }),
    });
  
    if (response.ok) {
      setexcludeTitle("");
      alert("Exclude updated successfully!");
      router.push('/package/package-exclude');
      await fetchExcludeById(excludeId); // Refresh exclude data
    }
  };
  
  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Edit Package Exclude</h2>
        <Link href="/exclude/all-exclude" className="btn-primary">
          <PencilSquareIcon className="w-5 h-5" /> All Exclude
        </Link>
      </div>
      
      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Edit Exclude</h3>
            <form onSubmit={handleUpdateExclude}>
              <label
                htmlFor="name"
                className="py-4 inline-block text-base sm:text-lg lg:text-xl font-medium">
                Exclude:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Exclude Title"
                value={excludeTitle}
                onChange={(e) => setexcludeTitle(e.target.value)}
                className="w-full border py-3 px-3 lg:px-6 rounded-md focus:outline-none focus:border focus:border-primary outline-1"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5 lg:mt-7">
                Update Exclude
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
