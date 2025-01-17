"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import Pagination from "@/components/vendor-dashboard/Pagination";
import { StarIcon } from "@heroicons/react/20/solid";
import HeadlessList from "@/components/ListBox";
import { Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@/public/data/icons";

const ITEMS_PER_PAGE = 10; // Customize the number of items per page

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [packageIdToDelete, setPackageIdToDelete] = useState<string | null>(null);
  const [pkgs, setPkgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); 

  const openModal = (pkg: { name: string; id: string }) => {
    setPackageToDelete(pkg.name);
    setPackageIdToDelete(pkg.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPackageToDelete(null);
    setPackageIdToDelete(null);
  };

  const handleDelete = async () => {
    if (packageIdToDelete) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/delete_package_by_id/${packageIdToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setPkgs((prevPkgs) =>
            prevPkgs.filter((pkg) => pkg.id !== packageIdToDelete)
          );
          alert("Package Deleted");
        } else {
          console.error("Error deleting package:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting package:", error);
      } finally {
        closeModal();
      }
    }
  };

  useEffect(() => {
    const fetchPkgs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/admin/get_package"
        );
        const data = await response.json();
        if (data) {
          setPkgs(data);
        }
      } catch (error) {
        console.error("Error fetching pkgs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPkgs();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPkgs = pkgs.filter((pkg) =>
    Object.values(pkg).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const paginatedPkgs = filteredPkgs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Package</h2>
        <Link href="/package/add-new-package" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Package
        </Link>
      </div>



      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">

          <div className="flex flex-wrap gap-3 justify-between mb-7">
            <form className="flex flex-wrap items-center gap-3">
              <div className="border rounded-full flex items-center p-1 pr-2 xl:pr-4 bg-[var(--bg-1)]">
              <input
                  type="text"
                  placeholder="Search"
                  className="rounded-full bg-transparent focus:outline-none p-2 xl:px-4"
                  value={searchQuery} // Bind the search input to state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                />
                <SearchIcon />
              </div>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Location</th>
                  <th className="py-3 lg:py-4 px-2 md:px-5">Package Name</th>
                  <th className="py-3 lg:py-4 px-2">Sale Price</th>
                  <th className="py-3 lg:py-4 px-2">Pickup Point</th>
                  <th className="py-3 lg:py-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPkgs.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                  >
                    <td className="py-3 lg:py-4 px-2">
                      {pkg.created_at.split("T")[0]}
                    </td>
                    <td className="py-3 lg:py-4 px-2">
                      {pkg.location_name}
                    </td>
                    <td className="py-3 lg:py-4 px-2 md:px-5">
                      <Link
                        href={`/package/edit-package?packageId=${pkg.id}`}
                        className="text-primary"
                      >
                        {pkg.package_title}
                      </Link>
                    </td>
                    <td className="py-3 lg:py-4 px-2 max-w-[200px] overflow-hidden whitespace-normal break-words">
                      {pkg.sale_price}
                    </td>

                    <td className="py-3 lg:py-4 px-2">
                      <span className="flex gap-1 items-center">
                        {pkg.pickup_point}
                      </span>
                    </td>
                    <td className="py-3 lg:py-7 px-2 flex gap-2 items-center">
                      <a
                        href={`/package/edit-package?packageId=${pkg.id}`}
                        className="text-primary"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </a>
                      <button
                        className="text-[var(--secondary-500)]"
                        onClick={() =>
                          openModal({ name: pkg.package_name, id: pkg.id })
                        }
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              totalItems={pkgs.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Package
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the package{" "}
                      <span className="font-bold">{packageToDelete}</span>? This
                      action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-4 justify-end">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Footer />
    </div>
  );
};

export default Page;
