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
import { Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@/public/data/icons";

const ITEMS_PER_PAGE = 10; // Customize the number of items per page

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [bannerIdToDelete, setBannerIdToDelete] = useState<string | null>(null);
  const [bnrs, setBnrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (banner: { name: string; id: string }) => {
    setBannerToDelete(banner.name);
    setBannerIdToDelete(banner.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setBannerToDelete(null);
    setBannerIdToDelete(null);
  };

  const handleDelete = async () => {
    if (bannerIdToDelete) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/admin/delete_home_banner_by_id/${bannerIdToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setBnrs((prevBnrs) =>
            prevBnrs.filter((bnr) => bnr.id !== bannerIdToDelete)
          );
          alert("Banner Deleted");
        } else {
          console.error("Error deleting banner:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
      } finally {
        closeModal();
      }
    }
  };

  useEffect(() => {
    const fetchBnrs = async () => {
      try {
        const response = await fetch(
          "https://yrpitsolutions.com/tourism_api/api/get_all_home_banner"
        );
        const data = await response.json();
        setBnrs(data.data);
      } catch (error) {
        console.error("Error fetching bnrs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBnrs();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  const filteredBnrs = (bnrs || []).filter((bnr) =>
    Object.values(bnr).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );



  const paginatedBnrs = filteredBnrs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <div className="flex items-center justify-between flex-wrap px-3 py-5 md:p-[30px] gap-5 lg:p-[60px] bg-[var(--dark)]">
        <h2 className="h2 text-white">All Banners</h2>
        <Link href="/banner/add-banner" className="btn-primary">
          <PlusCircleIcon className="w-5 h-5" /> Add New Banner
        </Link>
      </div>

      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[60px] after:top-0 after:left-0">
        <div className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
          <div className="flex flex-wrap gap-3 justify-between mb-7">
          </div>
          <div className="overflow-x-auto">
            {/* Check if there are no banners */}
            {filteredBnrs.length === 0 ? (
              <div className="text-center py-5 text-gray-500">
                No banner found
              </div>
            ) : (
              <table className="w-full table-auto whitespace-nowrap">
                <thead>
                  <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                    <th className="py-3 lg:py-4 px-2 md:px-5">Desktop Banner</th>
                    <th className="py-3 lg:py-4 px-2">Mobile Banner</th>
                    <th className="py-3 lg:py-4 px-2">Headline</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBnrs.map((bnr) => (
                    <tr
                      key={bnr.id}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300"
                    >

                      <td className="py-3 lg:py-4 px-2">
                        {bnr.desktop_banner && (
                          <img
                            src={bnr.desktop_banner}
                            alt="Desktop Banner"
                            className="w-48 md:w-72 lg:w-96 h-auto object-cover rounded-lg" // Wider for desktop
                          />
                        )}
                      </td>
                      <td className="py-3 lg:py-4 px-2 md:px-5">
                        {bnr.mobile_banner && (

                          <img
                            src={bnr.mobile_banner}
                            alt="Mobile Banner"
                            className="w-48 md:w-72 lg:w-[150px] h-[250px] object-cover rounded-lg"  // Smaller for mobile
                          />
                        )}
                      </td>
                      <td className="py-3 lg:py-4 px-2 max-w-[200px]">
                        <p className="truncate">{bnr.title}</p>
                      </td>


                      <td className="py-3 lg:py-7 px-2 flex gap-2 items-center">
                        <a
                          href={`/banner/edit-banner?bannerId=${bnr.id}`}
                          className="text-primary"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </a>
                        <button
                          className="text-[var(--secondary-500)]"
                          onClick={() =>
                            openModal({ name: bnr.banner_name, id: bnr.id })
                          }
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {filteredBnrs.length > 0 && (
              <Pagination
                totalItems={filteredBnrs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
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
                    Delete Banner
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the banner{" "}
                      <span className="font-bold">{bannerToDelete}</span>? This
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
