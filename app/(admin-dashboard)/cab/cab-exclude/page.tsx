"use client";

import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import CheckboxCustom from "@/components/Checkbox";
import { SearchIcon } from "@/public/data/icons";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { Dialog, Transition } from "@headlessui/react";

interface Exclude {
  id: number; // Ensure the id is of type string if that's what your API returns
  cab_exclusion_title: string;
}

const Page = () => {
  const [excludes, setExcludes] = useState<Exclude[]>([]);
  const [excludeTitle, setExcludeName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExcludes, setFilteredExcludes] = useState<Exclude[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchExcludes();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, excludes]);

  const fetchExcludes = async () => {
    setLoading(true);
    setError(null); // Reset the error state

    const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/get_cab_exclusion");

    // If response is OK, process it, otherwise, it will fail silently
    if (response.ok) {
      const data = await response.json();
      setExcludes(data);
      setFilteredExcludes(data); // Initialize filteredExcludes
    }

    setLoading(false); // Always execute loading state reset
  };


  const handleSearch = () => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = excludes.filter((exclude) =>
      exclude.cab_exclusion_title.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredExcludes(filtered);
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleAddExclude = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitError(null);
  
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await fetch("https://yrpitsolutions.com/tourism_api/api/admin/save_cab_exclusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cab_exclusion_title: excludeTitle }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save exclude");
      }
  
      setExcludeName("");
      await fetchExcludes();
      alert("Exclude Added Successfully");
  
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message || "An unexpected error occurred"}`);
    }
  };
  

  const handleDeleteExclude = async () => {
    if (!itemToDelete) return;

    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `https://yrpitsolutions.com/tourism_api/api/admin/delete_cab_exclusion_by_id/${itemToDelete}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // You can log or handle the error here if needed, or just let it fail silently
      alert("Failed to delete exclude");
      return;
    }

    await fetchExcludes();
    alert("Deleted Successfully");

    setIsDialogOpen(false); // Close dialog
    setItemToDelete(null); // Reset ID
  };


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExcludes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">Cab Excludes</h2>
      </div>

      <section className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 px-3 md:px-6 bg-[var(--bg-2)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0 after:z-[-1] pb-10 xxl:pb-0">
        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <h3 className="border-b h3 pb-6">Add Exclude</h3>
            <form onSubmit={handleAddExclude}>
              <label htmlFor="name" className="py-4 inline-block text-base font-medium">
                Exclude :
              </label>
              <input
                type="text"
                id="name"
                placeholder="Exclude name"
                value={excludeTitle}
                onChange={(e) => setExcludeName(e.target.value)}
                className="w-full border py-3 px-3 rounded-md focus:outline-none"
              />
              {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
              <button type="submit" className="btn-primary mt-5">Add New</button>
            </form>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="p-4 md:p-6 lg:p-10 rounded-2xl bg-white">
            <div className="flex justify-between mb-7">
              <div className="border rounded-full flex items-center p-1 pr-2 bg-[var(--bg-1)]">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left bg-[var(--bg-1)] border-b">
                    <th className="py-3 px-2">Exclude Name</th>
                    <th className="py-3 px-2">Action</th>
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
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3">No Exclude Available</td>
                    </tr>
                  ) : (
                    currentItems.map((exclude) => (
                      <tr key={exclude.id} className="border-b hover:bg-[var(--bg-1)]">
                        <td className="py-3 px-2">{exclude.cab_exclusion_title}</td>
                        <td className="py-3 px-2 flex gap-2">
                          <Link href={`/cab/edit-cab-exclude?excludeId=${exclude.id}`} className="text-primary">
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => {
                              setItemToDelete(exclude.id as number);
                              setIsDialogOpen(true);
                            }}
                            className="text-[var(--secondary-500)]"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <Pagination
                totalItems={filteredExcludes.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Confirmation Dialog */}
      <Transition show={isDialogOpen} as="div">
        <Dialog onClose={() => setIsDialogOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75" />
            <div className="relative bg-white rounded-lg max-w-sm w-full p-6">
              <Dialog.Title className="text-xl font-semibold">Confirm Deletion</Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600">
                Are you sure you want to delete this item? This action cannot be undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteExclude}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Page;
